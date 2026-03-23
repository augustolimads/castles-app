import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/modules/itens/use-cart";
import { CircleDollarSignIcon, RotateCcw, ShoppingBasket, Trash2, WeightIcon } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";

type ItemHorizontalCardProps = {
  item: {
    id: string;
    type: string;
    name: string;
    effect: string;
    gold?: number | undefined;
    ev?: number | null | undefined;
    obs: string;
    tags: string;
    proficience: string[];
    icon: string;
    image: string;
  };
  onHide?: () => void;
  onRestore?: () => void;
};

export function ItemHorizontalCard({ item, onHide, onRestore }: ItemHorizontalCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = useCallback(() => {
    addItem(item);
  }, [addItem, item]);

  return (
    <Card className="p-2">
      <div className="gap-4 flex flex-row">
        <div className="rounded-lg">
          <Image
            src={`/icons/${item.icon}.webp`}
            alt={item.name}
            width={60}
            height={60}
            className="rounded-lg dar:brightness-[0.2] dark:grayscale"
          />
        </div>
        <div className="pt-0 flex flex-col gap-2 flex-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="md:text-lg font-extrabold">{item.name}</h3>
            <div className="flex gap-1">
              {item.effect && item.effect !== "" && <Badge variant="secondary">
                <p className="text-xs font-semibold">{item.effect}</p>
              </Badge>}
            </div>
          </div>
          <div>
            <p className="text-xs">{item.obs}</p>
          </div>
        </div>
      </div>
      <div id="item-horizontal-footer" className="flex gap-2 mt-2 justify-between items-center">
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-1">
            <CircleDollarSignIcon size={16} className="text-amber-500" />
            <span className="flex w-full items-center font-semibold text-sm">{item.gold} PO</span>
          </div>
          {item.ev !== null && item.ev !== undefined && <Badge variant="outline">
            <div className="flex gap-1">
              <WeightIcon size={16} />
              <span className="text-xs">EV</span>
            </div>
            <p className="text-xs font-semibold">{item.ev}</p>
          </Badge>}
        </div>
        <div className="flex gap-1 w-1/2">
          {onRestore && (
            <Button variant="outline" size="icon" className="cursor-pointer shrink-0" title="Restaurar item" onClick={onRestore}>
              <RotateCcw size={16} />
            </Button>
          )}
          {onHide && (
            <Button variant="outline" size="icon" className="cursor-pointer shrink-0 text-muted-foreground hover:text-destructive" title="Ocultar item" onClick={onHide}>
              <Trash2 size={16} />
            </Button>
          )}
          <Button className="flex-1 cursor-pointer" onClick={handleAddToCart}>
            <ShoppingBasket />
            <span className="text-xs">Adicionar</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}

