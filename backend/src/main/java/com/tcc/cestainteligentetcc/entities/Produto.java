package com.tcc.cestainteligentetcc.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "produto")
@Getter
@Setter
@NoArgsConstructor
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 150, nullable = false)
    private String nome;

    @Column(length = 100, nullable = false)
    private String marca;

    @Column(length = 50, nullable = false)
    private String gramatura;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal preco;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supermercado_id")
    private Supermercado supermercado;

    @OneToMany(mappedBy = "produto")
    private List<ItemResultado> itensResultado;


}

