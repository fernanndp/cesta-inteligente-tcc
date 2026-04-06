package com.tcc.cestainteligentetcc.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "restricao_item")

@Entity
@Getter
@Setter
@NoArgsConstructor
public class RestricaoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Boolean obrigatorio;

    @Column(name = "marca_obrigatoria", nullable = false)
    private Boolean marcaObrigatoria;

    @Column(name = "quantidade_minima", nullable = false)
    private Integer quantidadeMinima;

    @Column(name = "gramatura_obrigatoria", length = 50)
    private String gramaturaObrigatoria;

    @OneToOne(optional = false)
    @JoinColumn(name = "item_desejado_id", unique = true)
    private ItemDesejado itemDesejado;
}

