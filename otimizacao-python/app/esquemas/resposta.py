from typing import List, Optional
from pydantic import BaseModel


class ItemSelecionadoResposta(BaseModel):
    categoria: str
    product_id: int
    nome: str
    marca: str
    gramatura: str
    quantidade: int
    preco_unitario_centavos: int
    subtotal_centavos: int
    classificacao: str


class RespostaOtimizacao(BaseModel):
    status: str
    mensagem: Optional[str] = None
    supermercado_id: int
    orcamento_inicial_centavos: int
    total_gasto_centavos: int
    troco_centavos: int
    itens_obrigatorios_selecionados: List[ItemSelecionadoResposta]
    itens_otimizados: List[ItemSelecionadoResposta]
    avisos: List[str]