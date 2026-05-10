package com.tcc.cestainteligentetcc.dto.otimizacao;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record RequisicaoOtimizacaoDto(
        @JsonProperty("supermercado_id") Integer supermercadoId,
        @JsonProperty("orcamento_centavos") Integer orcamentoCentavos,
        List<ItemEntradaDto> itens,
        @JsonProperty("itens_proibidos") List<ItemProibidoDto> itensProibidos,
        @JsonProperty("semente_aleatoria") Integer sementeAleatoria
) {}
