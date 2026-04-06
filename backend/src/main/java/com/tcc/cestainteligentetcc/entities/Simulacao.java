package com.tcc.cestainteligentetcc.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Table(name = "simulacao")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Simulacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal orcamento;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supermercado_id")
    private Supermercado supermercado;

    @OneToMany(mappedBy = "simulacao")
    private List<ItemDesejado> itens;

    @OneToOne(mappedBy = "simulacao")
    private ResultadoOtimizacao resultadoOtimizacao;
}
