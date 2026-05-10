# Database Scripts

Scripts para configuração e população do banco de dados PostgreSQL.

## 📁 Arquivos

### `reset_db.sql`
Script SQL para limpar o banco de dados e resetar sequences.

**Uso:**
```bash
# Via psql (linha de comando)
psql -U postgres -d cesta_inteligente_tcc -f reset_db.sql

# Via pgAdmin
# 1. Abrir pgAdmin
# 2. Conectar ao banco
# 3. Abrir Query Tool
# 4. Copiar e colar conteúdo do arquivo
# 5. Executar (F5)
```

### `populate_db.py`
Script Python para popular o banco com dados de teste.

**Pré-requisitos:**
- Python 3.8+
- psycopg2: `pip install psycopg2-binary`

**Configuração:**
Editar as variáveis no topo do arquivo ou configurar via `.env`:

```env
JDBC_URL=jdbc:postgresql://localhost:5433/cesta_inteligente_tcc
DB_USER=postgres
DB_PASSWORD=sua_senha
```

**Uso:**
```bash
python populate_db.py
```

**Saída:**
```
Inserindo categorias...
✓ 10 categorias processadas

Inserindo supermercados...
✓ Supermercado A (ID: 1)
  Inserindo produtos para Supermercado A...
  ✓ 50 produtos inseridos
...

✓ Banco de dados atualizado com sucesso!

=== RESUMO DE PRODUTOS ===
Supermercado A: 50 produtos
Supermercado B: 50 produtos
Supermercado C: 50 produtos

Total de categorias: 10
Total de produtos: 150
```

## 🔄 Workflow Recomendado

```bash
# 1. Resetar banco
psql -U postgres -d cesta_inteligente_tcc -f reset_db.sql

# 2. Deixar Hibernate criar as tabelas (iniciar Spring Boot)
./gradlew bootRun

# 3. Parar a aplicação (Ctrl+C)

# 4. Popular o banco
python populate_db.py

# 5. Reiniciar a aplicação
./gradlew bootRun
```

## 📊 Dados Gerados

- **10 Categorias:** Alimentos, Bebidas, Higiene e Limpeza, etc.
- **3 Supermercados:** Supermercado A, B e C
- **150 Produtos:** 50 produtos por supermercado com preços aleatórios

## ⚠️ Notas Importantes

- O script é **idempotente** - seguro rodar múltiplas vezes
- Preços são gerados entre R$ 1,49 e R$ 29,99
- A coluna `preco_centavos` armazena valores em **centavos** (ex: 1599 = R$ 15,99)
- Cada supermercado tem um sufixo único de letra (A, B, C) nos nomes dos produtos

## 🐛 Troubleshooting

**Erro: "psql command not found"**
- Adicionar caminho do PostgreSQL ao PATH do Windows
- Ou usar pgAdmin para executar queries

**Erro: "ModuleNotFoundError: No module named 'psycopg2'"**
```bash
pip install psycopg2-binary
```

**Erro: "connection refused"**
- Verificar se PostgreSQL está rodando
- Confirmar credenciais no `.env`


