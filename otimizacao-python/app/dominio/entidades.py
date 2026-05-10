from dataclasses import dataclass


@dataclass(frozen=True)
class Produto:
    id: int
    nome: str
    categoria: str
    marca: str
    gramatura: str
    preco_centavos: int
    supermercado_id: int

    def categoria_normalizada(self) -> str:
        return self.categoria.strip().lower()

    def marca_normalizada(self) -> str:
        return self.marca.strip().lower()

    def gramatura_normalizada(self) -> str:
        return self.gramatura.strip().lower()


@dataclass(frozen=True)
class ItemSelecionado:
    categoria: str
    product_id: int
    nome: str
    marca: str
    gramatura: str
    quantidade: int
    preco_unitario_centavos: int
    subtotal_centavos: int
    classificacao: str