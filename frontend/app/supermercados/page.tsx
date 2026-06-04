"use client";

import { useMemo, useState } from "react";
import {
  Ban,
  Loader2,
  Plus,
  RotateCw,
  ShoppingBasket,
  Sparkles,
} from "lucide-react";
import type { ItemLista } from "@/lib/types";
import { useCatalogo } from "@/hooks/use-catalogo";
import { useCesta, type DadosItem } from "@/hooks/use-cesta";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Combobox } from "@/components/cesta/combobox";
import { ItemCard } from "@/components/cesta/item-card";
import { ItemFormDialog } from "@/components/cesta/item-form-dialog";
import { ResultadoCesta } from "@/components/cesta/resultado-cesta";

export default function Home() {
  const { produtos, supermercados, carregando, erro } = useCatalogo();
  const cesta = useCesta();

  // Diálogo de adicionar/editar item.
  const [formAberto, setFormAberto] = useState(false);
  const [itemEmEdicao, setItemEmEdicao] = useState<ItemLista | null>(null);

  // Confirmação de troca de supermercado (preserva a lista do usuário).
  const [supermercadoPendente, setSupermercadoPendente] = useState<
    number | null
  >(null);
  const [dialogTroca, setDialogTroca] = useState(false);

  const produtosDoSupermercado = useMemo(
    () =>
      cesta.supermercadoId
        ? produtos.filter((p) => p.supermercadoId === cesta.supermercadoId)
        : [],
    [produtos, cesta.supermercadoId],
  );

  const opcoesSupermercado = useMemo(
    () => supermercados.map((s) => ({ value: String(s.id), label: s.nome })),
    [supermercados],
  );

  const tentarTrocarSupermercado = (novoId: number | null) => {
    if (cesta.itensLista.length > 0 && novoId !== cesta.supermercadoId) {
      setSupermercadoPendente(novoId);
      setDialogTroca(true);
    } else {
      cesta.trocarSupermercado(novoId);
    }
  };

  const confirmarTroca = () => {
    cesta.trocarSupermercado(supermercadoPendente);
    setDialogTroca(false);
    setSupermercadoPendente(null);
  };

  const abrirAdicionar = () => {
    setItemEmEdicao(null);
    setFormAberto(true);
  };

  const abrirEditar = (item: ItemLista) => {
    setItemEmEdicao(item);
    setFormAberto(true);
  };

  const submeterItem = (dados: DadosItem) => {
    if (itemEmEdicao) {
      cesta.atualizarItem(itemEmEdicao.id, dados);
    } else {
      cesta.adicionarItem(dados);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <ShoppingBasket className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Cesta Inteligente
            </h1>
            <p className="text-sm text-muted-foreground">
              Monte sua lista e otimize as compras dentro do orçamento.
            </p>
          </div>
        </header>

        {erro && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {erro}
          </div>
        )}

        {/* Orçamento + supermercado */}
        <Card>
          <CardHeader>
            <CardTitle>Configuração</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor disponível (R$) *</Label>
              <Input
                id="valor"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex: 150,00"
                value={cesta.valorDisponivel}
                onChange={(e) => cesta.setValorDisponivel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supermercado">Supermercado *</Label>
              {carregando ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Combobox
                  id="supermercado"
                  options={opcoesSupermercado}
                  value={
                    cesta.supermercadoId ? String(cesta.supermercadoId) : ""
                  }
                  onChange={(v) =>
                    tentarTrocarSupermercado(v ? Number(v) : null)
                  }
                  placeholder="Selecione um supermercado"
                  searchPlaceholder="Buscar supermercado..."
                  emptyText="Nenhum supermercado."
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de compras */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Lista de compras ({cesta.itensLista.length})</CardTitle>
            <Button
              size="sm"
              onClick={abrirAdicionar}
              disabled={!cesta.supermercadoId}
            >
              <Plus className="mr-1 h-4 w-4" />
              Adicionar item
            </Button>
          </CardHeader>
          <CardContent>
            {!cesta.supermercadoId ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Selecione um supermercado para começar a montar a cesta.
              </p>
            ) : cesta.itensLista.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <ShoppingBasket className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Nenhum item ainda. Clique em{" "}
                  <span className="font-medium">Adicionar item</span> para
                  começar.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cesta.itensLista.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEditar={abrirEditar}
                    onDuplicar={cesta.duplicarItem}
                    onRemover={cesta.removerItem}
                    onClassificar={cesta.definirClassificacao}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Produtos proibidos */}
        {cesta.itensProibidos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Ban className="h-4 w-4 text-destructive" />
                Produtos excluídos ({cesta.itensProibidos.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cesta.itensProibidos.map((p) => (
                <div
                  key={p.productId}
                  className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm"
                >
                  <span className="text-muted-foreground">
                    {p.nome} — {p.marca}
                  </span>
                  <button
                    onClick={() => cesta.removerProibido(p.productId)}
                    className="ml-4 text-xs text-destructive hover:underline"
                  >
                    Remover exclusão
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Ação de otimização */}
        <Card>
          <CardContent className="space-y-3 pt-6">
            {cesta.pendenteReotimizacao && (
              <div className="flex items-center gap-2 rounded-lg border border-yellow-300/60 bg-yellow-50 px-3 py-2 text-sm text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-500">
                <RotateCw className="h-4 w-4 shrink-0" />
                Há alterações não aplicadas. Reotimize para atualizar o
                resultado.
              </div>
            )}

            {cesta.erroOtimizacao && (
              <p className="text-sm text-destructive">{cesta.erroOtimizacao}</p>
            )}

            <div className="flex gap-3">
              <Button
                onClick={cesta.enviarLista}
                disabled={!cesta.podeOtimizar}
                className="flex-1"
                variant={cesta.pendenteReotimizacao ? "default" : undefined}
              >
                {cesta.enviando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Otimizando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {cesta.resultado ? "Reotimizar cesta" : "Otimizar cesta"}
                  </>
                )}
              </Button>
              {cesta.resultado && (
                <Button
                  variant="outline"
                  onClick={cesta.novaConsulta}
                  className="flex-1"
                >
                  Nova consulta
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resultado */}
        {cesta.resultado && (
          <ResultadoCesta
            resultado={cesta.resultado}
            itensProibidos={cesta.itensProibidos}
            onProibir={cesta.proibirProduto}
            onRemoverProibido={cesta.removerProibido}
          />
        )}
      </div>

      {/* Diálogo adicionar/editar item */}
      <ItemFormDialog
        open={formAberto}
        onOpenChange={setFormAberto}
        produtosDoSupermercado={produtosDoSupermercado}
        itemEmEdicao={itemEmEdicao}
        onSubmit={submeterItem}
      />

      {/* Confirmação de troca de supermercado */}
      <AlertDialog
        open={dialogTroca}
        onOpenChange={(open) => {
          if (!open) {
            setDialogTroca(false);
            setSupermercadoPendente(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trocar de supermercado?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem {cesta.itensLista.length}{" "}
              {cesta.itensLista.length === 1 ? "item" : "itens"} na lista. Ao
              trocar de supermercado, todos os itens serão removidos. Deseja
              continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarTroca}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
