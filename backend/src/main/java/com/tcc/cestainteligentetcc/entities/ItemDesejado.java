package com.tcc.cestainteligentetcc.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "item_desejado")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class ItemDesejado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer quantidadeDesejada;

    @ManyToOne(optional = false)
    @JoinColumn(name = "simulacao_id")
    private Simulacao simulacao;

    @ManyToOne(optional = false)
    @JoinColumn(name = "item_catalogo_id")
    private ItemCatalogo itemCatalogo;

    @OneToOne(mappedBy = "itemDesejado")
    private RestricaoItem restricao;
}
