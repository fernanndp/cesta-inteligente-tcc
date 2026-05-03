import json
from pathlib import Path
from app.dominio.entidades import Produto
from app.repositorios.repositorio_produtos import RepositorioProdutos


class RepositorioProdutosMock(RepositorioProdutos):
    def __init__(self) -> None:
        pasta_base = Path(__file__).resolve().parent.parent
        self.caminho_arquivo = pasta_base / "dados" / "produtos_mock.json"

    def buscar_por_supermercado(self, supermercado_id: int) -> list[Produto]:
        with self.caminho_arquivo.open("r", encoding="utf-8") as arquivo:
            linhas = json.load(arquivo)

        return [
            Produto(**linha)
            for linha in linhas
            if linha["supermercado_id"] == supermercado_id
        ]