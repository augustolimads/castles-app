"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { saveCartKit } from "@/modules/itens/kits";
import { useCart } from "@/modules/itens/use-cart";
import { useCharacterCartCheckout } from "@/modules/itens/use-character-cart-checkout";
import {
  CircleDollarSignIcon,
  Minus,
  Plus,
  ShoppingBasket,
  Trash2,
  WeightIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CartSidebar() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalGold,
    totalEV,
    totalItems,
  } = useCart();
  const { linkedCharacter, purchaseForLinkedCharacter } =
    useCharacterCartCheckout();
  const [availableGoldInput, setAvailableGoldInput] = useState("");
  const [kitDialogOpen, setKitDialogOpen] = useState(false);
  const [kitNameInput, setKitNameInput] = useState("");
  const [lastSavedKitName, setLastSavedKitName] = useState<string | null>(null);

  const manualAvailableGold = Number.parseFloat(
    availableGoldInput.replace(",", "."),
  );
  const availableGold = linkedCharacter
    ? linkedCharacter.availableGold
    : manualAvailableGold;
  const hasAvailableGold = linkedCharacter
    ? true
    : availableGoldInput.trim() !== "" && !Number.isNaN(manualAvailableGold);
  const remainingGold = hasAvailableGold ? availableGold - totalGold : null;
  const canPurchaseForCharacter =
    !!linkedCharacter &&
    items.length > 0 &&
    totalGold <= linkedCharacter.availableGold;

  const handleSaveKit = () => {
    const savedKit = saveCartKit(items, kitNameInput);
    if (savedKit) {
      setLastSavedKitName(savedKit.name);
      setKitNameInput("");
      setKitDialogOpen(false);
    }
  };

  const handlePurchaseForCharacter = () => {
    const purchased = purchaseForLinkedCharacter(items, totalGold);
    if (purchased && linkedCharacter) {
      clearCart();
      router.push(`/fichas/${linkedCharacter.id}`);
    }
  };

  return (
    <div className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-18">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBasket size={20} />
            <h3 className="font-semibold">Carrinho de Compras</h3>
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {totalItems}
              </Badge>
            )}
          </div>

          <div className="max-h-96 overflow-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <ShoppingBasket
                  size={48}
                  className="text-muted-foreground mb-4"
                />
                <p className="text-muted-foreground text-sm">
                  Seu carrinho está vazio
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Adicione alguns itens para começar
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
                          <h4 className="font-medium text-sm truncate">
                            {item.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive p-1 h-5 w-5"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>

                        {item.effect && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {item.effect}
                          </p>
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

                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="h-5 w-5 p-0"
                            >
                              <Minus size={10} />
                            </Button>
                            <span className="text-xs font-medium w-4 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="h-5 w-5 p-0"
                            >
                              <Plus size={10} />
                            </Button>
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
                    <CircleDollarSignIcon
                      size={14}
                      className="text-amber-500"
                    />
                    Total em Ouro:
                  </span>
                  <span className="font-semibold">
                    {Math.floor(totalGold)} PO
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <CircleDollarSignIcon size={14} className="text-gray-500" />
                    Total em prata:
                  </span>
                  <span className="font-semibold">
                    {Math.floor((totalGold % 1) * 10)} PP
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <CircleDollarSignIcon
                      size={14}
                      className="text-orange-600"
                    />
                    Total em cobre:
                  </span>
                  <span className="font-semibold">
                    {Math.round((((totalGold % 1) * 10) % 1) * 10)} PC
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <WeightIcon size={14} className="text-blue-500" />
                    EV:
                  </span>
                  <span className="font-semibold">{totalEV}</span>
                </div>

                <div className="pt-2">
                  {linkedCharacter ? (
                    <div className="space-y-1 rounded-md border border-dashed p-2">
                      <p className="text-xs font-medium">
                        Carrinho para este personagem
                      </p>
                      <p
                        className="text-xs text-muted-foreground truncate"
                        title={linkedCharacter.name}
                      >
                        {linkedCharacter.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ouro disponível:{" "}
                        {linkedCharacter.availableGold.toFixed(2)} PO
                      </p>
                    </div>
                  ) : (
                    <>
                      <label
                        htmlFor="available-gold-sidebar"
                        className="text-xs text-muted-foreground"
                      >
                        Ouro disponivel (PO)
                      </label>
                      <Input
                        id="available-gold-sidebar"
                        type="number"
                        min="0"
                        step="0.1"
                        value={availableGoldInput}
                          onChange={(event) =>
                            setAvailableGoldInput(event.target.value)
                          }
                          placeholder="Ex.: 120"
                          className="mt-1 h-8 text-sm"
                        />
                    </>
                  )}
                </div>

                {hasAvailableGold && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Saldo restante:
                    </span>
                    <span
                      className={`font-semibold ${remainingGold !== null && remainingGold < 0 ? "text-destructive" : "text-emerald-600"}`}
                    >
                      {remainingGold?.toFixed(1)} PO
                    </span>
                  </div>
                )}

                <Separator className="my-3" />
                <Button
                  className="w-full"
                  size="sm"
                  onClick={handlePurchaseForCharacter}
                  disabled={!linkedCharacter || !canPurchaseForCharacter}
                >
                  Comprar para este personagem
                </Button>
                {!linkedCharacter && (
                  <p className="text-xs text-muted-foreground text-center">
                    Abra o mercado a partir de uma ficha para comprar para um
                    personagem.
                  </p>
                )}
                {items.length > 1 && (
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full text-destructive hover:text-destructive text-xs"
                    size="sm"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Limpar
                  </Button>
                )}

                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => setKitDialogOpen(true)}
                >
                  Salvar lista de compras (kit)
                </Button>
                {lastSavedKitName && (
                  <p className="text-xs text-muted-foreground text-center">
                    Último kit salvo: {lastSavedKitName}
                  </p>
                )}

                <Dialog open={kitDialogOpen} onOpenChange={setKitDialogOpen}>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Salvar kit de compras</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                      <label
                        htmlFor="kit-name-dialog-sidebar"
                        className="text-sm font-medium"
                      >
                        Nome do kit
                      </label>
                      <Input
                        id="kit-name-dialog-sidebar"
                        value={kitNameInput}
                        onChange={(event) =>
                          setKitNameInput(event.target.value)
                        }
                        onKeyDown={(e) => e.key === "Enter" && handleSaveKit()}
                        placeholder="Ex.: Kit da masmorra"
                        className="mt-2"
                        maxLength={60}
                        autoFocus
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Deixe em branco para usar a data/hora atual.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setKitDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={handleSaveKit}>
                        Salvar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
