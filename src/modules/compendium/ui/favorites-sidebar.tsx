'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Shield, Star, Trash2 } from "lucide-react";
import { useFavorites } from "../use-favorites";

export function FavoritesSidebar() {
  const { items, removeFavorite, clearFavorites, totalItems } = useFavorites();

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
                    <div key={item.id} className="border rounded-lg p-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{item.nome}</h4>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFavorite(item.id)}
                                    className="text-destructive hover:text-destructive p-1 h-5 w-5"
                                >
                                    <Trash2 size={12} />
                                </Button>
                            </div>

                            <div className="flex gap-2 text-xs">
                                <Badge variant="secondary" className="text-xs">
                                    Nível {item.nivel}
                                </Badge>
                            </div>

                            <div className="flex flex-col gap-1 text-xs">
                                <div className="flex items-center gap-1">
                                    <Heart size={10} className="text-red-500" />
                                    <span>{item.pv}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Shield size={10} className="text-blue-500" />
                                    <span>CA {item.ca}</span>
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
                                      Total de Monstros:
                  </span>
                                  <span className="font-semibold">{totalItems}</span>
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
