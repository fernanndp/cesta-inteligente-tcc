import type { Produto } from "@/lib/types";

export type ApiProduto = {
  id: number;
  nome: string;
  marca: string;
  gramatura: string;
  precoCentavos: number;
  categoriaNome: string;
  supermercadoId: number;
};

export type ApiSupermercado = {
  id: number;
  nome: string;
  rede: string;
  ativo: boolean;
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8081";
const BACKEND_API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY ?? "";

export function backendHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(BACKEND_API_KEY ? { "X-API-Key": BACKEND_API_KEY } : {}),
  };
}

export function backendUrl(path: string): string {
  return `${BACKEND_URL}${path}`;
}

export function converterProduto(p: ApiProduto): Produto {
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
