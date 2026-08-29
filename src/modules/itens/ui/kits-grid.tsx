'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CartKit } from "@/modules/itens/kits";
import { CART_KITS_UPDATED_EVENT, deleteSavedCartKit, getSavedCartKits } from "@/modules/itens/kits";
import { useCart } from "@/modules/itens/use-cart";
import { CircleDollarSignIcon, Package, ShoppingBasket, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function KitsGrid() {
  const { replaceCart } = useCart();
  const [kits, setKits] = useState<CartKit[]>([]);

  const loadKits = useCallback(() => {
    setKits(getSavedCartKits());
  }, []);

  useEffect(() => {
    loadKits();

    const reload = () => loadKits();

    window.addEventListener(CART_KITS_UPDATED_EVENT, reload);
    window.addEventListener('storage', reload);

    return () => {
      window.removeEventListener(CART_KITS_UPDATED_EVENT, reload);
      window.removeEventListener('storage', reload);
    };
  }, [loadKits]);

  const handleAddKit = useCallback((kit: CartKit) => {
    replaceCart(kit.items);
  }, [replaceCart]);

  const handleDeleteKit = useCallback((kitId: string) => {
    deleteSavedCartKit(kitId);
    setKits((current) => current.filter((k) => k.id !== kitId));
  }, []);

  if (kits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <Package size={64} className="text-muted-foreground" />
        <p className="text-muted-foreground text-lg font-medium">Nenhum kit salvo</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Adicione itens ao carrinho, dê um nome e salve a lista para ela aparecer aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-3 gap-4">
      {kits.map((kit) => (
        <Card key={kit.id} className="p-3 flex flex-col gap-3">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-base leading-tight">{kit.name}</h3>
            <Badge variant="secondary" className="shrink-0">
              {kit.totalItems} {kit.totalItems === 1 ? 'item' : 'itens'}
            </Badge>
          </div>

          <div className="flex flex-col gap-1 flex-1 border rounded-md p-2 bg-muted/40">
            {kit.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="truncate text-muted-foreground">{item.name}</span>
                <span className="ml-3 shrink-0 font-medium tabular-nums">x{item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center gap-2 border-t pt-3">
            <div className="flex items-center gap-1 text-amber-600 font-semibold text-sm">
              <CircleDollarSignIcon size={16} />
              <span>{Math.floor(kit.totalGold)} PO</span>
              {Math.floor((kit.totalGold % 1) * 10) > 0 && (
                <span className="text-gray-500">{Math.floor((kit.totalGold % 1) * 10)} PP</span>
              )}
              {Math.round(((kit.totalGold % 1) * 10 % 1) * 10) > 0 && (
                <span className="text-orange-600">{Math.round(((kit.totalGold % 1) * 10 % 1) * 10)} PC</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDeleteKit(kit.id)}
              >
                <Trash2 size={14} />
              </Button>
              <Button size="sm" onClick={() => handleAddKit(kit)}>
                <ShoppingBasket size={14} />
                <span className="hidden md:inline">Adicionar</span>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
