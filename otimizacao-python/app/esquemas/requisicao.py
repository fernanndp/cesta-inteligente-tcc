from typing import List, Optional
from pydantic import BaseModel, Field
from app.dominio.enums import ClassificacaoItem


class ItemEntrada(BaseModel):
    categoria: str = Field(..., min_length=1)
    classificacao: ClassificacaoItem
    quantidade: int = Field(1, ge=1)

    # Restrições obrigatórias do item
    marca: Optional[str] = None
    gramatura: Optional[str] = None

    # Preferências não obrigatórias
    marca_preferida: Optional[str] = None
    gramatura_preferida: Optional[str] = None


class ItemProibido(BaseModel):
    product_id: int = Field(..., gt=0)


class RequisicaoOtimizacao(BaseModel):
    supermercado_id: int = Field(..., gt=0)
    orcamento_centavos: int = Field(..., gt=0)
    itens: List[ItemEntrada] = Field(default_factory=list)
    itens_proibidos: List[ItemProibido] = Field(default_factory=list)

    # Deixa o aleatorio reproduzivel para testes e depuração
    semente_aleatoria: Optional[int] = None