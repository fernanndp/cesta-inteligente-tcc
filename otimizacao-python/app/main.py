from fastapi import FastAPI
from app.api.rotas.otimizar import roteador as roteador_otimizacao

app = FastAPI(
    title="API de Otimização - Cesta Inteligente",
    version="0.5.0",
    description="Microsserviço Python para otimização de cesta"
)

app.include_router(roteador_otimizacao)


@app.get("/")
def raiz() -> dict:
    return {"mensagem": "API de otimização online"}


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}