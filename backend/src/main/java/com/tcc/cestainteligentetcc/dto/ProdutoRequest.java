package com.tcc.cestainteligentetcc.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProdutoRequest(
        @NotBlank
        @Size(max = 150)
        String nome,

        @NotBlank
        @Size(max = 100)
        String marca,

        @NotBlank
        @Size(max = 50)
        String gramatura,

        @NotNull
        @Min(0)
        Integer precoCentavos,

        @NotNull
        Long categoriaId,

        @NotNull
        Long supermercadoId
) {
}

