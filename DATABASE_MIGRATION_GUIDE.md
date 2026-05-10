# Guia de População do Banco de Dados

## 📋 Resumo das Mudanças

O novo schema do banco utiliza **`preco_centavos`** (inteiro) em vez de `preco` (decimal). Isso garante precisão nas operações monetárias e evita problemas de arredondamento.

### Estrutura de Dados

**Tabela `produto`:**
- `id` (SERIAL PRIMARY KEY)
- `nome` (VARCHAR 150, NOT NULL)
- `marca` (VARCHAR 100, NOT NULL)
- `gramatura` (VARCHAR 50, NOT NULL)
- **`preco_centavos`** (INTEGER, NOT NULL) - preço em centavos (ex: 1599 = R$ 15,99)
- `categoria_id` (FOREIGN KEY, NOT NULL)
- `supermercado_id` (FOREIGN KEY, NOT NULL)

**Tabela `categoria`:**
- `id` (SERIAL PRIMARY KEY)
- `nome` (VARCHAR 150, NOT NULL, UNIQUE)

**Tabela `supermercado`:**
- `id` (SERIAL PRIMARY KEY)
- `nome` (VARCHAR 150, NOT NULL)
- `rede` (VARCHAR 100, NOT NULL)
- `ativo` (BOOLEAN, DEFAULT true)

---

## 🗄️ Resetar o Banco de Dados

Se você tem dados antigos que estão causando erros de migração, siga estes passos:

### Opção 1: Limpar dados existentes (sem deletar tabelas)

```sql
-- Execute isso no PostgreSQL via pgAdmin ou psql
DELETE FROM produto;
DELETE FROM categoria;
DELETE FROM supermercado;

-- Resetar as sequences (IDs)
ALTER SEQUENCE categoria_id_seq RESTART WITH 1;
ALTER SEQUENCE supermercado_id_seq RESTART WITH 1;
ALTER SEQUENCE produto_id_seq RESTART WITH 1;
```

### Opção 2: Deletar e Recriar Tabelas (Limpeza Total)

```sql
-- Deletar em ordem (respeitar constraints)
DROP TABLE IF EXISTS produto CASCADE;
DROP TABLE IF EXISTS categoria CASCADE;
DROP TABLE IF EXISTS supermercado CASCADE;
```

Depois disso, rode a aplicação Spring Boot para que o Hibernate recrie as tabelas com o novo schema.

---

## 🐍 Como Usar o Script de População

### Pré-requisitos

1. **Python 3.8+** instalado
2. **psycopg2** instalado:
   ```bash
   pip install psycopg2-binary
   ```

### Passos para Popular o Banco

1. **Garanta que o banco está limpo** (execute as queries SQL acima)

2. **Configure o `.env`** na raiz do projeto:
   ```
   DB_HOST=localhost
   DB_PORT=5433
   DB_NAME=cesta_inteligente_tcc
   DB_USER=postgres
   DB_PASSWORD=sua_senha
   ```

3. **Execute o script**:
   ```bash
   cd database/scripts
   python populate_db.py
   ```

### Saída Esperada

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

---

## 🏗️ Banco H2 para Testes Locais

Se quiser usar H2 para testes rápidos sem instalar PostgreSQL:

### 1. Adicione H2 ao `build.gradle`:

```gradle
dependencies {
    // ... outras dependências ...
    runtimeOnly 'com.h2database:h2'
}
```

### 2. Crie `application-h2.properties`:

```properties
# H2 Database Configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# Hibernate Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

### 3. Execute com o perfil H2:

```bash
./gradlew bootRun --args='--spring.profiles.active=h2'
```

Agora você pode acessar o console H2 em: `http://localhost:8080/h2-console`

---

## ⚠️ Erros Comuns e Soluções

### Erro: "column preco_centavos contains null values"

**Causa:** Dados antigos com coluna `preco` vazia estão conflitando.

**Solução:**
```sql
DELETE FROM produto WHERE preco_centavos IS NULL;
-- Ou limpar tudo:
DELETE FROM produto;
```

### Erro: "column categoria_id already exists"

**Causa:** Tentativa de adicionar coluna que já existe.

**Solução:** 
```sql
ALTER TABLE produto DROP COLUMN IF EXISTS categoria_id;
-- Depois deixar o Hibernate recriar via migration
```

### Erro: "no transaction in progress"

**Causa:** Problema com autocommit do PostgreSQL.

**Solução:** Editar o script Python para garantir `connection.commit()` após cada operação.

---

## 🔄 Workflow de Desenvolvimento

```
1. Resetar banco (SQL)
   ↓
2. Iniciar aplicação Spring Boot
   ↓
3. Deixar Hibernate criar tabelas
   ↓
4. Executar populate_db.py
   ↓
5. Testar APIs
```

---

## 📝 Notas Importantes

✅ **Conversão de Preço:**
- O script converte automaticamente `15.99` → `1599` (centavos)
- Função: `converter_preco_para_centavos(preco: Decimal) -> int`

✅ **Categorias Automáticas:**
- O script cria 10 categorias padrão
- Cada produto é atribuído automaticamente a uma categoria baseado no nome

✅ **Idempotência:**
- O script usa `UPSERT` (atualiza se existe, insere se não existe)
- Seguro rodar múltiplas vezes

---

## 🚀 Próximos Passos

1. Testar as APIs CRUD em `http://localhost:8080/api/produtos`
2. Validar dados no banco
3. Implementar filtros e paginação
4. Adicionar script de sincronização com supermercados reais (se aplicável)


