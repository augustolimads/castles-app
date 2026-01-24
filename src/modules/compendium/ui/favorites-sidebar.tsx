'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CircleDollarSignIcon, Star, Trash2, WeightIcon } from "lucide-react";
import Image from "next/image";
import { useFavorites } from "../use-favorites";

export function FavoritesSidebar() {
  const { items, removeFavorite, clearFavorites, totalItems } = useFavorites();

  const totalGold = items.reduce((sum, item) => sum + (item.gold || 0), 0);
  const totalEV = items.reduce((sum, item) => sum + (item.ev || 0), 0);

  return (
    <div className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-18">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Star size={20} />
            <h3 className="font-semibold">Favoritos</h3>
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {totalItems}
              </Badge>
            )}
          </div>

          <div className="max-h-96 overflow-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <Star size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-sm">Nenhum item favoritado</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Adicione itens aos favoritos para consultá-los depois
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex gap-3">
                      <div className="shrink-0">
                        <Image
                          src={`/icons/${item.icon}.webp`}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFavorite(item.id)}
                            className="text-destructive hover:text-destructive p-1 h-5 w-5"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>

                        {item.effect && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">{item.effect}</p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-2 text-xs">
                            {(item.gold || 0) > 0 && (
                              <div className="flex items-center gap-1 text-amber-600">
                                <CircleDollarSignIcon size={10} />
                                <span>{item.gold}</span>
                              </div>
                            )}
                            {(item.ev || 0) > 0 && (
                              <div className="flex items-center gap-1 text-blue-600">
                                <WeightIcon size={10} />
                                <span>{item.ev}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="mt-4 pt-4 border-t">
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
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
