"use client";

import { useEffect, useMemo, useState } from "react";
import type { Classificacao, ItemLista, Produto } from "@/lib/types";
import {
  CLASSIFICACOES,
  DESCRICAO_CLASSIFICACAO,
  LABEL_CLASSIFICACAO,
  formatarPreco,
} from "@/lib/cesta";
import type { DadosItem } from "@/hooks/use-cesta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Combobox } from "@/components/cesta/combobox";

type Modo = "adicionar" | "editar";

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produtosDoSupermercado: Produto[];
  /** Item a editar; quando ausente, o diálogo opera em modo de adição. */
  itemEmEdicao?: ItemLista | null;
  onSubmit: (dados: DadosItem) => void;
}

const VAZIO = {
  categoria: "",
  classificacao: "desejado" as Classificacao,
  marca: "",
  gramatura: "",
  quantidade: "1",
  produtoId: "",
};

export function ItemFormDialog({
  open,
  onOpenChange,
  produtosDoSupermercado,
  itemEmEdicao,
  onSubmit,
}: ItemFormDialogProps) {
  const modo: Modo = itemEmEdicao ? "editar" : "adicionar";

  const [categoria, setCategoria] = useState(VAZIO.categoria);
  const [classificacao, setClassificacao] = useState<Classificacao>(
    VAZIO.classificacao,
  );
  const [marca, setMarca] = useState(VAZIO.marca);
  const [gramatura, setGramatura] = useState(VAZIO.gramatura);
  const [quantidade, setQuantidade] = useState(VAZIO.quantidade);
  const [produtoId, setProdutoId] = useState(VAZIO.produtoId);

  // Sincroniza o formulário quando o diálogo abre (com ou sem item).
  useEffect(() => {
    if (!open) return;
    if (itemEmEdicao) {
      setCategoria(itemEmEdicao.categoria);
      setClassificacao(itemEmEdicao.classificacao);
      setMarca(itemEmEdicao.marca ?? "");
      setGramatura(itemEmEdicao.gramatura ?? "");
      setQuantidade(String(itemEmEdicao.quantidade));
      setProdutoId(itemEmEdicao.produto ? String(itemEmEdicao.produto.id) : "");
    } else {
      setCategoria(VAZIO.categoria);
      setClassificacao(VAZIO.classificacao);
      setMarca(VAZIO.marca);
      setGramatura(VAZIO.gramatura);
      setQuantidade(VAZIO.quantidade);
      setProdutoId(VAZIO.produtoId);
    }
  }, [open, itemEmEdicao]);

  const categorias = useMemo(
    () =>
      [...new Set(produtosDoSupermercado.map((p) => p.categoria))].sort(),
    [produtosDoSupermercado],
  );

  const produtosNaCategoria = useMemo(
    () =>
      categoria
        ? produtosDoSupermercado.filter((p) => p.categoria === categoria)
        : [],
    [produtosDoSupermercado, categoria],
  );

  const marcasDisponiveis = useMemo(
    () => [...new Set(produtosNaCategoria.map((p) => p.marca))].sort(),
    [produtosNaCategoria],
  );

  const gramaturasDisponiveis = useMemo(
    () =>
      [
        ...new Set(
          produtosNaCategoria
            .filter((p) => !marca || p.marca === marca)
            .map((p) => p.gramatura),
        ),
      ].sort(),
    [produtosNaCategoria, marca],
  );

  const produtosFiltrados = useMemo(
    () =>
      produtosNaCategoria
        .filter((p) => !marca || p.marca === marca)
        .filter((p) => !gramatura || p.gramatura === gramatura),
    [produtosNaCategoria, marca, gramatura],
  );

  const produtoSelecionado: Produto | null = useMemo(
    () => produtosFiltrados.find((p) => String(p.id) === produtoId) ?? null,
    [produtosFiltrados, produtoId],
  );

  const aoMudarCategoria = (valor: string) => {
    setCategoria(valor);
    setMarca("");
    setGramatura("");
    setProdutoId("");
  };

  const aoMudarMarca = (valor: string) => {
    setMarca(valor);
    setGramatura("");
    setProdutoId("");
  };

  const aoMudarGramatura = (valor: string) => {
    setGramatura(valor);
    setProdutoId("");
  };

  const submeter = () => {
    if (!categoria) return;
    onSubmit({
      categoria,
      produto: produtoSelecionado,
      classificacao,
      quantidade: Math.max(1, Number(quantidade) || 1),
      marca: marca || null,
      gramatura: gramatura || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {modo === "editar" ? "Editar item" : "Adicionar item"}
          </DialogTitle>
          <DialogDescription>
            Configure categoria, classificação e restrições. As restrições são
            opcionais — sem elas, qualquer marca ou gramatura é aceita.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="form-categoria">Categoria *</Label>
            <Combobox
              id="form-categoria"
              options={categorias.map((c) => ({ value: c, label: c }))}
              value={categoria}
              onChange={aoMudarCategoria}
              placeholder="Selecione uma categoria"
              searchPlaceholder="Buscar categoria..."
              emptyText="Nenhuma categoria."
            />
          </div>

          {/* Classificação */}
          <div className="space-y-2">
            <Label>Classificação</Label>
            <div className="grid gap-2">
              {CLASSIFICACOES.map((c) => (
                <label
                  key={c}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    classificacao === c
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="form-classificacao"
                    value={c}
                    checked={classificacao === c}
                    onChange={() => setClassificacao(c)}
                    className="mt-1 accent-primary"
                  />
                  <span className="space-y-0.5">
                    <span className="block text-sm font-medium">
                      {LABEL_CLASSIFICACAO[c]}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {DESCRICAO_CLASSIFICACAO[c]}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Restrições (marca/gramatura) */}
          {categoria && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="form-marca" className="text-xs">
                  Exigir marca
                </Label>
                <Combobox
                  id="form-marca"
                  options={marcasDisponiveis.map((m) => ({
                    value: m,
                    label: m,
                  }))}
                  value={marca}
                  onChange={aoMudarMarca}
                  placeholder="Qualquer marca"
                  searchPlaceholder="Buscar marca..."
                  emptyText="Sem marcas."
                  allowClear
                  clearLabel="Qualquer marca"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="form-gramatura" className="text-xs">
                  Exigir gramatura
                </Label>
                <Combobox
                  id="form-gramatura"
                  options={gramaturasDisponiveis.map((g) => ({
                    value: g,
                    label: g,
                  }))}
                  value={gramatura}
                  onChange={aoMudarGramatura}
                  placeholder="Qualquer gramatura"
                  searchPlaceholder="Buscar gramatura..."
                  emptyText="Sem gramaturas."
                  allowClear
                  clearLabel="Qualquer gramatura"
                />
              </div>
            </div>
          )}

          {/* Quantidade */}
          {categoria && (
            <div className="space-y-1.5">
              <Label htmlFor="form-quantidade" className="text-xs">
                Quantidade
              </Label>
              <Input
                id="form-quantidade"
                type="number"
                min="1"
                step="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>
          )}

          {/* Referência de produto (opcional) */}
          {categoria && (
            <div className="space-y-1.5">
              <Label htmlFor="form-produto" className="text-xs">
                Referência do produto{" "}
                <span className="font-normal text-muted-foreground">
                  (opcional)
                </span>
              </Label>
              <Combobox
                id="form-produto"
                options={produtosFiltrados.map((p) => ({
                  value: String(p.id),
                  label: `${p.nome} — ${p.marca} (${p.gramatura})`,
                }))}
                value={produtoId}
                onChange={setProdutoId}
                placeholder="Nenhuma referência"
                searchPlaceholder="Buscar produto..."
                emptyText="Nenhum produto compatível."
                allowClear
                clearLabel="Nenhuma referência"
              />
              {produtoSelecionado && (
                <p className="pt-1 text-sm font-semibold text-primary">
                  {formatarPreco(produtoSelecionado.preco * 100)}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submeter} disabled={!categoria}>
            {modo === "editar" ? "Salvar alterações" : "Adicionar à cesta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
