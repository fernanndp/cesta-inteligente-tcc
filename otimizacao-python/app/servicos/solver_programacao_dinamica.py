import random
from dataclasses import dataclass
from app.dominio.entidades import Produto, ItemSelecionado
from app.dominio.enums import ClassificacaoItem
from app.esquemas.requisicao import ItemEntrada


@dataclass
class EstadoDP:
    qtd_prioritarios_atendidos: int
    qtd_total_atendidos: int
    custo_total: int
    itens_escolhidos: list[ItemSelecionado]


class SolverProgramacaoDinamica:
    def __init__(self, semente_aleatoria: int | None = None) -> None:
        self._random = random.Random(semente_aleatoria)

    def resolver(
        self,
        grupos: list[tuple[ItemEntrada, list[Produto]]],
        orcamento_restante: int,
    ) -> tuple[list[ItemSelecionado], int]:
        dp: dict[int, EstadoDP] = {
            0: EstadoDP(
                qtd_prioritarios_atendidos=0,
                qtd_total_atendidos=0,
                custo_total=0,
                itens_escolhidos=[],
            )
        }

        for item_entrada, candidatos in grupos:
            novo_dp = dict(dp)

            for orcamento_atual, estado_atual in dp.items():
                for produto in candidatos:
                    custo_item = produto.preco_centavos * item_entrada.quantidade
                    novo_orcamento = orcamento_atual + custo_item

                    if novo_orcamento > orcamento_restante:
                        continue

                    item_selecionado = ItemSelecionado(
                        categoria=produto.categoria,
                        product_id=produto.id,
                        nome=produto.nome,
                        marca=produto.marca,
                        gramatura=produto.gramatura,
                        quantidade=item_entrada.quantidade,
                        preco_unitario_centavos=produto.preco_centavos,
                        subtotal_centavos=custo_item,
                        classificacao=item_entrada.classificacao.value,
                    )

                    proximo_estado = EstadoDP(
                        qtd_prioritarios_atendidos=(
                            estado_atual.qtd_prioritarios_atendidos
                            + (1 if item_entrada.classificacao == ClassificacaoItem.PRIORITARIO else 0)
                        ),
                        qtd_total_atendidos=estado_atual.qtd_total_atendidos + 1,
                        custo_total=estado_atual.custo_total + custo_item,
                        itens_escolhidos=estado_atual.itens_escolhidos + [item_selecionado],
                    )

                    estado_existente = novo_dp.get(novo_orcamento)
                    if estado_existente is None:
                        novo_dp[novo_orcamento] = proximo_estado
                        continue

                    comparacao = self._comparar_estados(proximo_estado, estado_existente)
                    if comparacao > 0:
                        novo_dp[novo_orcamento] = proximo_estado
                    elif comparacao == 0 and self._random.choice([True, False]):
                        novo_dp[novo_orcamento] = proximo_estado

            dp = novo_dp

        melhor_orcamento = 0
        melhor_estado = EstadoDP(0, 0, 0, [])

        for gasto, estado in dp.items():
            comparacao = self._comparar_estados(estado, melhor_estado)
            if comparacao > 0:
                melhor_estado = estado
                melhor_orcamento = gasto
            elif comparacao == 0 and self._random.choice([True, False]):
                melhor_estado = estado
                melhor_orcamento = gasto

        return melhor_estado.itens_escolhidos, melhor_orcamento

    @staticmethod
    def _comparar_estados(candidato: EstadoDP, atual: EstadoDP) -> int:
        if candidato.qtd_prioritarios_atendidos != atual.qtd_prioritarios_atendidos:
            return 1 if candidato.qtd_prioritarios_atendidos > atual.qtd_prioritarios_atendidos else -1

        if candidato.qtd_total_atendidos != atual.qtd_total_atendidos:
            return 1 if candidato.qtd_total_atendidos > atual.qtd_total_atendidos else -1

        if candidato.custo_total != atual.custo_total:
            return 1 if candidato.custo_total < atual.custo_total else -1

        return 0