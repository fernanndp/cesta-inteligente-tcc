export interface Produto {
  id: number
  nome: string
  marca: string
  categoria: string
  gramatura: string
  preco: number
  supermercadoId: number
}

export interface Supermercado {
  id: number
  nome: string
  rede: string
  ativo: boolean
}

export type Classificacao = "obrigatorio" | "prioritario" | "desejado"

export interface ItemLista {
  categoria: string
  produto: Produto | null
  classificacao: Classificacao
  quantidade: number
  marca: string | null
  gramatura: string | null
}

export interface ItemEntradaOtimizador {
  categoria: string
  classificacao: Classificacao
  quantidade: number
  marca: string | null
  gramatura: string | null
  marca_preferida: string | null
  gramatura_preferida: string | null
}

export interface RequisicaoOtimizacao {
  supermercado_id: number
  orcamento_centavos: number
  itens: ItemEntradaOtimizador[]
  itens_proibidos: { product_id: number }[]
  semente_aleatoria: number | null
}

export interface ItemSelecionadoResposta {
  categoria: string
  product_id: number
  nome: string
  marca: string
  gramatura: string
  quantidade: number
  preco_unitario_centavos: number
  subtotal_centavos: number
  classificacao: string
}

export interface RespostaOtimizacao {
  status: string
  mensagem: string | null
  supermercado_id: number
  orcamento_inicial_centavos: number
  total_gasto_centavos: number
  troco_centavos: number
  itens_obrigatorios_selecionados: ItemSelecionadoResposta[]
  itens_otimizados: ItemSelecionadoResposta[]
  avisos: string[]
}
