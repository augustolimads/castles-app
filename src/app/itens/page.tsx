import { items } from "@/modules/itens/items"
import { MarketContent } from "@/modules/itens/ui/market-content"

function Mercado() {
  return (
    <div>
      <MarketContent items={items} />
    </div>
  )
}

export default Mercado