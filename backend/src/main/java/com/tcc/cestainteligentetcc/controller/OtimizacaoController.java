package com.tcc.cestainteligentetcc.controller;

import com.tcc.cestainteligentetcc.dto.otimizacao.RequisicaoOtimizacaoDto;
import com.tcc.cestainteligentetcc.dto.otimizacao.RespostaOtimizacaoDto;
import com.tcc.cestainteligentetcc.service.OtimizacaoService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/otimizar")
public class OtimizacaoController {

    private final OtimizacaoService otimizacaoService;

    public OtimizacaoController(OtimizacaoService otimizacaoService) {
        this.otimizacaoService = otimizacaoService;
    }

    @PostMapping
    public RespostaOtimizacaoDto otimizar(@RequestBody RequisicaoOtimizacaoDto requisicao) {
        return otimizacaoService.otimizar(requisicao);
    }
}
