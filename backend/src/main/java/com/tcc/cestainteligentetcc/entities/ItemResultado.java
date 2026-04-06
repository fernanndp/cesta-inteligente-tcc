package com.tcc.cestainteligentetcc.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Table(name = "item_resultado")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class ItemResultado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(name = "preco_unitario", precision = 10, scale = 2, nullable = false)
    private BigDecimal precoUnitario;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;

    @ManyToOne(optional = false)
    @JoinColumn(name = "resultado_otimizacao_id")
    private ResultadoOtimizacao resultadoOtimizacao;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produto_id")
    private Produto produto;
}


