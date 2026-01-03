import { ItemHorizontalCard } from "./item-horizontal-card";

export function Grid() {
  return (
    <div className="py-4 grid grid-cols lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <ItemHorizontalCard />
      <ItemHorizontalCard />
      <ItemHorizontalCard />
      <ItemHorizontalCard />
      <ItemHorizontalCard />
      <ItemHorizontalCard />
      <ItemHorizontalCard />
      <ItemHorizontalCard />
      <ItemHorizontalCard />
    </div>
  )
}
