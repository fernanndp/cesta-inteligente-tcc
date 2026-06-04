"use client";

import { AlertTriangle, Ban, RotateCcw } from "lucide-react";
import type {
  Classificacao,
  ItemProibido,
  ItemSelecionadoResposta,
  RespostaOtimizacao,
} from "@/lib/types";
import {
  LABEL_CLASSIFICACAO,
  formatarPreco,
  varianteClassificacao,
} from "@/lib/cesta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResultadoCestaProps {
  resultado: RespostaOtimizacao;
  itensProibidos: ItemProibido[];
  onProibir: (item: ItemSelecionadoResposta) => void;
  onRemoverProibido: (productId: number) => void;
}

function ResumoFinanceiro({ resultado }: { resultado: RespostaOtimizacao }) {
  const blocos = [
    { rotulo: "Orçamento", valor: resultado.orcamento_inicial_centavos },
    { rotulo: "Total gasto", valor: resultado.total_gasto_centavos },
    { rotulo: "Troco", valor: resultado.troco_centavos },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {blocos.map((b) => (
        <div
          key={b.rotulo}
          className="rounded-lg bg-secondary p-4 text-center"
        >
          <p className="text-xs text-muted-foreground">{b.rotulo}</p>
          <p className="text-base font-semibold sm:text-lg">
            {formatarPreco(b.valor)}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ResultadoCesta({
  resultado,
  itensProibidos,
  onProibir,
  onRemoverProibido,
}: ResultadoCestaProps) {
  // Une obrigatórios + otimizados sem duplicar pelo product_id.
  const itens: ItemSelecionadoResposta[] = [
    ...resultado.itens_obrigatorios_selecionados,
    ...resultado.itens_otimizados.filter(
      (o) =>
        !resultado.itens_obrigatorios_selecionados.some(
          (ob) => ob.product_id === o.product_id,
        ),
    ),
  ];

  const viavel = resultado.status === "ok";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          Resultado da otimização
          <Badge
            className={
              viavel
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : ""
            }
            variant={viavel ? "secondary" : "destructive"}
          >
            {viavel ? "Viável" : "Inviável"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {resultado.mensagem && (
          <p className="text-sm text-muted-foreground">{resultado.mensagem}</p>
        )}

        <ResumoFinanceiro resultado={resultado} />

        {itens.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Itens selecionados ({itens.length})
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                — proíba um produto para excluí-lo da próxima otimização
              </span>
            </p>
            <div className="space-y-2">
              {itens.map((item) => {
                const proibido = itensProibidos.some(
                  (p) => p.productId === item.product_id,
                );
                return (
                  <div
                    key={item.product_id}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm ${
                      proibido
                        ? "border-destructive/30 bg-destructive/5 opacity-60"
                        : "border-border"
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <Badge
                        variant={varianteClassificacao(
                          item.classificacao as Classificacao,
                        )}
                        className="shrink-0"
                      >
                        {LABEL_CLASSIFICACAO[
                          item.classificacao as Classificacao
                        ] ?? item.classificacao}
                      </Badge>
                      <span className="truncate">
                        {item.nome} — {item.marca} ({item.gramatura}) ×{" "}
                        {item.quantidade}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-medium">
                        {formatarPreco(item.subtotal_centavos)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={
                          proibido
                            ? "text-muted-foreground"
                            : "text-destructive hover:text-destructive"
                        }
                        onClick={() =>
                          proibido
                            ? onRemoverProibido(item.product_id)
                            : onProibir(item)
                        }
                      >
                        {proibido ? (
                          <>
                            <RotateCcw className="mr-1 h-3.5 w-3.5" />
                            Desfazer
                          </>
                        ) : (
                          <>
                            <Ban className="mr-1 h-3.5 w-3.5" />
                            Proibir
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {resultado.avisos.length > 0 && (
          <div className="space-y-1.5 rounded-lg border border-yellow-300/50 bg-yellow-50 p-3 dark:bg-yellow-950/20">
            <p className="flex items-center gap-2 text-sm font-medium text-yellow-700 dark:text-yellow-500">
              <AlertTriangle className="h-4 w-4" />
              Avisos
            </p>
            {resultado.avisos.map((aviso, i) => (
              <p
                key={i}
                className="text-sm text-yellow-700 dark:text-yellow-500/90"
              >
                {aviso}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
