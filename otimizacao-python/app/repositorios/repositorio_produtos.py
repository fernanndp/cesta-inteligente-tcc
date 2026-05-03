from abc import ABC, abstractmethod
from app.dominio.entidades import Produto


class RepositorioProdutos(ABC):
    @abstractmethod
    def buscar_por_supermercado(self, supermercado_id: int) -> list[Produto]:
        raise NotImplementedError