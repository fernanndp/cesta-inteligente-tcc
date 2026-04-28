package com.tcc.cestainteligentetcc.dto;

public record ProdutoResponse(
        Long id,
        String nome,
        String marca,
        String gramatura,
        Integer precoCentavos,
        Long categoriaId,
        String categoriaNome,
        Long supermercadoId,
        String supermercadoNome
) {
}

