// Tipos baseados na entidade Java Produto
export interface Produto {
  id: number
  nome: string
  marca: string
  categoria: string
  gramatura: string
  preco: number
  supermercadoId: number
}

export type Prioridade = "desejado" | "prioritario"

export type TipoRestricao = "marca" | "nome"

export interface Restricao {
  tipo: TipoRestricao
  valor: string
}

export interface ItemLista {
  produto: Produto
  prioridade: Prioridade
  restricao: Restricao | null
}

export interface RequestPayload {
  itens: {
    produtoId: number
    prioridade: Prioridade
    restricao: Restricao | null
  }[]
  valorDisponivel: number
}
