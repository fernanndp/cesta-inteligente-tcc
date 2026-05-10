package com.tcc.cestainteligentetcc.service;

import com.tcc.cestainteligentetcc.dto.otimizacao.RequisicaoOtimizacaoDto;
import com.tcc.cestainteligentetcc.dto.otimizacao.RespostaOtimizacaoDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OtimizacaoService {

    @Value("${otimizador.url:http://localhost:8000}")
    private String otimizadorUrl;

    @Value("${otimizador.api-key:}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    public RespostaOtimizacaoDto otimizar(RequisicaoOtimizacaoDto requisicao) {
        try {
            return restClient.post()
                    .uri(otimizadorUrl + "/v1/otimizar")
                    .header("Content-Type", "application/json")
                    .header("X-API-Key", apiKey)
                    .body(requisicao)
                    .retrieve()
                    .body(RespostaOtimizacaoDto.class);
        } catch (RestClientException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Erro ao comunicar com o otimizador: " + e.getMessage()
            );
        }
    }
}
