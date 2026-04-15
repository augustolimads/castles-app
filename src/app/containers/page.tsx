import { ContainersContent } from "@/modules/containers/ui/containers-content"
import { items } from "@/modules/itens/items"

function ContainersPage() {
  return (
    <div>
      <ContainersContent items={items} />
    </div>
  )
}

export default ContainersPage
