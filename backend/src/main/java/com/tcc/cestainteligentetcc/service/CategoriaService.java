package com.tcc.cestainteligentetcc.service;

import com.tcc.cestainteligentetcc.dto.CategoriaRequest;
import com.tcc.cestainteligentetcc.dto.CategoriaResponse;
import com.tcc.cestainteligentetcc.entities.Categoria;
import com.tcc.cestainteligentetcc.repositories.CategoriaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<CategoriaResponse> listar() {
        return categoriaRepository.findAll().stream().map(this::toResponse).toList();
    }

    public CategoriaResponse buscarPorId(Long id) {
        return toResponse(obterEntidade(id));
    }

    public CategoriaResponse criar(CategoriaRequest request) {
        Categoria categoria = new Categoria();
        categoria.setNome(request.nome());
        return toResponse(categoriaRepository.save(categoria));
    }

    public CategoriaResponse atualizar(Long id, CategoriaRequest request) {
        Categoria categoria = obterEntidade(id);
        categoria.setNome(request.nome());
        return toResponse(categoriaRepository.save(categoria));
    }

    public void excluir(Long id) {
        Categoria categoria = obterEntidade(id);
        categoriaRepository.delete(categoria);
    }

    private Categoria obterEntidade(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria nao encontrada"));
    }

    private CategoriaResponse toResponse(Categoria categoria) {
        return new CategoriaResponse(categoria.getId(), categoria.getNome());
    }
}

