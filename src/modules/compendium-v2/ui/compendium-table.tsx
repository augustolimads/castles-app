"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowDownAZ, ArrowUpAZ, Pencil } from "lucide-react";
import Image from "next/image";
import type { CompendiumListSort } from "../data/repository";
import type { CompendiumListItem } from "../domain/types";

interface CompendiumTableProps {
  items: CompendiumListItem[];
  onOpenItem: (id: string) => void;
  onEditItem: (id: string) => void;
    sort: CompendiumListSort;
    onSortChange: (sort: CompendiumListSort) => void;
}

export function CompendiumTable({
  items,
  onOpenItem,
  onEditItem,
    sort,
    onSortChange,
}: CompendiumTableProps) {
    const nextNameSort: CompendiumListSort =
        sort === "nome_asc" ? "nome_desc" : "nome_asc";
    const nextCategorySort: CompendiumListSort =
        sort === "category_asc" ? "category_desc" : "category_asc";

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Thumb</TableHead>
                      <TableHead>
                          <button
                              type="button"
                              className="inline-flex items-center gap-1 hover:text-foreground"
                              onClick={() => onSortChange(nextNameSort)}
                          >
                              Nome
                              {sort === "nome_desc" ? (
                                  <ArrowDownAZ className="h-4 w-4" />
                              ) : (
                                  <ArrowUpAZ className="h-4 w-4" />
                              )}
                          </button>
                      </TableHead>
                      <TableHead className="w-40">
                          <button
                              type="button"
                              className="inline-flex items-center gap-1 hover:text-foreground"
                              onClick={() => onSortChange(nextCategorySort)}
                          >
                              Categoria
                              {sort === "category_desc" ? (
                                  <ArrowDownAZ className="h-4 w-4" />
                              ) : (
                                  <ArrowUpAZ className="h-4 w-4" />
                              )}
                          </button>
                      </TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-24 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="cursor-pointer">
              <TableCell>
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={`Thumbnail de ${item.nome}`}
                    className="h-10 w-10 rounded object-cover border"
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    -
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">
                <button
                  type="button"
                  onClick={() => onOpenItem(item.id)}
                  className="w-full text-left"
                >
                  {item.nome}
                </button>
              </TableCell>
              <TableCell className="capitalize">
                <button
                  type="button"
                  onClick={() => onOpenItem(item.id)}
                  className="w-full text-left"
                >
                  {item.category}
                </button>
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  onClick={() => onOpenItem(item.id)}
                  className="w-full text-left"
                >
                  <div className="line-clamp-1">
                    {item.tags.join(", ") || "-"}
                  </div>
                </button>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Editar ${item.nome}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onEditItem(item.id);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
