package com.tcc.cestainteligentetcc.service;

import com.tcc.cestainteligentetcc.dto.SupermercadoRequest;
import com.tcc.cestainteligentetcc.dto.SupermercadoResponse;
import com.tcc.cestainteligentetcc.entities.Supermercado;
import com.tcc.cestainteligentetcc.repositories.SupermercadoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SupermercadoService {

    private final SupermercadoRepository supermercadoRepository;

    public SupermercadoService(SupermercadoRepository supermercadoRepository) {
        this.supermercadoRepository = supermercadoRepository;
    }

    public List<SupermercadoResponse> listar() {
        return supermercadoRepository.findAll().stream().map(this::toResponse).toList();
    }

    public SupermercadoResponse buscarPorId(Long id) {
        return toResponse(obterEntidade(id));
    }

    public SupermercadoResponse criar(SupermercadoRequest request) {
        Supermercado supermercado = new Supermercado();
        aplicar(supermercado, request);
        return toResponse(supermercadoRepository.save(supermercado));
    }

    public SupermercadoResponse atualizar(Long id, SupermercadoRequest request) {
        Supermercado supermercado = obterEntidade(id);
        aplicar(supermercado, request);
        return toResponse(supermercadoRepository.save(supermercado));
    }

    public void excluir(Long id) {
        Supermercado supermercado = obterEntidade(id);
        supermercadoRepository.delete(supermercado);
    }

    public Supermercado obterEntidade(Long id) {
        return supermercadoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supermercado nao encontrado"));
    }

    private void aplicar(Supermercado supermercado, SupermercadoRequest request) {
        supermercado.setNome(request.nome());
        supermercado.setRede(request.rede());
        supermercado.setAtivo(request.ativo());
    }

    private SupermercadoResponse toResponse(Supermercado supermercado) {
        return new SupermercadoResponse(
                supermercado.getId(),
                supermercado.getNome(),
                supermercado.getRede(),
                supermercado.getAtivo()
        );
    }
}

