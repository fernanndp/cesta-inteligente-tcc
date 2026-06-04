"use client";

import { useEffect, useState } from "react";
import type { Produto, Supermercado } from "@/lib/types";
import {
  type ApiProduto,
  type ApiSupermercado,
  backendHeaders,
  backendUrl,
  converterProduto,
} from "@/lib/api";

interface CatalogoState {
  produtos: Produto[];
  supermercados: Supermercado[];
  carregando: boolean;
  erro: string;
}

/**
 * Carrega o catálogo (produtos + supermercados ativos) do backend.
 * Mantém o data-fetching isolado da lógica de montagem da cesta.
 */
export function useCatalogo(): CatalogoState {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [supermercados, setSupermercados] = useState<Supermercado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      try {
        const [resProdutos, resSupermercados] = await Promise.all([
          fetch(backendUrl("/api/produtos"), { headers: backendHeaders() }),
          fetch(backendUrl("/api/supermercados"), { headers: backendHeaders() }),
        ]);

        if (!resProdutos.ok || !resSupermercados.ok) {
          throw new Error("Falha ao carregar dados");
        }

        const dadosProdutos: ApiProduto[] = await resProdutos.json();
        const dadosSupermercados: ApiSupermercado[] =
          await resSupermercados.json();

        if (!ativo) return;

        setProdutos(dadosProdutos.map(converterProduto));
        setSupermercados(dadosSupermercados.filter((s) => s.ativo));
      } catch (e) {
        console.error(e);
        if (ativo) setErro("Não foi possível carregar dados da API.");
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  return { produtos, supermercados, carregando, erro };
}
