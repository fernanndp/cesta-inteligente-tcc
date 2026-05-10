package com.tcc.cestainteligentetcc.dto.otimizacao;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record RespostaOtimizacaoDto(
        String status,
        String mensagem,
        @JsonProperty("supermercado_id") Integer supermercadoId,
        @JsonProperty("orcamento_inicial_centavos") Integer orcamentoInicialCentavos,
        @JsonProperty("total_gasto_centavos") Integer totalGastoCentavos,
        @JsonProperty("troco_centavos") Integer trocoCentavos,
        @JsonProperty("itens_obrigatorios_selecionados") List<ItemSelecionadoRespostaDto> itensObrigatoriosSelecionados,
        @JsonProperty("itens_otimizados") List<ItemSelecionadoRespostaDto> itensOtimizados,
        List<String> avisos
) {}
