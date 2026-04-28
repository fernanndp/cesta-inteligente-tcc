package com.tcc.cestainteligentetcc.controller;

import com.tcc.cestainteligentetcc.dto.CategoriaRequest;
import com.tcc.cestainteligentetcc.dto.ProdutoRequest;
import com.tcc.cestainteligentetcc.dto.ProdutoResponse;
import com.tcc.cestainteligentetcc.dto.SupermercadoRequest;
import com.tcc.cestainteligentetcc.service.CategoriaService;
import com.tcc.cestainteligentetcc.service.ProdutoService;
import com.tcc.cestainteligentetcc.service.SupermercadoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

@SpringBootTest
@ActiveProfiles("test")
class CrudControllersIntegrationTest {

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private SupermercadoService supermercadoService;

    @Autowired
    private ProdutoService produtoService;

    @Test
    void deveCriarEListarCategoriaSupermercadoEProduto() {
        var categoria = categoriaService.criar(new CategoriaRequest("Hortifruti"));
        var supermercado = supermercadoService.criar(new SupermercadoRequest("Loja Centro", "Rede A", true));

        ProdutoResponse produto = produtoService.criar(new ProdutoRequest(
                "Banana Prata",
                "Fazenda",
                "1kg",
                799,
                categoria.id(),
                supermercado.id()
        ));

        assertEquals("Banana Prata", produto.nome());
        assertEquals(799, produto.precoCentavos());
        assertEquals(categoria.id(), produto.categoriaId());
        assertEquals(supermercado.id(), produto.supermercadoId());
        assertFalse(produtoService.listar().isEmpty());
    }
}

