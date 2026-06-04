"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type {
  Classificacao,
  ItemLista,
  ItemProibido,
  ItemSelecionadoResposta,
  RequisicaoOtimizacao,
  RespostaOtimizacao,
} from "@/lib/types";
import { backendHeaders, backendUrl } from "@/lib/api";

/** Dados editáveis de um item, sem o `id` (gerado internamente). */
export type DadosItem = Omit<ItemLista, "id">;

function novoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Snapshot serializado das entradas que afetam o resultado da otimização. */
function snapshotEntradas(
  supermercadoId: number | null,
  valorDisponivel: string,
  itens: ItemLista[],
  proibidos: ItemProibido[],
): string {
  return JSON.stringify({
    supermercadoId,
    valorDisponivel,
    itens: itens.map((i) => ({
      categoria: i.categoria,
      classificacao: i.classificacao,
      quantidade: i.quantidade,
      marca: i.marca,
      gramatura: i.gramatura,
    })),
    proibidos: proibidos.map((p) => p.productId).sort(),
  });
}

export function useCesta() {
  const [supermercadoId, setSupermercadoId] = useState<number | null>(null);
  const [itensLista, setItensLista] = useState<ItemLista[]>([]);
  const [itensProibidos, setItensProibidos] = useState<ItemProibido[]>([]);
  const [valorDisponivel, setValorDisponivel] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<RespostaOtimizacao | null>(null);
  const [erroOtimizacao, setErroOtimizacao] = useState("");

  // Snapshot das entradas usadas na última otimização bem-sucedida.
  const [snapshotOtimizado, setSnapshotOtimizado] = useState<string | null>(
    null,
  );

  const snapshotAtual = useMemo(
    () =>
      snapshotEntradas(
        supermercadoId,
        valorDisponivel,
        itensLista,
        itensProibidos,
      ),
    [supermercadoId, valorDisponivel, itensLista, itensProibidos],
  );

  // Há resultado, mas as entradas mudaram desde então.
  const pendenteReotimizacao =
    resultado !== null && snapshotOtimizado !== snapshotAtual;

  const trocarSupermercado = useCallback((novoId: number | null) => {
    setSupermercadoId(novoId);
    setItensLista([]);
  }, []);

  const adicionarItem = useCallback((dados: DadosItem) => {
    setItensLista((prev) => [...prev, { ...dados, id: novoId() }]);
    toast.success("Item adicionado à cesta.");
  }, []);

  const atualizarItem = useCallback((id: string, dados: DadosItem) => {
    setItensLista((prev) =>
      prev.map((item) => (item.id === id ? { ...dados, id } : item)),
    );
    toast.success("Item atualizado.");
  }, []);

  const removerItem = useCallback((id: string) => {
    setItensLista((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removido da cesta.");
  }, []);

  const duplicarItem = useCallback((id: string) => {
    setItensLista((prev) => {
      const original = prev.find((item) => item.id === id);
      if (!original) return prev;
      const indice = prev.findIndex((item) => item.id === id);
      const copia: ItemLista = { ...original, id: novoId() };
      const novo = [...prev];
      novo.splice(indice + 1, 0, copia);
      return novo;
    });
    toast.success("Item duplicado.");
  }, []);

  const definirClassificacao = useCallback(
    (id: string, classificacao: Classificacao) => {
      setItensLista((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, classificacao } : item,
        ),
      );
    },
    [],
  );

  const proibirProduto = useCallback((item: ItemSelecionadoResposta) => {
    let adicionado = false;
    setItensProibidos((prev) => {
      if (prev.some((p) => p.productId === item.product_id)) return prev;
      adicionado = true;
      return [
        ...prev,
        { productId: item.product_id, nome: item.nome, marca: item.marca },
      ];
    });
    if (adicionado) {
      toast.info(`"${item.nome}" será excluído na próxima otimização.`);
    }
  }, []);

  const removerProibido = useCallback((productId: number) => {
    setItensProibidos((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const novaConsulta = useCallback(() => {
    setItensLista([]);
    setItensProibidos([]);
    setValorDisponivel("");
    setResultado(null);
    setErroOtimizacao("");
    setSupermercadoId(null);
    setSnapshotOtimizado(null);
  }, []);

  const enviarLista = useCallback(async () => {
    if (!supermercadoId || itensLista.length === 0 || !valorDisponivel) return;

    setEnviando(true);
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
      })),
      itens_proibidos: itensProibidos.map((p) => ({ product_id: p.productId })),
      semente_aleatoria: null,
    };

    try {
      const response = await fetch(backendUrl("/api/otimizar"), {
        method: "POST",
        headers: backendHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail ?? `Erro ${response.status}`);
      }

      setResultado(data as RespostaOtimizacao);
      setSnapshotOtimizado(snapshotAtual);
      toast.success("Cesta otimizada com sucesso.");
    } catch (e: unknown) {
      const mensagem =
        e instanceof Error ? e.message : "Erro desconhecido ao otimizar.";
      setErroOtimizacao(mensagem);
      toast.error(mensagem);
    } finally {
      setEnviando(false);
    }
  }, [supermercadoId, itensLista, valorDisponivel, itensProibidos, snapshotAtual]);

  const podeOtimizar =
    !!supermercadoId &&
    itensLista.length > 0 &&
    !!valorDisponivel &&
    !enviando;

  return {
    // estado
    supermercadoId,
    itensLista,
    itensProibidos,
    valorDisponivel,
    enviando,
    resultado,
    erroOtimizacao,
    pendenteReotimizacao,
    podeOtimizar,
    // setters/ações
    setValorDisponivel,
    trocarSupermercado,
    adicionarItem,
    atualizarItem,
    removerItem,
    duplicarItem,
    definirClassificacao,
    proibirProduto,
    removerProibido,
    enviarLista,
    novaConsulta,
  };
}

export type CestaController = ReturnType<typeof useCesta>;
