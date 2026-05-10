from app.dominio.entidades import Produto, ItemSelecionado
from app.dominio.enums import ClassificacaoItem
from app.esquemas.requisicao import RequisicaoOtimizacao, ItemEntrada
from app.esquemas.resposta import RespostaOtimizacao, ItemSelecionadoResposta
from app.servicos.servico_filtro_produtos import ServicoFiltroProdutos
from app.servicos.solver_programacao_dinamica import SolverProgramacaoDinamica


class ServicoOtimizacao:
    def __init__(self, semente_aleatoria: int | None = None) -> None:
        self._filtro = ServicoFiltroProdutos()
        self._solver = SolverProgramacaoDinamica(semente_aleatoria=semente_aleatoria)

    def otimizar(
        self,
        requisicao: RequisicaoOtimizacao,
        produtos: list[Produto],
    ) -> RespostaOtimizacao:
        itens_proibidos = requisicao.itens_proibidos or []

        ids_proibidos = {
            item.product_id
            for item in itens_proibidos
            if item.product_id is not None
        }

        produtos_disponiveis = [
            p for p in produtos
            if p.id not in ids_proibidos
        ]

        if not produtos:
            return self._montar_resposta(
                status="inviavel",
                mensagem=(
                    "Não foi possível otimizar a cesta porque o supermercado informado "
                    "não existe, está inativo ou não possui produtos cadastrados."
                ),
                requisicao=requisicao,
                obrigatorios=[],
                otimizados=[],
                total_gasto=0,
                avisos=[
                    f"Nenhum produto foi encontrado para o supermercado_id "
                    f"{requisicao.supermercado_id}."
                ],
            )

        itens_obrigatorios = [
            i for i in requisicao.itens
            if i.classificacao == ClassificacaoItem.OBRIGATORIO
        ]

        itens_para_otimizar = [
            i for i in requisicao.itens
            if i.classificacao in {
                ClassificacaoItem.PRIORITARIO,
                ClassificacaoItem.DESEJADO,
            }
        ]

        obrigatorios_selecionados, custo_obrigatorios, avisos_obrigatorios = (
            self._resolver_itens_obrigatorios(
                produtos_originais=produtos,
                produtos_disponiveis=produtos_disponiveis,
                itens_obrigatorios=itens_obrigatorios,
            )
        )

        avisos = list(avisos_obrigatorios)

        if avisos_obrigatorios:
            return self._montar_resposta(
                status="inviavel",
                mensagem=(
                    "Não foi possível otimizar a cesta porque há item obrigatório "
                    "sem produto compatível disponível."
                ),
                requisicao=requisicao,
                obrigatorios=obrigatorios_selecionados,
                otimizados=[],
                total_gasto=custo_obrigatorios,
                avisos=avisos,
            )

        orcamento_restante = requisicao.orcamento_centavos - custo_obrigatorios

        if orcamento_restante < 0:
            return self._montar_resposta(
                status="inviavel",
                mensagem="Os itens obrigatórios selecionados excedem o orçamento total.",
                requisicao=requisicao,
                obrigatorios=obrigatorios_selecionados,
                otimizados=[],
                total_gasto=custo_obrigatorios,
                avisos=avisos,
            )

        grupos = self._montar_grupos_otimizacao(
            produtos=produtos_disponiveis,
            itens=itens_para_otimizar,
        )

        itens_otimizados, custo_otimizados = self._solver.resolver(
            grupos=grupos,
            orcamento_restante=orcamento_restante,
        )

        total_gasto = custo_obrigatorios + custo_otimizados

        avisos += self._gerar_avisos_pos_calculo(
            itens_solicitados=itens_para_otimizar,
            itens_selecionados=itens_otimizados,
        )

        mensagem = "Cesta otimizada com sucesso."

        if avisos:
            mensagem = (
                "Cesta otimizada parcialmente. Nem todas as categorias "
                "solicitadas puderam ser incluídas dentro do orçamento."
            )

        return self._montar_resposta(
            status="ok",
            mensagem=mensagem,
            requisicao=requisicao,
            obrigatorios=obrigatorios_selecionados,
            otimizados=itens_otimizados,
            total_gasto=total_gasto,
            avisos=avisos,
        )

    def _resolver_itens_obrigatorios(
        self,
        produtos_originais: list[Produto],
        produtos_disponiveis: list[Produto],
        itens_obrigatorios: list[ItemEntrada],
    ) -> tuple[list[ItemSelecionado], int, list[str]]:
        selecionados: list[ItemSelecionado] = []
        avisos: list[str] = []
        total = 0

        for item in itens_obrigatorios:
            candidatos_antes = [
                p for p in produtos_originais
                if self._filtro.produto_atende_restricoes(p, item)
            ]

            candidatos = [
                p for p in produtos_disponiveis
                if self._filtro.produto_atende_restricoes(p, item)
            ]

            if not candidatos_antes:
                avisos.append(
                    f"Não existe produto compatível para o item obrigatório "
                    f"'{item.categoria}' neste supermercado."
                )
                continue

            if not candidatos:
                avisos.append(
                    f"'{item.categoria}' foi marcado como obrigatório, mas todas "
                    f"as opções disponíveis foram proibidas."
                )
                continue

            menor_preco = min(p.preco_centavos for p in candidatos)
            empatados = [p for p in candidatos if p.preco_centavos == menor_preco]
            escolhido = sorted(empatados, key=lambda p: p.id)[0]

            item_selecionado = ItemSelecionado(
                categoria=escolhido.categoria,
                product_id=escolhido.id,
                nome=escolhido.nome,
                marca=escolhido.marca,
                gramatura=escolhido.gramatura,
                quantidade=item.quantidade,
                preco_unitario_centavos=escolhido.preco_centavos,
                subtotal_centavos=escolhido.preco_centavos * item.quantidade,
                classificacao=item.classificacao.value,
            )

            selecionados.append(item_selecionado)
            total += item_selecionado.subtotal_centavos

        return selecionados, total, avisos

    def _montar_grupos_otimizacao(
        self,
        produtos: list[Produto],
        itens: list[ItemEntrada],
    ) -> list[tuple[ItemEntrada, list[Produto]]]:
        grupos: list[tuple[ItemEntrada, list[Produto]]] = []

        for item in itens:
            candidatos = [
                p for p in produtos
                if self._filtro.produto_atende_restricoes(p, item)
            ]
            grupos.append((item, candidatos))

        return grupos

    def _gerar_avisos_pos_calculo(
        self,
        itens_solicitados: list[ItemEntrada],
        itens_selecionados: list[ItemSelecionado],
    ) -> list[str]:
        avisos: list[str] = []

        categorias_selecionadas = {
            self._normalizar_categoria(item.categoria)
            for item in itens_selecionados
        }

        categorias_nao_atendidas: list[str] = []
        categorias_ja_verificadas: set[str] = set()

        for item in itens_solicitados:
            categoria_normalizada = self._normalizar_categoria(item.categoria)

            if categoria_normalizada in categorias_ja_verificadas:
                continue

            categorias_ja_verificadas.add(categoria_normalizada)

            if categoria_normalizada not in categorias_selecionadas:
                categorias_nao_atendidas.append(item.categoria)

        if categorias_nao_atendidas:
            categorias = ", ".join(categorias_nao_atendidas)

            avisos.append(
                "Não foi possível atender todas as categorias solicitadas "
                f"dentro do orçamento: {categorias}."
            )

        return avisos

    @staticmethod
    def _normalizar_categoria(categoria: str) -> str:
        return categoria.strip().lower()

    def _montar_resposta(
        self,
        status: str,
        mensagem: str,
        requisicao: RequisicaoOtimizacao,
        obrigatorios: list[ItemSelecionado],
        otimizados: list[ItemSelecionado],
        total_gasto: int,
        avisos: list[str],
    ) -> RespostaOtimizacao:
        if status == "ok":
            itens_da_cesta_otimizada = obrigatorios + otimizados
        else:
            itens_da_cesta_otimizada = otimizados

        return RespostaOtimizacao(
            status=status,
            mensagem=mensagem,
            supermercado_id=requisicao.supermercado_id,
            orcamento_inicial_centavos=requisicao.orcamento_centavos,
            total_gasto_centavos=total_gasto,
            troco_centavos=max(0, requisicao.orcamento_centavos - total_gasto),
            itens_obrigatorios_selecionados=[
                self._mapear_item(i) for i in obrigatorios
            ],
            itens_otimizados=[
                self._mapear_item(i) for i in itens_da_cesta_otimizada
            ],
            avisos=avisos,
        )

    @staticmethod
    def _mapear_item(item: ItemSelecionado) -> ItemSelecionadoResposta:
        return ItemSelecionadoResposta(
            categoria=item.categoria,
            product_id=item.product_id,
            nome=item.nome,
            marca=item.marca,
            gramatura=item.gramatura,
            quantidade=item.quantidade,
            preco_unitario_centavos=item.preco_unitario_centavos,
            subtotal_centavos=item.subtotal_centavos,
            classificacao=item.classificacao,
        )