"use client";

import {
  Copy,
  MoreVertical,
  Pencil,
  ShieldAlert,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import type { Classificacao, ItemLista } from "@/lib/types";
import {
  LABEL_CLASSIFICACAO,
  varianteClassificacao,
} from "@/lib/cesta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ItemCardProps {
  item: ItemLista;
  onEditar: (item: ItemLista) => void;
  onDuplicar: (id: string) => void;
  onRemover: (id: string) => void;
  onClassificar: (id: string, classificacao: Classificacao) => void;
}

const ICONE_CLASSIFICACAO: Record<Classificacao, typeof Star> = {
  obrigatorio: ShieldAlert,
  prioritario: Star,
  desejado: Tag,
};

export function ItemCard({
  item,
  onEditar,
  onDuplicar,
  onRemover,
  onClassificar,
}: ItemCardProps) {
  const Icone = ICONE_CLASSIFICACAO[item.classificacao];

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <Icone className="h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="truncate font-semibold">
            {item.produto?.nome ?? item.categoria}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Categoria: {item.categoria}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={varianteClassificacao(item.classificacao)}>
            {LABEL_CLASSIFICACAO[item.classificacao]}
          </Badge>
          {item.marca && <Badge variant="outline">Marca: {item.marca}</Badge>}
          {item.gramatura && (
            <Badge variant="outline">Gramatura: {item.gramatura}</Badge>
          )}
          {item.quantidade > 1 && (
            <Badge variant="outline">Qtd: {item.quantidade}</Badge>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Editar item"
          onClick={() => onEditar(item)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Mais ações">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={() => onEditar(item)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicar(item.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {item.classificacao !== "obrigatorio" && (
              <DropdownMenuItem
                onClick={() => onClassificar(item.id, "obrigatorio")}
              >
                <ShieldAlert className="mr-2 h-4 w-4" />
                Marcar como obrigatório
              </DropdownMenuItem>
            )}
            {item.classificacao !== "prioritario" && (
              <DropdownMenuItem
                onClick={() => onClassificar(item.id, "prioritario")}
              >
                <Star className="mr-2 h-4 w-4" />
                Marcar como prioritário
              </DropdownMenuItem>
            )}
            {item.classificacao !== "desejado" && (
              <DropdownMenuItem
                onClick={() => onClassificar(item.id, "desejado")}
              >
                <Tag className="mr-2 h-4 w-4" />
                Marcar como desejado
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onRemover(item.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
