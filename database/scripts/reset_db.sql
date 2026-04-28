-- ============================================================
-- Script SQL para Resetar e Preparar o Banco para População
-- ============================================================
-- Execute este script no PostgreSQL ANTES de rodar populate_db.py
-- Isso garante que o banco está limpo e pronto para receber dados

-- 1. Conectar ao banco de dados
-- \c cesta_inteligente_tcc

-- 2. Deletar dados em ordem (respeitar constraints de FK)
DELETE FROM produto;
DELETE FROM categoria;
DELETE FROM supermercado;

-- 3. Resetar as sequences (IDs voltam a começar em 1)
ALTER SEQUENCE categoria_id_seq RESTART WITH 1;
ALTER SEQUENCE supermercado_id_seq RESTART WITH 1;
ALTER SEQUENCE produto_id_seq RESTART WITH 1;

-- 4. Verificar que está limpo (opcional - apenas para confirmar)
-- SELECT COUNT(*) as total_categorias FROM categoria;
-- SELECT COUNT(*) as total_supermercados FROM supermercado;
-- SELECT COUNT(*) as total_produtos FROM produto;

-- ✓ Banco pronto! Agora execute: python database/scripts/populate_db.py

