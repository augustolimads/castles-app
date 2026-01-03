import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HeartIcon, Search, ShoppingBasket } from "lucide-react"

export function Header() {
    return (
        <header className="sticky top-0 bg-white flex items-center justify-between w-full py-2">
            <Button>Início</Button>
            <div className="relative w-6/12">
                <Search className="absolute top-2 left-2 pointer-events-none" size={20} color="gray" />
                <Input name="search" className="w-full pl-8" placeholder="Pesquise um item" />
            </div>
            <div className="flex items-center gap-4">
                <Button variant="outline" title="coleções e favoritos">
                    <HeartIcon />
                </Button>
                <Button variant="outline" title="carrinho de compras">
                    <ShoppingBasket />
                </Button>
            </div>
        </header>
    )
}
