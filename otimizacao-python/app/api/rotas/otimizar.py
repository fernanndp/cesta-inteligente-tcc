from fastapi import APIRouter, Depends
from app.esquemas.requisicao import RequisicaoOtimizacao
from app.esquemas.resposta import RespostaOtimizacao
from app.repositorios.repositorio_produtos_postgres import RepositorioProdutosPostgres
from app.seguranca import validar_api_key
from app.servicos.servico_otimizacao import ServicoOtimizacao

roteador = APIRouter(prefix="/v1", tags=["otimizacao"])


@roteador.post(
    "/otimizar",
    response_model=RespostaOtimizacao,
    dependencies=[Depends(validar_api_key)]
)
def otimizar(requisicao: RequisicaoOtimizacao) -> RespostaOtimizacao:
    repositorio = RepositorioProdutosPostgres()
    servico = ServicoOtimizacao(semente_aleatoria=requisicao.semente_aleatoria)

    produtos = repositorio.buscar_por_supermercado(requisicao.supermercado_id)
    return servico.otimizar(requisicao, produtos)