import { Separator } from "@/components/ui/separator";
import { CircleDollarSignIcon, ShoppingBasket, Sword, WeightIcon } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ItemHorizontalCard() {
  return (
    <Card className="p-2">
      <div className="gap-4 flex flex-row">
        <div className="rounded-lg">
          <Image
            src="/dagger-black.webp"
            alt="Produto Exemplo"
            width={60}
            height={60}
            className="rounded-lg dar:brightness-[0.2] dark:grayscale"
          />
        </div>
        <div className="pt-0 flex flex-col gap-2 flex-1">
          <div className="flex justify-between gap-2">
            <h3 className="md:text-lg font-extrabold">Adaga</h3>
            <div className="flex gap-1">
              <Badge variant="secondary">
                <div className="flex gap-1">
                  <WeightIcon size={16} />
                  <span className="text-xs">EV</span>
                </div>
                <p className="text-xs font-semibold">2</p>
              </Badge>
              <Badge variant="outline">
                <p className="text-xs font-semibold">Dano 1d4</p>
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-xs">Descrição do item Descrição do item Descrição do item Descrição do item Descrição do item</p>
          </div>
        </div>
      </div>
      <div id="item-horizontal-footer" className="flex gap-2 mt-2 items-center">
        <div className="flex items-center gap-1 ">
          <CircleDollarSignIcon size={16} className="text-amber-500" />
          <span className="flex w-full items-center font-semibold text-sm">10000 PO</span>
        </div>
        <Button className="flex-1 cursor-pointer">
          <ShoppingBasket />
          <span className="text-xs">Adicionar</span>
        </Button>
      </div>
    </Card>
  )
}

