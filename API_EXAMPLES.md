# 📡 API Examples - Cesta Inteligente

## Base URL
```
http://localhost:8080/api
```

---

## 📦 PRODUTOS

### GET - Listar todos os produtos
```bash
GET /produtos
```

**Response:**
```json
[
  {
    "id": 1,
    "nome": "ArrozA",
    "marca": "MarcaA",
    "gramatura": "1000.0",
    "precoCentavos": 1599,
    "categoriaId": 1,
    "supermercadoId": 1
  },
  {
    "id": 2,
    "nome": "FeijaoA",
    "marca": "MarcaA",
    "gramatura": "500.0",
    "precoCentavos": 899,
    "categoriaId": 1,
    "supermercadoId": 1
  }
]
```

### GET - Buscar produto por ID
```bash
GET /produtos/1
```

**Response:**
```json
{
  "id": 1,
  "nome": "ArrozA",
  "marca": "MarcaA",
  "gramatura": "1000.0",
  "precoCentavos": 1599,
  "categoriaId": 1,
  "supermercadoId": 1
}
```

### POST - Criar novo produto
```bash
POST /produtos
Content-Type: application/json

{
  "nome": "Arroz Integral",
  "marca": "Marca Premium",
  "gramatura": "2000.0",
  "precoCentavos": 2499,
  "categoriaId": 1,
  "supermercadoId": 1
}
```

**Response:** `201 Created`
```json
{
  "id": 151,
  "nome": "Arroz Integral",
  "marca": "Marca Premium",
  "gramatura": "2000.0",
  "precoCentavos": 2499,
  "categoriaId": 1,
  "supermercadoId": 1
}
```

### PUT - Atualizar produto
```bash
PUT /produtos/1
Content-Type: application/json

{
  "nome": "ArrozA",
  "marca": "MarcaA",
  "gramatura": "1000.0",
  "precoCentavos": 1799,
  "categoriaId": 1,
  "supermercadoId": 1
}
```

**Response:** `200 OK`

### DELETE - Deletar produto
```bash
DELETE /produtos/1
```

**Response:** `204 No Content`

---

## 🏪 SUPERMERCADOS

### GET - Listar todos os supermercados
```bash
GET /supermercados
```

**Response:**
```json
[
  {
    "id": 1,
    "nome": "Supermercado A",
    "rede": "Rede A",
    "ativo": true
  },
  {
    "id": 2,
    "nome": "Supermercado B",
    "rede": "Rede B",
    "ativo": true
  },
  {
    "id": 3,
    "nome": "Supermercado C",
    "rede": "Rede C",
    "ativo": true
  }
]
```

### GET - Buscar supermercado por ID
```bash
GET /supermercados/1
```

**Response:**
```json
{
  "id": 1,
  "nome": "Supermercado A",
  "rede": "Rede A",
  "ativo": true
}
```

### POST - Criar novo supermercado
```bash
POST /supermercados
Content-Type: application/json

{
  "nome": "Supermercado D",
  "rede": "Rede D",
  "ativo": true
}
```

**Response:** `201 Created`

### PUT - Atualizar supermercado
```bash
PUT /supermercados/1
Content-Type: application/json

{
  "nome": "Supermercado A",
  "rede": "Rede A Premium",
  "ativo": true
}
```

**Response:** `200 OK`

### DELETE - Deletar supermercado
```bash
DELETE /supermercados/1
```

**Response:** `204 No Content`

---

## 🏷️ CATEGORIAS

### GET - Listar todas as categorias
```bash
GET /categorias
```

**Response:**
```json
[
  {
    "id": 1,
    "nome": "Alimentos"
  },
  {
    "id": 2,
    "nome": "Bebidas"
  },
  {
    "id": 3,
    "nome": "Higiene e Limpeza"
  }
]
```

### GET - Buscar categoria por ID
```bash
GET /categorias/1
```

**Response:**
```json
{
  "id": 1,
  "nome": "Alimentos"
}
```

### POST - Criar nova categoria
```bash
POST /categorias
Content-Type: application/json

{
  "nome": "Congelados"
}
```

**Response:** `201 Created`

### PUT - Atualizar categoria
```bash
PUT /categorias/1
Content-Type: application/json

{
  "nome": "Alimentos Básicos"
}
```

**Response:** `200 OK`

### DELETE - Deletar categoria
```bash
DELETE /categorias/1
```

**Response:** `204 No Content`

---

## 🧪 Testar com PowerShell

### Get com PowerShell
```powershell
$headers = @{"Content-Type" = "application/json"}
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/produtos" -Method Get -Headers $headers
$response | ConvertTo-Json -Depth 5 | Write-Host
```

### Post com PowerShell
```powershell
$headers = @{"Content-Type" = "application/json"}
$body = @{
    nome = "Feijão Preto"
    marca = "Marca Nova"
    gramatura = "1000.0"
    precoCentavos = 1299
    categoriaId = 1
    supermercadoId = 1
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/produtos" `
    -Method Post `
    -Headers $headers `
    -Body $body

$response | ConvertTo-Json | Write-Host
```

---

## 🧪 Testar com CURL

### Get com cURL
```bash
curl -X GET http://localhost:8080/api/produtos \
  -H "Content-Type: application/json"
```

### Post com cURL
```bash
curl -X POST http://localhost:8080/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Feijão Preto",
    "marca": "Marca Nova",
    "gramatura": "1000.0",
    "precoCentavos": 1299,
    "categoriaId": 1,
    "supermercadoId": 1
  }'
```

---

## 📝 Notas Importantes

- **Preço em Centavos:** Use inteiros. Ex: `1599` = R$ 15,99
- **Relacionamentos:** Sempre incluir IDs válidos de categoria e supermercado
- **CORS:** Habilitado para requisições do frontend
- **Validações:** Nome e marca obrigatórios, comprimento máximo 150 e 100 caracteres

---

## 🔍 Filtros Úteis (Futuros)

Alguns filtros que poderiam ser adicionados:
```bash
GET /produtos?supermercadoId=1
GET /produtos?categoriaId=1
GET /produtos?nome=Arroz
GET /produtos?page=0&size=10
GET /supermercados?ativo=true
```

---

## 📊 Estrutura de Resposta de Erro

```json
{
  "timestamp": "2024-04-28T10:30:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Nome é obrigatório",
  "path": "/api/produtos"
}
```

---

**Documentação da API gerada automaticamente em:**
- Swagger UI: `http://localhost:8080/swagger-ui.html` (se configurado)
- OpenAPI: `http://localhost:8080/v3/api-docs`

