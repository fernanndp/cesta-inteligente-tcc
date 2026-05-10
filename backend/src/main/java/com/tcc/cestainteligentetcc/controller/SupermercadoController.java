package com.tcc.cestainteligentetcc.controller;

import com.tcc.cestainteligentetcc.dto.SupermercadoRequest;
import com.tcc.cestainteligentetcc.dto.SupermercadoResponse;
import com.tcc.cestainteligentetcc.service.SupermercadoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supermercados")
public class SupermercadoController {

    private final SupermercadoService supermercadoService;

    public SupermercadoController(SupermercadoService supermercadoService) {
        this.supermercadoService = supermercadoService;
    }

    @GetMapping
    public List<SupermercadoResponse> listar() {
        return supermercadoService.listar();
    }

    @GetMapping("/{id}")
    public SupermercadoResponse buscarPorId(@PathVariable Long id) {
        return supermercadoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SupermercadoResponse criar(@Valid @RequestBody SupermercadoRequest request) {
        return supermercadoService.criar(request);
    }

    @PutMapping("/{id}")
    public SupermercadoResponse atualizar(@PathVariable Long id, @Valid @RequestBody SupermercadoRequest request) {
        return supermercadoService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        supermercadoService.excluir(id);
    }
}

