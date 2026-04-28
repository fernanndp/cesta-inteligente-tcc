package com.tcc.cestainteligentetcc.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SupermercadoRequest(
        @NotBlank
        @Size(max = 120)
        String nome,

        @NotBlank
        @Size(max = 120)
        String rede,

        @NotNull
        Boolean ativo
) {
}

