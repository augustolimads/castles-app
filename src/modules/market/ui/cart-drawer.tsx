'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/modules/market/use-cart";
import { CircleDollarSignIcon, Minus, Plus, ShoppingBasket, Trash2, WeightIcon } from "lucide-react";
import Image from "next/image";

interface CartDrawerProps {
  children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, totalGold, totalEV, totalItems } = useCart();

  return (
    <div className="xl:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <div className="relative">
            {children}
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </div>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg flex flex-col p-4 py-6">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBasket size={20} />
              Carrinho de Compras
            </SheetTitle>
            <SheetDescription>
              {totalItems === 0 ? 'Seu carrinho está vazio' : `${totalItems} ${totalItems === 1 ? 'item' : 'itens'} no carrinho`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <ShoppingBasket size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Seu carrinho está vazio</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Adicione alguns itens para começar suas compras
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <Image
                          src={`/icons/${item.icon}.webp`}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="rounded-md"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive p-1 h-6 w-6"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>

                        {item.effect && (
                          <p className="text-xs text-muted-foreground mt-1">{item.effect}</p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-2 text-xs">
                            {(item.gold || 0) > 0 && (
                              <div className="flex items-center gap-1 text-amber-600">
                                <CircleDollarSignIcon size={12} />
                                <span>{item.gold} PO</span>
                              </div>
                            )}
                            {(item.ev || 0) > 0 && (
                              <div className="flex items-center gap-1 text-blue-600">
                                <WeightIcon size={12} />
                                <span>{item.ev} EV</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus size={12} />
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus size={12} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {items.length > 1 && (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="w-full text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Limpar Carrinho
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    <CircleDollarSignIcon size={16} className="text-amber-500" />
                    Total em Ouro:
                  </span>
                  <span className="font-semibold">{Math.floor(totalGold)} PO</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    <CircleDollarSignIcon size={16} className="text-gray-500" />
                    Total em prata:
                  </span>
                  <span className="font-semibold">{Math.floor((totalGold % 1) * 10)} PP</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    <CircleDollarSignIcon size={16} className="text-orange-600" />
                    Total em cobre:
                  </span>
                  <span className="font-semibold">{Math.round(((totalGold % 1) * 10 % 1) * 10)} PC</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    <WeightIcon size={16} className="text-blue-500" />
                    Total EV:
                  </span>
                  <span className="font-semibold">{totalEV}</span>
                </div>

                <Separator className="my-3" />

                <Button className="w-full" size="lg">
                  Finalizar Compra
                  <span className="ml-2 text-sm">({totalGold} PO)</span>
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}