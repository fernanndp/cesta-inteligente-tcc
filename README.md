# Cesta Inteligente

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Java](https://img.shields.io/badge/backend-Java%20%7C%20Spring%20Boot-red)
![React](https://img.shields.io/badge/frontend-React.js-blue)
![Next.js](https://img.shields.io/badge/frontend-React.js%20%7C%20Next.js-blue)
![Python](https://img.shields.io/badge/otimiza%C3%A7%C3%A3o-Python%20%7C%20FastAPI-green)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue)

Sistema desenvolvido como Trabalho de Conclusão de Curso (TCC), com o objetivo de otimizar compras em supermercados a partir de um orçamento definido pelo usuário, utilizando conceitos de **Otimização Combinatória** e o **Problema da Mochila**.

---

## Visão geral

O **Cesta Inteligente** é uma aplicação voltada ao consumidor final, permitindo montar uma lista de compras de forma mais eficiente, respeitando:

- orçamento disponível;
- itens desejados;
- itens obrigatórios;
- restrições inegociáveis;
- produtos proibidos;
- custo-benefício dos produtos disponíveis em uma rede de supermercado.

O sistema calcula a melhor combinação possível de produtos dentro do limite financeiro informado pelo usuário.

---

## Objetivo

Desenvolver uma solução capaz de:

- selecionar uma rede de supermercado;
- definir orçamento e lista base;
- aplicar restrições inegociáveis;
- proibir produtos ou marcas específicas;
- calcular uma cesta otimizada;
- exibir a lista final de compras;
- permitir o recálculo da cesta.

---

## Arquitetura da solução

A aplicação está organizada em quatro partes principais:

- **Frontend em React.js com Next.js**
- **Backend em Java com Spring Boot**
- **Módulo de otimização em Python com programação dinâmica e FastAPI**
- **Banco de dados PostgreSQL no Railway**
