# Cesta Inteligente

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Java](https://img.shields.io/badge/backend-Java%20%7C%20Spring%20Boot-red)
![React](https://img.shields.io/badge/frontend-React.js-blue)
![Python](https://img.shields.io/badge/otimiza%C3%A7%C3%A3o-Python-green)
![MySQL](https://img.shields.io/badge/database-MySQL-orange)

Sistema desenvolvido como Trabalho de Conclusão de Curso (TCC) com o objetivo de otimizar compras em supermercados a partir de um orçamento definido pelo usuário, utilizando o **Problema da Mochila 0-1**.

---

## Visão geral

O **Cesta Inteligente** é uma aplicação voltada ao consumidor final, permitindo montar uma lista de compras de forma mais eficiente, respeitando:

- orçamento disponível;
- itens desejados;
- restrições inegociáveis;
- custo-benefício dos produtos disponíveis em uma rede de supermercado.

O sistema busca calcular a melhor combinação de produtos possíveis dentro do limite financeiro informado pelo usuário.

---

## Objetivo

Desenvolver uma solução capaz de:

- selecionar uma rede de supermercado;
- definir orçamento e lista base;
- aplicar restrições inegociáveis;
- calcular uma cesta otimizada;
- exibir a lista final de compras;
- permitir o recálculo da cesta.

---

## Arquitetura da solução

A aplicação está organizada em quatro partes principais:

- **Frontend em React.js**
- **Backend em Java com Spring Boot**
- **Módulo de otimização em Python**
- **Banco de dados MySQL**

---

## Tecnologias utilizadas

### Backend
- Java
- Spring Boot
- Spring Data JPA

### Frontend
- React.js
- JavaScript
- HTML
- CSS

### Otimização
- Python
- Problema da Mochila 0-1

### Banco de dados
- MySQL

### Documentação e modelagem
- PlantUML
- UML
- Git e GitHub

---

## Funcionalidades

- Seleção da rede de supermercado
- Definição de orçamento
- Montagem da lista base
- Definição de restrições inegociáveis
- Cálculo da cesta otimizada
- Visualização da lista final de compras
- Recálculo da cesta

---

## Casos de uso

- **UC01** – Selecionar Rede de Supermercado
- **UC02** – Definir Orçamento e Lista Base
- **UC03** – Definir Restrições Inegociáveis
- **UC04** – Calcular Cesta Otimizada
- **UC05** – Visualizar Lista de Compras
- **UC06** – Recalcular Cesta

---

## Estrutura do projeto

cesta-inteligente-tcc/
├── backend/
├── frontend/
├── otimizacao-python/
├── database/
│   └── scripts/
├── docs/
│   └── diagramas/
├── README.md
├── .gitignore
└── LICENSE