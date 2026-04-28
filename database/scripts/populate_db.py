from __future__ import annotations

import os
import random
from decimal import Decimal, ROUND_HALF_UP
from urllib.parse import parse_qs, urlparse

import psycopg2


def load_dotenv_file() -> None:
	dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
	if not os.path.exists(dotenv_path):
		return

	with open(dotenv_path, "r", encoding="utf-8") as dotenv_file:
		for raw_line in dotenv_file:
			line = raw_line.strip()
			if not line or line.startswith("#") or "=" not in line:
				continue

			key, value = line.split("=", 1)
			key = key.strip()
			value = value.strip().strip("\"'")
			os.environ.setdefault(key, value)


def build_default_jdbc_url() -> str:
	host = os.getenv("DB_HOST", "localhost")
	port = os.getenv("DB_PORT", "5433")
	db_name = os.getenv("DB_NAME", "cesta_inteligente_tcc")
	sslmode = os.getenv("DB_SSLMODE", "")
	jdbc_url = f"jdbc:postgresql://{host}:{port}/{db_name}"
	if sslmode:
		jdbc_url = f"{jdbc_url}?sslmode={sslmode}"
	return jdbc_url


load_dotenv_file()

JDBC_URL = os.getenv("JDBC_URL", build_default_jdbc_url())
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

SUPERMERCADOS = (
	("Supermercado A", "Rede A", "A"),
	("Supermercado B", "Rede B", "B"),
	("Supermercado C", "Rede C", "C"),
)

CATEGORIAS = [
	"Alimentos",
	"Bebidas",
	"Higiene e Limpeza",
	"Frutas e Verduras",
	"Laticínios",
	"Grãos e Cereais",
	"Condimentos e Temperos",
	"Enlatados e Conservas",
	"Pães e Massas",
	"Outros",
]

BASE_PRODUTOS = [
	"Arroz",
	"Feijao",
	"Macarrao",
	"Acucar",
	"Cafe",
	"Leite",
	"Ovos",
	"Farinha de Trigo",
	"Sal",
	"Oleo de Soja",
	"Vinagre",
	"Manteiga",
	"Margarina",
	"Pao de Forma",
	"Biscoito",
	"Molho de Tomate",
	"Extrato de Tomate",
	"Atum",
	"Sardinha",
	"Fuba",
	"Aveia",
	"Cereal Matinal",
	"Chocolate em Po",
	"Achocolatado",
	"Queijo",
	"Presunto",
	"Iogurte",
	"Suco de Uva",
	"Agua Mineral",
	"Refrigerante",
	"Papel Higienico",
	"Detergente",
	"Sabao em Po",
	"Sabonete",
	"Shampoo",
	"Condicionador",
	"Creme Dental",
	"Desodorante",
	"Fralda",
	"Alcool",
	"Esponja",
	"Pano de Limpeza",
	"Batata",
	"Cebola",
	"Tomate",
	"Cenoura",
	"Banana",
	"Maca",
	"Laranja",
	"Alface",
]

GRAMATURAS_POSIVEIS = [250.0, 300.0, 400.0, 500.0, 750.0, 900.0, 1000.0, 1500.0, 2000.0]

# Mapeamento de produtos para categorias
PRODUTO_CATEGORIA_MAP = {
	"Arroz": "Grãos e Cereais",
	"Feijao": "Grãos e Cereais",
	"Macarrao": "Pães e Massas",
	"Acucar": "Condimentos e Temperos",
	"Cafe": "Alimentos",
	"Leite": "Laticínios",
	"Ovos": "Laticínios",
	"Farinha de Trigo": "Grãos e Cereais",
	"Sal": "Condimentos e Temperos",
	"Oleo de Soja": "Condimentos e Temperos",
	"Vinagre": "Condimentos e Temperos",
	"Manteiga": "Laticínios",
	"Margarina": "Laticínios",
	"Pao de Forma": "Pães e Massas",
	"Biscoito": "Alimentos",
	"Molho de Tomate": "Enlatados e Conservas",
	"Extrato de Tomate": "Enlatados e Conservas",
	"Atum": "Enlatados e Conservas",
	"Sardinha": "Enlatados e Conservas",
	"Fuba": "Grãos e Cereais",
	"Aveia": "Grãos e Cereais",
	"Cereal Matinal": "Grãos e Cereais",
	"Chocolate em Po": "Alimentos",
	"Achocolatado": "Alimentos",
	"Queijo": "Laticínios",
	"Presunto": "Laticínios",
	"Iogurte": "Laticínios",
	"Suco de Uva": "Bebidas",
	"Agua Mineral": "Bebidas",
	"Refrigerante": "Bebidas",
	"Papel Higienico": "Higiene e Limpeza",
	"Detergente": "Higiene e Limpeza",
	"Sabao em Po": "Higiene e Limpeza",
	"Sabonete": "Higiene e Limpeza",
	"Shampoo": "Higiene e Limpeza",
	"Condicionador": "Higiene e Limpeza",
	"Creme Dental": "Higiene e Limpeza",
	"Desodorante": "Higiene e Limpeza",
	"Fralda": "Higiene e Limpeza",
	"Alcool": "Higiene e Limpeza",
	"Esponja": "Higiene e Limpeza",
	"Pano de Limpeza": "Higiene e Limpeza",
	"Batata": "Frutas e Verduras",
	"Cebola": "Frutas e Verduras",
	"Tomate": "Frutas e Verduras",
	"Cenoura": "Frutas e Verduras",
	"Banana": "Frutas e Verduras",
	"Maca": "Frutas e Verduras",
	"Laranja": "Frutas e Verduras",
	"Alface": "Frutas e Verduras",
}


def parse_jdbc_url(jdbc_url: str) -> dict[str, str]:
	if jdbc_url.startswith("jdbc:"):
		jdbc_url = jdbc_url.removeprefix("jdbc:")

	parsed = urlparse(jdbc_url)
	if parsed.scheme != "postgresql":
		raise ValueError("A URL precisa usar o esquema jdbc:postgresql:// ou postgresql://")

	if not parsed.hostname or not parsed.path:
		raise ValueError("Nao foi possivel extrair host e nome do banco da URL")

	params = {
		"host": parsed.hostname,
		"port": str(parsed.port or 5432),
		"dbname": parsed.path.lstrip("/"),
	}

	if parsed.username:
		params["user"] = parsed.username
	if parsed.password:
		params["password"] = parsed.password

	query_params = parse_qs(parsed.query)
	if query_params.get("sslmode"):
		params["sslmode"] = query_params["sslmode"][0]

	return params


def get_connection():
	params = parse_jdbc_url(JDBC_URL)
	params.setdefault("user", DB_USER)
	params.setdefault("password", DB_PASSWORD)
	if "sslmode" not in params and os.getenv("DB_SSLMODE"):
		params["sslmode"] = os.getenv("DB_SSLMODE")
	return psycopg2.connect(**params)


def upsert_categoria(cursor, nome: str) -> int:
	cursor.execute(
		"SELECT id FROM categoria WHERE nome = %s ORDER BY id LIMIT 1",
		(nome,),
	)
	row = cursor.fetchone()
	if row is not None:
		return row[0]

	cursor.execute(
		"INSERT INTO categoria (nome) VALUES (%s) RETURNING id",
		(nome,),
	)
	return cursor.fetchone()[0]


def upsert_supermercado(cursor, nome: str, rede: str, ativo: bool) -> int:
	cursor.execute(
		"SELECT id FROM supermercado WHERE nome = %s AND rede = %s ORDER BY id LIMIT 1",
		(nome, rede),
	)
	row = cursor.fetchone()
	if row is not None:
		supermercado_id = row[0]
		cursor.execute(
			"UPDATE supermercado SET ativo = %s WHERE id = %s",
			(ativo, supermercado_id),
		)
		return supermercado_id

	cursor.execute(
		"INSERT INTO supermercado (nome, rede, ativo) VALUES (%s, %s, %s) RETURNING id",
		(nome, rede, ativo),
	)
	return cursor.fetchone()[0]


def converter_preco_para_centavos(preco: Decimal) -> int:
	"""Converte um preço em decimal para centavos (inteiro)"""
	return int(preco * 100)


def upsert_produto(
	cursor,
	supermercado_id: int,
	categoria_id: int,
	nome: str,
	marca: str,
	gramatura: float,
	preco_centavos: int,
) -> int:
	cursor.execute(
		"SELECT id FROM produto WHERE supermercado_id = %s AND nome = %s AND categoria_id = %s ORDER BY id LIMIT 1",
		(supermercado_id, nome, categoria_id),
	)
	row = cursor.fetchone()
	if row is not None:
		produto_id = row[0]
		cursor.execute(
			"UPDATE produto SET marca = %s, gramatura = %s, preco_centavos = %s WHERE id = %s",
			(marca, str(gramatura), preco_centavos, produto_id),
		)
		return produto_id

	cursor.execute(
		"""
		INSERT INTO produto (nome, marca, gramatura, preco_centavos, supermercado_id, categoria_id)
		VALUES (%s, %s, %s, %s, %s, %s)
		RETURNING id
		""",
		(nome, marca, str(gramatura), preco_centavos, supermercado_id, categoria_id),
	)
	return cursor.fetchone()[0]


def gerar_produtos(supermercado_nome: str, letra_supermercado: str):
	for indice, nome_base in enumerate(BASE_PRODUTOS):
		rng = random.Random(f"{supermercado_nome}:{nome_base}:{indice}")
		gramatura = rng.choice(GRAMATURAS_POSIVEIS)
		preco_decimal = Decimal(str(rng.uniform(1.49, 29.99))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
		preco_centavos = converter_preco_para_centavos(preco_decimal)
		yield {
			"nome": f"{nome_base}{letra_supermercado}",
			"marca": f"Marca{letra_supermercado}",
			"gramatura": gramatura,
			"preco_centavos": preco_centavos,
			"preco_decimal": preco_decimal,
			"categoria": PRODUTO_CATEGORIA_MAP.get(nome_base, "Outros"),
		}


def imprimir_resumo(cursor) -> None:
	cursor.execute(
		"""
		SELECT s.nome, COUNT(p.id) AS total
		FROM supermercado s
		LEFT JOIN produto p ON p.supermercado_id = s.id
		GROUP BY s.id, s.nome
		ORDER BY s.nome
		"""
	)
	print("\n=== RESUMO DE PRODUTOS ===")
	for nome, total in cursor.fetchall():
		print(f"{nome}: {total} produtos")

	cursor.execute("SELECT COUNT(*) FROM categoria")
	total_categorias = cursor.fetchone()[0]
	print(f"\nTotal de categorias: {total_categorias}")

	cursor.execute("SELECT COUNT(*) FROM produto")
	total_produtos = cursor.fetchone()[0]
	print(f"Total de produtos: {total_produtos}\n")


def main() -> None:
	try:
		with get_connection() as connection:
			with connection.cursor() as cursor:
				# Inserir categorias primeiro
				print("Inserindo categorias...")
				categoria_ids = {}
				for categoria_nome in CATEGORIAS:
					categoria_ids[categoria_nome] = upsert_categoria(cursor, categoria_nome)
				print(f"✓ {len(categoria_ids)} categorias processadas")

				# Inserir supermercados
				print("\nInserindo supermercados...")
				for nome, rede, letra in SUPERMERCADOS:
					supermercado_id = upsert_supermercado(cursor, nome, rede, True)
					print(f"✓ {nome} (ID: {supermercado_id})")

					# Inserir produtos para cada supermercado
					print(f"  Inserindo produtos para {nome}...")
					produtos_count = 0
					for produto in gerar_produtos(nome, letra):
						categoria_id = categoria_ids[produto["categoria"]]
						upsert_produto(
							cursor,
							supermercado_id,
							categoria_id,
							produto["nome"],
							produto["marca"],
							produto["gramatura"],
							produto["preco_centavos"],
						)
						produtos_count += 1
					print(f"  ✓ {produtos_count} produtos inseridos")

				connection.commit()
				print("\n✓ Banco de dados atualizado com sucesso!")
				imprimir_resumo(cursor)
	except Exception as e:
		print(f"\n✗ Erro ao popular o banco de dados: {e}")
		raise


if __name__ == "__main__":
	main()

