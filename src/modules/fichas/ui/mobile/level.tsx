import { Progress } from "@/components/ui/progress"

function Level() {
  return (
    <div className="border bg-card rounded-lg p-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold">Guerreiro NV 1</span>
        <span>XP: 9/10</span>
      </div>
      <Progress value={55} />
    </div>
  )
}

export default Level