"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type {
  Produto,
  Supermercado,
  ItemLista,
  Classificacao,
  RequisicaoOtimizacao,
  RespostaOtimizacao,
  ItemSelecionadoResposta,
} from "@/lib/types";

type ApiProduto = {
  id: number;
  nome: string;
  marca: string;
  gramatura: string;
  precoCentavos: number;
  categoriaNome: string;
  supermercadoId: number;
};

type ApiSupermercado = {
  id: number;
  nome: string;
  rede: string;
  ativo: boolean;
};

type ItemProibidoLocal = {
  productId: number;
  nome: string;
  marca: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8081";
const BACKEND_API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY ?? "";

function backendHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(BACKEND_API_KEY ? { "X-API-Key": BACKEND_API_KEY } : {}),
  };
}

const LABEL_CLASSIFICACAO: Record<Classificacao, string> = {
  obrigatorio: "Obrigatório",
  prioritario: "Prioritário",
  desejado: "Desejado",
};

function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function converterProduto(p: ApiProduto): Produto {
  return {
    id: p.id,
    nome: p.nome,
    marca: p.marca,
    categoria: p.categoriaNome,
    gramatura: p.gramatura,
    preco: p.precoCentavos / 100,
    supermercadoId: p.supermercadoId,
  };
}

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [supermercados, setSupermercados] = useState<Supermercado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");

  const [supermercadoId, setSupermercadoId] = useState<number | null>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [classificacao, setClassificacao] = useState<Classificacao>("desejado");
  const [marcaConstraint, setMarcaConstraint] = useState("");
  const [gramaturaConstraint, setGramaturaConstraint] = useState("");
  const [quantidadeMinConstraint, setQuantidadeMinConstraint] = useState("");
  const [quantidadeMaxConstraint, setQuantidadeMaxConstraint] = useState("");
  const [mostrarRestricoes, setMostrarRestricoes] = useState(false);

  const [itensLista, setItensLista] = useState<ItemLista[]>([]);
  const [itensProibidos, setItensProibidos] = useState<ItemProibidoLocal[]>([]);
  const [valorDisponivel, setValorDisponivel] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<RespostaOtimizacao | null>(null);
  const [erroOtimizacao, setErroOtimizacao] = useState("");

  const [supermercadoPendente, setSupermercadoPendente] = useState<number | null>(null);
  const [dialogTrocarSupermercado, setDialogTrocarSupermercado] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [resProdutos, resSupermercados] = await Promise.all([
          fetch(`${BACKEND_URL}/api/produtos`, { headers: backendHeaders() }),
          fetch(`${BACKEND_URL}/api/supermercados`, { headers: backendHeaders() }),
        ]);

        if (!resProdutos.ok || !resSupermercados.ok) {
          throw new Error("Falha ao carregar dados");
        }

        const dadosProdutos: ApiProduto[] = await resProdutos.json();
        const dadosSupermercados: ApiSupermercado[] = await resSupermercados.json();

        setProdutos(dadosProdutos.map(converterProduto));
        setSupermercados(dadosSupermercados.filter((s) => s.ativo));
      } catch (e) {
        console.error(e);
        setErroCarregamento("Não foi possível carregar dados da API.");
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, []);

  const produtosDoSupermercado = supermercadoId
    ? produtos.filter((p) => p.supermercadoId === supermercadoId)
    : [];

  const categorias = [...new Set(produtosDoSupermercado.map((p) => p.categoria))].sort();

  const produtosNaCategoria = categoriaSelecionada
    ? produtosDoSupermercado.filter((p) => p.categoria === categoriaSelecionada)
    : [];

  const marcasDisponiveis = [...new Set(produtosNaCategoria.map((p) => p.marca))].sort();

  const gramaturasFiltradas = [...new Set(
    produtosNaCategoria
      .filter((p) => !marcaConstraint || p.marca === marcaConstraint)
      .map((p) => p.gramatura)
  )].sort();

  const produtosFiltrados = produtosNaCategoria
    .filter((p) => !marcaConstraint || p.marca === marcaConstraint)
    .filter((p) => !gramaturaConstraint || p.gramatura === gramaturaConstraint);

  const selecionarProduto = (id: number) => {
    const prod = produtos.find((p) => p.id === id) ?? null;
    setProdutoSelecionado(prod);
  };

  const resetarFormItem = () => {
    setCategoriaSelecionada("");
    setProdutoSelecionado(null);
    setMarcaConstraint("");
    setGramaturaConstraint("");
    setQuantidadeMinConstraint("");
    setQuantidadeMaxConstraint("");
    setMostrarRestricoes(false);
    setClassificacao("desejado");
  };

  const aplicarTrocaSupermercado = (novoId: number | null) => {
    setSupermercadoId(novoId);
    setItensLista([]);
    resetarFormItem();
  };

  const tentarTrocarSupermercado = (novoId: number | null) => {
    if (itensLista.length > 0) {
      setSupermercadoPendente(novoId);
      setDialogTrocarSupermercado(true);
    } else {
      aplicarTrocaSupermercado(novoId);
    }
  };

  const confirmarTrocaSupermercado = () => {
    aplicarTrocaSupermercado(supermercadoPendente);
    setDialogTrocarSupermercado(false);
    setSupermercadoPendente(null);
  };

  const cancelarTrocaSupermercado = () => {
    setDialogTrocarSupermercado(false);
    setSupermercadoPendente(null);
  };

  const adicionarItem = () => {
    if (!categoriaSelecionada) return;

    const item: ItemLista = {
      categoria: categoriaSelecionada,
      produto: produtoSelecionado,
      classificacao,
      quantidade: 1,
      marca: marcaConstraint || null,
      gramatura: gramaturaConstraint || null,
      quantidadeMin: quantidadeMinConstraint ? Number(quantidadeMinConstraint) : null,
      quantidadeMax: quantidadeMaxConstraint ? Number(quantidadeMaxConstraint) : null,
    };

    setItensLista((prev) => [...prev, item]);
    resetarFormItem();
  };

  const removerItem = (index: number) => {
    setItensLista((prev) => prev.filter((_, i) => i !== index));
  };

  const proibirItem = (item: ItemSelecionadoResposta) => {
    if (itensProibidos.some((p) => p.productId === item.product_id)) return;
    setItensProibidos((prev) => [
      ...prev,
      { productId: item.product_id, nome: item.nome, marca: item.marca },
    ]);
  };

  const removerProibido = (productId: number) => {
    setItensProibidos((prev) => prev.filter((p) => p.productId !== productId));
  };

  const novaConsulta = () => {
    setItensLista([]);
    setItensProibidos([]);
    setValorDisponivel("");
    setResultado(null);
    setErroOtimizacao("");
    setSupermercadoId(null);
    resetarFormItem();
  };

  const enviarLista = async () => {
    if (!supermercadoId || itensLista.length === 0 || !valorDisponivel) return;

    setEnviando(true);
    setResultado(null);
    setErroOtimizacao("");

    const payload: RequisicaoOtimizacao = {
      supermercado_id: supermercadoId,
      orcamento_centavos: Math.round(parseFloat(valorDisponivel) * 100),
      itens: itensLista.map((item) => ({
        categoria: item.categoria,
        classificacao: item.classificacao,
        quantidade: item.quantidade,
        marca: item.marca,
        gramatura: item.gramatura,
        marca_preferida: null,
        gramatura_preferida: null,
        quantidade_min: item.quantidadeMin,
        quantidade_max: item.quantidadeMax,
      })),
      itens_proibidos: itensProibidos.map((p) => ({ product_id: p.productId })),
      semente_aleatoria: null,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/otimizar`, {
        method: "POST",
        headers: backendHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail ?? `Erro ${response.status}`);
      }

      setResultado(data as RespostaOtimizacao);
    } catch (e: unknown) {
      setErroOtimizacao(e instanceof Error ? e.message : "Erro desconhecido.");
    } finally {
      setEnviando(false);
    }
  };

  const todosItensResultado: ItemSelecionadoResposta[] = resultado
    ? [
        ...resultado.itens_obrigatorios_selecionados,
        ...resultado.itens_otimizados.filter(
          (o) =>
            !resultado.itens_obrigatorios_selecionados.some(
              (ob) => ob.product_id === o.product_id
            )
        ),
      ]
    : [];

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-primary">Cesta Inteligente</h1>

        <AlertDialog
          open={dialogTrocarSupermercado}
          onOpenChange={(open) => {
            if (!open) cancelarTrocaSupermercado();
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Trocar de supermercado?</AlertDialogTitle>
              <AlertDialogDescription>
                Você tem {itensLista.length}{" "}
                {itensLista.length === 1 ? "item" : "itens"} na lista. Ao trocar
                de supermercado, todos os itens serão removidos. Deseja continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelarTrocaSupermercado}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmarTrocaSupermercado}>
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {erroCarregamento && (
          <p className="text-sm text-destructive">{erroCarregamento}</p>
        )}

        {/* Orçamento */}
        <Card>
          <CardHeader>
            <CardTitle>Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor disponível (R$) *</Label>
              <Input
                id="valor"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex: 150.00"
                value={valorDisponivel}
                onChange={(e) => setValorDisponivel(e.target.value)}
              />
              {!valorDisponivel && (
                <p className="text-xs text-muted-foreground">
                  Informe o orçamento antes de montar a cesta.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Adicionar Item */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {carregando && (
              <p className="text-sm text-muted-foreground">
                Carregando dados da API...
              </p>
            )}

            {/* Supermercado */}
            <div className="space-y-2">
              <Label htmlFor="supermercado">Supermercado</Label>
              <select
                id="supermercado"
                value={supermercadoId ?? ""}
                onChange={(e) =>
                  tentarTrocarSupermercado(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                disabled={carregando}
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground"
              >
                <option value="">Selecione um supermercado</option>
                {supermercados.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Categoria */}
            {supermercadoId && (
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <select
                  id="categoria"
                  value={categoriaSelecionada}
                  onChange={(e) => {
                    setCategoriaSelecionada(e.target.value);
                    setProdutoSelecionado(null);
                    setMarcaConstraint("");
                    setGramaturaConstraint("");
                    setQuantidadeMinConstraint("");
                    setQuantidadeMaxConstraint("");
                    setMostrarRestricoes(false);
                    setClassificacao("desejado");
                  }}
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground"
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Classificação */}
            {categoriaSelecionada && (
              <div className="space-y-2">
                <Label>Classificação</Label>
                <div className="flex gap-4">
                  {(["obrigatorio", "prioritario", "desejado"] as Classificacao[]).map(
                    (c) => (
                      <label
                        key={c}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="classificacao"
                          value={c}
                          checked={classificacao === c}
                          onChange={() => setClassificacao(c)}
                          className="accent-primary"
                        />
                        <span>{LABEL_CLASSIFICACAO[c]}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Restrições */}
            {categoriaSelecionada && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Restrições</Label>
                  {!mostrarRestricoes ? (
                    <button
                      type="button"
                      onClick={() => setMostrarRestricoes(true)}
                      className="text-xs text-primary hover:underline"
                    >
                      + Adicionar restrição
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMostrarRestricoes(false);
                        setMarcaConstraint("");
                        setGramaturaConstraint("");
                        setQuantidadeMinConstraint("");
                        setQuantidadeMaxConstraint("");
                        setProdutoSelecionado(null);
                      }}
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      Remover restrições
                    </button>
                  )}
                </div>

                {!mostrarRestricoes ? (
                  <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                    Sem restrição — qualquer marca, gramatura ou quantidade será aceita
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Marca */}
                      <div className="space-y-1">
                        <Label
                          htmlFor="marca-constraint"
                          className="text-xs text-muted-foreground"
                        >
                          Exigir marca
                        </Label>
                        <select
                          id="marca-constraint"
                          value={marcaConstraint}
                          onChange={(e) => {
                            setMarcaConstraint(e.target.value);
                            setGramaturaConstraint("");
                            setProdutoSelecionado(null);
                          }}
                          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
                        >
                          <option value="">Qualquer marca</option>
                          {marcasDisponiveis.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Gramatura */}
                      <div className="space-y-1">
                        <Label
                          htmlFor="gramatura-constraint"
                          className="text-xs text-muted-foreground"
                        >
                          Exigir gramatura
                        </Label>
                        <select
                          id="gramatura-constraint"
                          value={gramaturaConstraint}
                          onChange={(e) => {
                            setGramaturaConstraint(e.target.value);
                            setProdutoSelecionado(null);
                          }}
                          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
                        >
                          <option value="">Qualquer gramatura</option>
                          {gramaturasFiltradas.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Quantidade min/max */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label
                          htmlFor="qtd-min"
                          className="text-xs text-muted-foreground"
                        >
                          Quantidade mínima
                        </Label>
                        <Input
                          id="qtd-min"
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Sem mínimo"
                          value={quantidadeMinConstraint}
                          onChange={(e) => setQuantidadeMinConstraint(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor="qtd-max"
                          className="text-xs text-muted-foreground"
                        >
                          Quantidade máxima
                        </Label>
                        <Input
                          id="qtd-max"
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Sem máximo"
                          value={quantidadeMaxConstraint}
                          onChange={(e) => setQuantidadeMaxConstraint(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Referência do produto (opcional) */}
            {categoriaSelecionada && (
              <div className="space-y-2">
                <Label htmlFor="produto">
                  Referência do produto{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (opcional)
                  </span>
                </Label>
                <select
                  id="produto"
                  value={produtoSelecionado?.id ?? ""}
                  onChange={(e) => {
                    if (e.target.value) selecionarProduto(Number(e.target.value));
                    else setProdutoSelecionado(null);
                  }}
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground"
                >
                  <option value="">Nenhuma referência</option>
                  {produtosFiltrados.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} — {p.marca} ({p.gramatura})
                    </option>
                  ))}
                </select>

                {produtoSelecionado && (
                  <div className="rounded-lg border border-border bg-secondary p-3 space-y-2">
                    <p className="font-medium">{produtoSelecionado.nome}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>
                        Marca:{" "}
                        <span className="font-medium text-foreground">
                          {produtoSelecionado.marca}
                        </span>
                      </span>
                      <span>
                        Gramatura:{" "}
                        <span className="font-medium text-foreground">
                          {produtoSelecionado.gramatura}
                        </span>
                      </span>
                      <span>
                        Categoria:{" "}
                        <span className="font-medium text-foreground">
                          {produtoSelecionado.categoria}
                        </span>
                      </span>
                    </div>
                    <p className="text-base font-semibold text-primary">
                      {produtoSelecionado.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {categoriaSelecionada && (
              <Button onClick={adicionarItem} className="w-full">
                Adicionar à Lista
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Lista de Compras */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Compras ({itensLista.length} itens)</CardTitle>
          </CardHeader>
          <CardContent>
            {itensLista.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum item adicionado ainda.
              </p>
            ) : (
              <div className="space-y-3">
                {itensLista.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between rounded-lg border border-border bg-secondary p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">
                        {item.produto?.nome ?? item.categoria}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Categoria: {item.categoria}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            item.classificacao === "obrigatorio"
                              ? "bg-destructive text-destructive-foreground"
                              : item.classificacao === "prioritario"
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent text-accent-foreground"
                          }`}
                        >
                          {LABEL_CLASSIFICACAO[item.classificacao]}
                        </span>
                        {item.marca && (
                          <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                            Marca: {item.marca}
                          </span>
                        )}
                        {item.gramatura && (
                          <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                            Gramatura: {item.gramatura}
                          </span>
                        )}
                        {item.quantidadeMin !== null && (
                          <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                            Qtd mín: {item.quantidadeMin}
                          </span>
                        )}
                        {item.quantidadeMax !== null && (
                          <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                            Qtd máx: {item.quantidadeMax}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removerItem(index)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Finalizar */}
        <Card>
          <CardHeader>
            <CardTitle>Finalizar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Produtos proibidos */}
            {itensProibidos.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">
                  Produtos excluídos da próxima otimização ({itensProibidos.length})
                </Label>
                <div className="space-y-1">
                  {itensProibidos.map((p) => (
                    <div
                      key={p.productId}
                      className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm"
                    >
                      <span className="text-muted-foreground">
                        {p.nome} — {p.marca}
                      </span>
                      <button
                        onClick={() => removerProibido(p.productId)}
                        className="text-xs text-destructive hover:underline ml-4"
                      >
                        Remover exclusão
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {erroOtimizacao && (
              <p className="text-sm text-destructive">{erroOtimizacao}</p>
            )}

            <div className="flex gap-3">
              <Button
                onClick={enviarLista}
                disabled={
                  !supermercadoId ||
                  itensLista.length === 0 ||
                  !valorDisponivel ||
                  enviando
                }
                className="flex-1"
              >
                {enviando ? "Otimizando..." : resultado ? "Re-otimizar" : "Otimizar Cesta"}
              </Button>
              {resultado && (
                <Button variant="outline" onClick={novaConsulta} className="flex-1">
                  Nova consulta
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resultado */}
        {resultado && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                Resultado da Otimização
                <span
                  className={`text-sm px-2 py-1 rounded font-normal ${
                    resultado.status === "ok"
                      ? "bg-green-100 text-green-800"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {resultado.status === "ok" ? "Viável" : "Inviável"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resultado.mensagem && (
                <p className="text-sm text-muted-foreground">{resultado.mensagem}</p>
              )}

              {/* Resumo financeiro */}
              <div className="grid grid-cols-3 gap-4 rounded-lg bg-secondary p-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Orçamento</p>
                  <p className="font-semibold">
                    {formatarPreco(resultado.orcamento_inicial_centavos)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total gasto</p>
                  <p className="font-semibold">
                    {formatarPreco(resultado.total_gasto_centavos)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Troco</p>
                  <p className="font-semibold">
                    {formatarPreco(resultado.troco_centavos)}
                  </p>
                </div>
              </div>

              {/* Itens selecionados */}
              {todosItensResultado.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium text-sm">
                    Itens selecionados ({todosItensResultado.length})
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      — clique em "Proibir" para excluir da próxima otimização
                    </span>
                  </p>
                  {todosItensResultado.map((item, i) => {
                    const jaProibido = itensProibidos.some(
                      (p) => p.productId === item.product_id
                    );
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-md border px-4 py-2 text-sm gap-4 ${
                          jaProibido
                            ? "border-destructive/30 bg-destructive/5 opacity-50"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span
                            className={`shrink-0 text-xs px-1.5 py-0.5 rounded ${
                              item.classificacao === "obrigatorio"
                                ? "bg-destructive text-destructive-foreground"
                                : item.classificacao === "prioritario"
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent text-accent-foreground"
                            }`}
                          >
                            {LABEL_CLASSIFICACAO[item.classificacao as Classificacao] ??
                              item.classificacao}
                          </span>
                          <span className="truncate">
                            {item.nome} — {item.marca} ({item.gramatura}) ×{" "}
                            {item.quantidade}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-medium">
                            {formatarPreco(item.subtotal_centavos)}
                          </span>
                          <button
                            onClick={() =>
                              jaProibido
                                ? removerProibido(item.product_id)
                                : proibirItem(item)
                            }
                            className={`text-xs hover:underline ${
                              jaProibido
                                ? "text-muted-foreground"
                                : "text-destructive"
                            }`}
                          >
                            {jaProibido ? "Desfazer" : "Proibir"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Avisos */}
              {resultado.avisos.length > 0 && (
                <div className="space-y-1">
                  <p className="font-medium text-sm">Avisos</p>
                  {resultado.avisos.map((aviso, i) => (
                    <p key={i} className="text-sm text-yellow-600">
                      {aviso}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
