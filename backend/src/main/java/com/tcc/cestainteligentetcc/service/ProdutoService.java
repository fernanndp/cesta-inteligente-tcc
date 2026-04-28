package com.tcc.cestainteligentetcc.service;

import com.tcc.cestainteligentetcc.dto.ProdutoRequest;
import com.tcc.cestainteligentetcc.dto.ProdutoResponse;
import com.tcc.cestainteligentetcc.entities.Categoria;
import com.tcc.cestainteligentetcc.entities.Produto;
import com.tcc.cestainteligentetcc.entities.Supermercado;
import com.tcc.cestainteligentetcc.repositories.CategoriaRepository;
import com.tcc.cestainteligentetcc.repositories.ProdutoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final SupermercadoService supermercadoService;

    public ProdutoService(
            ProdutoRepository produtoRepository,
            CategoriaRepository categoriaRepository,
            SupermercadoService supermercadoService
    ) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
        this.supermercadoService = supermercadoService;
    }

    public List<ProdutoResponse> listar() {
        return produtoRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProdutoResponse buscarPorId(Long id) {
        return toResponse(obterEntidade(id));
    }

    public ProdutoResponse criar(ProdutoRequest request) {
        Produto produto = new Produto();
        aplicar(produto, request);
        return toResponse(produtoRepository.save(produto));
    }

    public ProdutoResponse atualizar(Long id, ProdutoRequest request) {
        Produto produto = obterEntidade(id);
        aplicar(produto, request);
        return toResponse(produtoRepository.save(produto));
    }

    public void excluir(Long id) {
        Produto produto = obterEntidade(id);
        produtoRepository.delete(produto);
    }

    private Produto obterEntidade(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto nao encontrado"));
    }

    private Categoria obterCategoria(Long categoriaId) {
        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria nao encontrada"));
    }

    private void aplicar(Produto produto, ProdutoRequest request) {
        produto.setNome(request.nome());
        produto.setMarca(request.marca());
        produto.setGramatura(request.gramatura());
        produto.setPrecoCentavos(request.precoCentavos());
        produto.setCategoria(obterCategoria(request.categoriaId()));
        produto.setSupermercado(supermercadoService.obterEntidade(request.supermercadoId()));
    }

    private ProdutoResponse toResponse(Produto produto) {
        return new ProdutoResponse(
                produto.getId(),
                produto.getNome(),
                produto.getMarca(),
                produto.getGramatura(),
                produto.getPrecoCentavos(),
                produto.getCategoria().getId(),
                produto.getCategoria().getNome(),
                produto.getSupermercado().getId(),
                produto.getSupermercado().getNome()
        );
    }
}

