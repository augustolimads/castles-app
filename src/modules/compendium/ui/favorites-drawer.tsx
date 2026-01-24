'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CircleDollarSignIcon, Star, Trash2, WeightIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";
import { useFavorites } from "../use-favorites";

interface FavoritesDrawerProps {
  children: ReactNode;
}

export function FavoritesDrawer({ children }: FavoritesDrawerProps) {
  const { items, removeFavorite, clearFavorites, totalItems } = useFavorites();

  const totalGold = items.reduce((sum, item) => sum + (item.gold || 0), 0);
  const totalEV = items.reduce((sum, item) => sum + (item.ev || 0), 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Star size={20} />
            <span>Favoritos</span>
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {totalItems}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <Star size={48} className="text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-sm">Nenhum item favoritado</p>
              <p className="text-xs text-muted-foreground mt-1">
                Adicione itens aos favoritos para consultá-los depois
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex gap-3">
                      <div className="shrink-0">
                        <Image
                          src={`/icons/${item.icon}.webp`}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-md"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFavorite(item.id)}
                            className="text-destructive hover:text-destructive p-1 h-6 w-6"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>

                        {item.effect && (
                          <Badge variant="secondary" className="mt-1">
                            <p className="text-xs">{item.effect}</p>
                          </Badge>
                        )}

                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.obs}</p>

                        <div className="flex gap-3 mt-2 text-xs">
                          {(item.gold || 0) > 0 && (
                            <div className="flex items-center gap-1 text-amber-600">
                              <CircleDollarSignIcon size={12} />
                              <span className="font-semibold">{item.gold} PO</span>
                            </div>
                          )}
                          {(item.ev || 0) > 0 && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <WeightIcon size={12} />
                              <span className="font-semibold">{item.ev} EV</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <CircleDollarSignIcon size={14} className="text-amber-500" />
                    Total em Ouro:
                  </span>
                  <span className="font-semibold">{Math.floor(totalGold)} PO</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <CircleDollarSignIcon size={14} className="text-gray-500" />
                    Total em prata:
                  </span>
                  <span className="font-semibold">{Math.floor((totalGold % 1) * 10)} PP</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <CircleDollarSignIcon size={14} className="text-orange-600" />
                    Total em cobre:
                  </span>
                  <span className="font-semibold">{Math.round(((totalGold % 1) * 10 % 1) * 10)} PC</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <WeightIcon size={14} className="text-blue-500" />
                    EV:
                  </span>
                  <span className="font-semibold">{totalEV}</span>
                </div>

                <Separator className="my-3" />

                {items.length > 1 && (
                  <Button
                    variant="outline"
                    onClick={clearFavorites}
                    className="w-full text-destructive hover:text-destructive text-xs"
                    size="sm"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Limpar Favoritos
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
