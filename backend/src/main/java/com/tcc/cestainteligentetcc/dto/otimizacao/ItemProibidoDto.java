package com.tcc.cestainteligentetcc.dto.otimizacao;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ItemProibidoDto(
        @JsonProperty("product_id") Integer productId
) {}
