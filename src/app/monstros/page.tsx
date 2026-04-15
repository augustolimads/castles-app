import { monsters } from '@/modules/compendium/monsters'
import { CompendiumContent } from '@/modules/compendium/ui/compendium-content'

function Monstros() {
  return (
    <div>
      <CompendiumContent monsters={monsters} />
    </div>
  )
}

export default Monstros