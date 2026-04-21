import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CircleDollarSignIcon, ShoppingBasket, Sword, WeightIcon } from "lucide-react";
import Image from "next/image";

export function ItemCard() {
  return (
     <Card className="p-0 gap-4">
        <AspectRatio ratio={10 / 9} className="relative w-full bg-muted rounded-t-lg">
        <div className="absolute z-10 top-2 left-2 right-2 flex justify-between items-center">
          <Badge>
            <p className="text-xs font-semibold">Dano 1d4</p>
          </Badge>
          <Badge>
            <div className="flex gap-1">
              <WeightIcon size={16} />
              <span className="text-xs">EV</span>
            </div>
            <p className="text-xs font-semibold">2</p>
          </Badge>
        </div>
          <Image
            src="/icons/dagger-black.webp"
            alt="Produto Exemplo"
            fill
          className="h-full w-full rounded-t-lg object-cover"
          />
        </AspectRatio>
        <div className="p-2 pt-0 flex flex-col gap-2">
          <div className="flex gap-1">
            <Badge variant="secondary">
              <Sword size={12} />
            </Badge>
          <h3 className="md:text-lg font-extrabold">Adaga</h3>
          </div>
          <div>
            <p className="text-xs pb-1">Descrição do item Descrição do item Descrição do item Descrição do item Descrição do item</p>
            <Separator />
          </div>
          <div className="flex gap-2 mt-2 items-center">
            <div className="flex items-center gap-1 w-1/2">
              <CircleDollarSignIcon size={16} />
              <span className="flex w-full items-center font-semibold text-sm">1000 PO</span>
            </div>
            <Button className="flex-1 cursor-pointer">
              <ShoppingBasket />
              <span className="text-xs">Adicionar</span>
            </Button>
          </div>
        </div>
      </Card>
  )
}

