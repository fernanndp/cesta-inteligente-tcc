import type { Classificacao, ItemLista } from "@/lib/types";

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

/**
 * Restrições efetivas de marca e gramatura de um item.
 *
 * Regra: a referência de produto, quando presente, é a restrição mais
 * específica — sua marca e gramatura prevalecem sobre valores manuais.
 * Sem referência, valem as restrições preenchidas manualmente.
 */
export function restricoesEfetivas(
  item: Pick<ItemLista, "produto" | "marca" | "gramatura">,
): { marca: string | null; gramatura: string | null } {
  return {
    marca: item.produto?.marca ?? item.marca,
    gramatura: item.produto?.gramatura ?? item.gramatura,
  };
}

export function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
