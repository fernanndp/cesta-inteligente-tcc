package com.tcc.cestainteligentetcc.dto.otimizacao;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ItemEntradaDto(
        String categoria,
        String classificacao,
        Integer quantidade,
        String marca,
        String gramatura,
        @JsonProperty("marca_preferida") String marcaPreferida,
        @JsonProperty("gramatura_preferida") String gramaturaPreferida,
        @JsonProperty("quantidade_min") Integer quantidadeMin,
        @JsonProperty("quantidade_max") Integer quantidadeMax
) {}
