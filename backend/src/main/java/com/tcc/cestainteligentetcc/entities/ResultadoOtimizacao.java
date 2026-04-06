package com.tcc.cestainteligentetcc.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

import java.util.List;

@Table(name = "resultado_otimizacao")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class ResultadoOtimizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "valor_total", precision = 10, scale = 2, nullable = false)
    private BigDecimal valorTotal;

    @Column(name = "troco_estimado", precision = 10, scale = 2)
    private BigDecimal trocoEstimado;

    @Column(length = 50, nullable = false)
    private String status;

    @OneToOne(optional = false)
    @JoinColumn(name = "simulacao_id", unique = true)
    private Simulacao simulacao;

    @OneToMany(mappedBy = "resultadoOtimizacao")
    private List<ItemResultado> itensResultado;
}


