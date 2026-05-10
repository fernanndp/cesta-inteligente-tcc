# 🚀 Quick Start - Como Popular o Banco de Dados

## ⏱️ 2 Minutos para Começar

### Pré-requisitos
- PostgreSQL rodando em `localhost:5433`
- Python 3.8+ instalado
- Git e Gradle instalados

### Passo a Passo

#### 1️⃣ Clone/Atualize o Repositório
```bash
git clone https://github.com/fernanndp/cesta-inteligente-tcc.git
cd cesta-inteligente-tcc
git pull origin develop
```

#### 2️⃣ Instale psycopg2 (se ainda não tem)
```bash
pip install psycopg2-binary
```

#### 3️⃣ Configure o `.env` na raiz do projeto
```env
DB_HOST=localhost
DB_PORT=5433
DB_NAME=cesta_inteligente_tcc
DB_USER=postgres
DB_PASSWORD=sua_senha_postgres
```

#### 4️⃣ Resetar o Banco de Dados
**Via psql (Windows PowerShell):**
```powershell
# Navegar até o diretório
cd database\scripts

# Executar script de reset
psql -U postgres -d cesta_inteligente_tcc -f reset_db.sql
```

**Via pgAdmin:**
1. Abrir pgAdmin
2. Conectar ao servidor
3. Abrir "Query Tool" no banco `cesta_inteligente_tcc`
4. Copiar conteúdo de `database/scripts/reset_db.sql`
5. Executar (F5)

#### 5️⃣ Deixar Hibernate Criar as Tabelas
```bash
cd backend
./gradlew bootRun

# Aguardar até aparecer:
# "Started CestaInteligenteTccApplication in X seconds"
# Depois pressionar Ctrl+C para parar
```

#### 6️⃣ Popular o Banco
```bash
cd database/scripts
python populate_db.py
```

**Saída esperada:**
```
Inserindo categorias...
✓ 10 categorias processadas

Inserindo supermercados...
✓ Supermercado A (ID: 1)
  Inserindo produtos para Supermercado A...
  ✓ 50 produtos inseridos
✓ Supermercado B (ID: 2)
  Inserindo produtos para Supermercado B...
  ✓ 50 produtos inseridos
✓ Supermercado C (ID: 3)
  Inserindo produtos para Supermercado C...
  ✓ 50 produtos inseridos

✓ Banco de dados atualizado com sucesso!

=== RESUMO DE PRODUTOS ===
Supermercado A: 50 produtos
Supermercado B: 50 produtos
Supermercado C: 50 produtos

Total de categorias: 10
Total de produtos: 150
```

#### 7️⃣ Iniciar a Aplicação
```bash
cd backend
./gradlew bootRun
```

Acesse: `http://localhost:8080/api/produtos`

---

## 🎯 Comandos Úteis

### Ver dados no banco (pgAdmin)
```sql
-- Contar registros
SELECT COUNT(*) FROM categoria;
SELECT COUNT(*) FROM supermercado;
SELECT COUNT(*) FROM produto;

-- Ver alguns produtos
SELECT p.id, p.nome, p.preco_centavos, c.nome as categoria, s.nome as supermercado
FROM produto p
JOIN categoria c ON p.categoria_id = c.id
JOIN supermercado s ON p.supermercado_id = s.id
LIMIT 10;
```

### Resetar banco novamente (se necessário)
```bash
psql -U postgres -d cesta_inteligente_tcc -f database/scripts/reset_db.sql
python database/scripts/populate_db.py
```

### Testar API
```bash
# PowerShell
$headers = @{"Content-Type" = "application/json"}
Invoke-RestMethod -Uri "http://localhost:8080/api/produtos" -Method Get -Headers $headers | ConvertTo-Json

# Ou via curl (se instalado)
curl http://localhost:8080/api/produtos
```

---

## ⚠️ Problemas Comuns

### "psql command not found"
Adicionar PostgreSQL ao PATH:
1. Encontrar caminho de instalação (ex: `C:\Program Files\PostgreSQL\15\bin`)
2. Adicionar ao PATH do Windows
3. Reiniciar PowerShell

### "ModuleNotFoundError: No module named 'psycopg2'"
```bash
pip install psycopg2-binary
```

### "FATAL: connection refused"
Verificar se PostgreSQL está rodando:
```powershell
# Ver processos
Get-Process | Where-Object {$_.ProcessName -like "*postgres*"}
```

### "ERROR: column preco_centavos contains null values"
Executar o script de reset novamente:
```bash
psql -U postgres -d cesta_inteligente_tcc -f database/scripts/reset_db.sql
```

---

## 📊 Dados Gerados

- **Categorias:** 10 (Alimentos, Bebidas, Higiene, etc.)
- **Supermercados:** 3 (A, B, C)
- **Produtos:** 150 (50 por supermercado)
- **Preço:** Entre R$ 1,49 e R$ 29,99

---

## 🔗 Links Úteis

- **Documentação Completa:** `DATABASE_MIGRATION_GUIDE.md`
- **Scripts Docs:** `database/scripts/README.md`
- **Backend:** `http://localhost:8080/api/`
- **H2 Console:** `http://localhost:8080/h2-console` (se usando H2)

---

## ✅ Checklist

- [ ] PostgreSQL rodando
- [ ] `.env` configurado
- [ ] `psycopg2` instalado
- [ ] Banco resetado via `reset_db.sql`
- [ ] Hibernate criou as tabelas (Spring rodou)
- [ ] `populate_db.py` executado com sucesso
- [ ] API respondendo em `http://localhost:8080/api/produtos`
- [ ] Dados visíveis no pgAdmin

---

**Pronto! Seu banco de dados está populado e pronto para desenvolvimento! 🎉**

