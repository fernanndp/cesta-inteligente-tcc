"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Produto, ItemLista, Prioridade, TipoRestricao, Restricao, RequestPayload } from "@/lib/types";

type ApiProduto = {
  id: number;
  nome: string;
  marca: string;
  gramatura: string;
  precoCentavos: number;
  categoriaNome: string;
  supermercadoId: number;
};

const PRODUTOS_API_URL = "http://localhost:8080/api/produtos";

// Formata preço em BRL
function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function converterProdutoApi(produto: ApiProduto): Produto {
  return {
    id: produto.id,
    nome: produto.nome,
    marca: produto.marca,
    categoria: produto.categoriaNome,
    gramatura: produto.gramatura,
    preco: produto.precoCentavos / 100,
    supermercadoId: produto.supermercadoId,
  };
}

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [prioridade, setPrioridade] = useState<Prioridade>("desejado");
  const [tipoRestricao, setTipoRestricao] = useState<TipoRestricao>("marca");
  const [valorRestricao, setValorRestricao] = useState("");
  const [itensLista, setItensLista] = useState<ItemLista[]>([]);
  const [valorDisponivel, setValorDisponivel] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [erroProdutos, setErroProdutos] = useState("");

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setErroProdutos("");
        const response = await fetch(PRODUTOS_API_URL);

        if (!response.ok) {
          throw new Error(`Falha ao carregar produtos: ${response.status}`);
        }

        const data: ApiProduto[] = await response.json();
        setProdutos(data.map(converterProdutoApi));
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setErroProdutos("Não foi possível carregar os produtos da API.");
      } finally {
        setCarregandoProdutos(false);
      }
    };

    carregarProdutos();
  }, []);

  const categorias = [...new Set(produtos.map((produto) => produto.categoria))].sort();
  const produtosFiltrados = categoriaSelecionada
    ? produtos.filter((produto) => produto.categoria === categoriaSelecionada)
    : [];

  const adicionarItem = () => {
    if (!produtoSelecionado) return;

    const restricao: Restricao | null = valorRestricao.trim()
      ? { tipo: tipoRestricao, valor: valorRestricao.trim() }
      : null;

    const novoItem: ItemLista = { produto: produtoSelecionado, prioridade, restricao };

    setItensLista(prev => [...prev, novoItem]);
    setProdutoSelecionado(null);
    setValorRestricao("");
    setCategoriaSelecionada("");
  };

  const removerItem = (index: number) => {
    setItensLista(prev => prev.filter((_, i) => i !== index));
  };

  const enviarLista = async () => {
    if (itensLista.length === 0 || !valorDisponivel) return;

    setEnviando(true);

    const payload: RequestPayload = {
      itens: itensLista.map(item => ({
        produtoId: item.produto.id,
        prioridade: item.prioridade,
        restricao: item.restricao,
      })),
      valorDisponivel: parseFloat(valorDisponivel),
    };

    console.log("[v0] Payload a ser enviado:", JSON.stringify(payload, null, 2));
    alert("Dados prontos para envio! Verifique o console.");
    setEnviando(false);
  };

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-primary">Cesta Inteligente</h1>

        {/* Seleção de Produto */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Produto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {carregandoProdutos && (
              <p className="text-sm text-muted-foreground">
                Carregando produtos da API...
              </p>
            )}

            {erroProdutos && (
              <p className="text-sm text-destructive">
                {erroProdutos}
              </p>
            )}

            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <select
                id="categoria"
                value={categoriaSelecionada}
                onChange={(e) => {
                  setCategoriaSelecionada(e.target.value);
                  setProdutoSelecionado(null);
                }}
                disabled={carregandoProdutos || !!erroProdutos}
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Produto */}
            {categoriaSelecionada && (
              <div className="space-y-2">
                <Label htmlFor="produto">Produto</Label>
                <select
                  id="produto"
                  value={produtoSelecionado?.id ?? ""}
                  onChange={(e) => {
                    const prod = produtos.find(p => p.id === Number(e.target.value));
                    setProdutoSelecionado(prod ?? null);
                  }}
                  disabled={carregandoProdutos || !!erroProdutos}
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground"
                >
                  <option value="">Selecione um produto</option>
                  {produtosFiltrados.map(prod => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nome} - {prod.marca} ({prod.gramatura}) - {formatarPreco(prod.preco)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Prioridade */}
            {produtoSelecionado && (
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="prioridade"
                      value="desejado"
                      checked={prioridade === "desejado"}
                      onChange={() => setPrioridade("desejado")}
                      className="accent-primary"
                    />
                    <span>Desejado</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="prioridade"
                      value="prioritario"
                      checked={prioridade === "prioritario"}
                      onChange={() => setPrioridade("prioritario")}
                      className="accent-primary"
                    />
                    <span>Prioritário</span>
                  </label>
                </div>
              </div>
            )}

            {/* Restrição */}
            {produtoSelecionado && (
              <div className="space-y-2">
                <Label>Restrição (opcional)</Label>
                <div className="flex gap-2">
                  <select
                    value={tipoRestricao}
                    onChange={(e) => setTipoRestricao(e.target.value as TipoRestricao)}
                    className="rounded-md border border-border bg-input px-3 py-2 text-foreground"
                  >
                    <option value="marca">Marca</option>
                    <option value="nome">Nome</option>
                  </select>
                  <Input
                    placeholder={`Restringir por ${tipoRestricao}`}
                    value={valorRestricao}
                    onChange={(e) => setValorRestricao(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            {/* Botão Adicionar */}
            {produtoSelecionado && (
              <Button onClick={adicionarItem} className="w-full">
                Adicionar à Lista
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Lista de Itens */}
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
                      <p className="font-semibold">{item.produto.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        Marca: {item.produto.marca} | Gramatura: {item.produto.gramatura}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Categoria: {item.produto.categoria} | Preço: {formatarPreco(item.produto.preco)}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${item.prioridade === "prioritario"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground"
                          }`}>
                          {item.prioridade === "prioritario" ? "Prioritário" : "Desejado"}
                        </span>
                        {item.restricao && (
                          <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                            {item.restricao.tipo}: {item.restricao.valor}
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

        {/* Valor Disponível e Enviar */}
        <Card>
          <CardHeader>
            <CardTitle>Finalizar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Disponível (R$)</Label>
              <Input
                id="valor"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex: 150.00"
                value={valorDisponivel}
                onChange={(e) => setValorDisponivel(e.target.value)}
              />
            </div>
            <Button
              onClick={enviarLista}
              disabled={itensLista.length === 0 || !valorDisponivel || enviando}
              className="w-full"
            >
              {enviando ? "Enviando..." : "Enviar Lista"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
