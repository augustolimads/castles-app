"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

interface CartDrawerProps {
  children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
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
              {totalItems === 0
                ? "Seu carrinho está vazio"
                : `${totalItems} ${totalItems === 1 ? "item" : "itens"} no carrinho`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <ShoppingBasket
                  size={48}
                  className="text-muted-foreground mb-4"
                />
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
                      <div className="shrink-0">
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
                          <h4 className="font-semibold text-sm truncate">
                            {item.name}
                          </h4>
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
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.effect}
                          </p>
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
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="h-6 w-6 p-0"
                            >
                              <Minus size={12} />
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
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
                    <CircleDollarSignIcon
                      size={16}
                      className="text-amber-500"
                    />
                    Total em Ouro:
                  </span>
                  <span className="font-semibold">
                    {Math.floor(totalGold)} PO
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    <CircleDollarSignIcon size={16} className="text-gray-500" />
                    Total em prata:
                  </span>
                  <span className="font-semibold">
                    {Math.floor((totalGold % 1) * 10)} PP
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    <CircleDollarSignIcon
                      size={16}
                      className="text-orange-600"
                    />
                    Total em cobre:
                  </span>
                  <span className="font-semibold">
                    {Math.round((((totalGold % 1) * 10) % 1) * 10)} PC
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    <WeightIcon size={16} className="text-blue-500" />
                    Total EV:
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
                        htmlFor="available-gold-drawer"
                        className="text-xs text-muted-foreground"
                      >
                        Ouro disponivel (PO)
                      </label>
                      <Input
                        id="available-gold-drawer"
                        type="number"
                        min="0"
                        step="0.1"
                        value={availableGoldInput}
                          onChange={(event) =>
                            setAvailableGoldInput(event.target.value)
                          }
                          placeholder="Ex.: 120"
                          className="mt-1"
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
                  size="lg"
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

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setKitDialogOpen(true)}
                >
                  Salvar lista de compras (kit)
                </Button>
                {lastSavedKitName && (
                  <p className="text-xs text-muted-foreground text-center">
                    Último kit salvo: {lastSavedKitName}
                  </p>
                )}

                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  size="sm"
                  onClick={clearCart}
                >
                  Limpar carrinho
                </Button>

                <Dialog open={kitDialogOpen} onOpenChange={setKitDialogOpen}>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Salvar kit de compras</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                      <label
                        htmlFor="kit-name-dialog-drawer"
                        className="text-sm font-medium"
                      >
                        Nome do kit
                      </label>
                      <Input
                        id="kit-name-dialog-drawer"
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
        </SheetContent>
      </Sheet>
    </div>
  );
}
