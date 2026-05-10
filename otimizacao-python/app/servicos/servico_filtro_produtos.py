from app.dominio.entidades import Produto
from app.esquemas.requisicao import ItemEntrada


class ServicoFiltroProdutos:
    @staticmethod
    def _normalizar(texto: str | None) -> str | None:
        if texto is None:
            return None
        return texto.strip().lower()

    def produto_atende_restricoes(self, produto: Produto, item: ItemEntrada) -> bool:
        if produto.categoria_normalizada() != self._normalizar(item.categoria):
            return False

        if item.marca and produto.marca_normalizada() != self._normalizar(item.marca):
            return False

        if item.gramatura and produto.gramatura_normalizada() != self._normalizar(item.gramatura):
            return False

        return True

    def produto_atende_categoria(self, produto: Produto, item: ItemEntrada) -> bool:
        return produto.categoria_normalizada() == self._normalizar(item.categoria)

    def calcular_bonus_preferencia(self, produto: Produto, item: ItemEntrada) -> int:
        bonus = 0

        if item.marca_preferida and produto.marca_normalizada() == self._normalizar(item.marca_preferida):
            bonus += 1

        if item.gramatura_preferida and produto.gramatura_normalizada() == self._normalizar(item.gramatura_preferida):
            bonus += 1

        return bonus

    def preferencia_atendida(self, produto: Produto, item: ItemEntrada) -> bool:
        return self.calcular_bonus_preferencia(produto, item) > 0