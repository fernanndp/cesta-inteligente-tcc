import type { Classificacao } from "@/lib/types";

export const CLASSIFICACOES: Classificacao[] = [
  "obrigatorio",
  "prioritario",
  "desejado",
];

export const LABEL_CLASSIFICACAO: Record<Classificacao, string> = {
  obrigatorio: "Obrigatório",
  prioritario: "Prioritário",
  desejado: "Desejado",
};

export const DESCRICAO_CLASSIFICACAO: Record<Classificacao, string> = {
  obrigatorio: "Sempre incluído na cesta, custe o que custar.",
  prioritario: "Priorizado pelo algoritmo dentro do orçamento.",
  desejado: "Incluído se houver orçamento disponível.",
};

/** Variante de Badge associada a cada classificação. */
export function varianteClassificacao(
  classificacao: Classificacao,
): "default" | "secondary" | "destructive" | "outline" {
  switch (classificacao) {
    case "obrigatorio":
      return "destructive";
    case "prioritario":
      return "default";
    default:
      return "secondary";
  }
}

export function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
