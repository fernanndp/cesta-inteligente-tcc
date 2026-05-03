from enum import Enum


class ClassificacaoItem(str, Enum):
    OBRIGATORIO = "obrigatorio"
    PRIORITARIO = "prioritario"
    DESEJADO = "desejado"