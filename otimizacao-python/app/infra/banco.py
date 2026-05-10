import psycopg
from psycopg.rows import dict_row

from app.config import Config


class BancoPostgres:
    @staticmethod
    def _normalizar_url(url: str) -> str:
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql://", 1)
        return url

    @classmethod
    def conectar(cls):
        if not Config.DATABASE_URL:
            raise ValueError("DATABASE_URL não configurada.")

        url = cls._normalizar_url(Config.DATABASE_URL)

        return psycopg.connect(
            url,
            row_factory=dict_row,
        )