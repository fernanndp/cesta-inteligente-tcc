package com.tcc.cestainteligentetcc.dto.otimizacao;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ItemSelecionadoRespostaDto(
        String categoria,
        @JsonProperty("product_id") Integer productId,
        String nome,
        String marca,
        String gramatura,
        Integer quantidade,
        @JsonProperty("preco_unitario_centavos") Integer precoUnitarioCentavos,
        @JsonProperty("subtotal_centavos") Integer subtotalCentavos,
        String classificacao
) {}
