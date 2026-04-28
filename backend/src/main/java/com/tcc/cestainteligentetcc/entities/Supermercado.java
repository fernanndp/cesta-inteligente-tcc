package com.tcc.cestainteligentetcc.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Table(name = "supermercado")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Supermercado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 120, nullable = false)
    private String nome;

    @Column(length = 120, nullable = false)
    private String rede;

    @Column(nullable = false)
    private Boolean ativo;

    @OneToMany(mappedBy = "supermercado")
    private List<Produto> produtos;
}

