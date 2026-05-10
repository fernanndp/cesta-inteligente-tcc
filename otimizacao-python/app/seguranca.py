from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader
from app.config import Config

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def validar_api_key(x_api_key: str = Security(api_key_header)) -> None:
    if not Config.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API_KEY não configurada no ambiente."
        )

    if x_api_key != Config.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Acesso não autorizado."
        )