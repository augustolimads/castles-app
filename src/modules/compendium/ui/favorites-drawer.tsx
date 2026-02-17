'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Shield, Star, Trash2 } from "lucide-react";
import { ReactNode } from "react";
import { useFavorites } from "../use-favorites";

interface FavoritesDrawerProps {
  children: ReactNode;
}

export function FavoritesDrawer({ children }: FavoritesDrawerProps) {
  const { items, removeFavorite, clearFavorites, totalItems } = useFavorites();

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
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{item.nome}</h4>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFavorite(item.id)}
                                    className="text-destructive hover:text-destructive p-1 h-6 w-6"
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>

                            <div className="flex gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    Nível {item.nivel}
                                </Badge>
                                {item.tamanho && (
                                    <Badge variant="outline" className="text-xs">
                                        {item.tamanho}
                          </Badge>
                        )}
                            </div>

                            <div className="flex gap-3 text-xs">
                                <div className="flex items-center gap-1">
                                    <Heart size={12} className="text-red-500" />
                                    <span>{item.pv}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Shield size={12} className="text-blue-500" />
                                    <span>CA {item.ca}</span>
                                </div>
                            </div>

                            {item.xp && (
                                <Badge variant="secondary" className="text-xs w-fit">
                                    {item.xp} XP
                                </Badge>
                            )}
                    </div>
                  </Card>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                                      <span>Total de Monstros:</span>
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
