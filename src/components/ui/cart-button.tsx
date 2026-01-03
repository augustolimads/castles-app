'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBasket } from "lucide-react";

interface CartButtonProps {
  children?: React.ReactNode;
}

export function CartButton({ children }: CartButtonProps) {
  const { totalItems } = useCart();

  return (
    <div className="hidden xl:block relative">
      <Button variant="outline" title="carrinho de compras" className="cursor-pointer">
        <ShoppingBasket />
      </Button>
      {totalItems > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {totalItems}
        </Badge>
      )}
    </div>
  );
}