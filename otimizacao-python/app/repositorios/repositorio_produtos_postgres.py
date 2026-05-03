from app.dominio.entidades import Produto
from app.infra.banco import BancoPostgres
from app.repositorios.repositorio_produtos import RepositorioProdutos


class RepositorioProdutosPostgres(RepositorioProdutos):
    def buscar_por_supermercado(self, supermercado_id: int) -> list[Produto]:
        query = """
            SELECT
                p.id,
                p.nome,
                p.marca,
                CAST(p.gramatura AS TEXT) AS gramatura,
                p.preco_centavos,
                p.supermercado_id,
                c.nome AS categoria
            FROM produto p
            INNER JOIN categoria c ON c.id = p.categoria_id
            INNER JOIN supermercado s ON s.id = p.supermercado_id
            WHERE p.supermercado_id = %s
              AND s.ativo = true
        """

        with BancoPostgres.conectar() as conexao:
            with conexao.cursor() as cursor:
                cursor.execute(query, (supermercado_id,))
                linhas = cursor.fetchall()

        return [
            Produto(
                id=linha["id"],
                nome=linha["nome"],
                categoria=linha["categoria"],
                marca=linha["marca"],
                gramatura=str(linha["gramatura"]),
                preco_centavos=int(linha["preco_centavos"]),
                supermercado_id=linha["supermercado_id"],
            )
            for linha in linhas
        ]