package com.tcc.cestainteligentetcc.repositories;

import com.tcc.cestainteligentetcc.entities.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}


