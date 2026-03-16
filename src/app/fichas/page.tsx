import { Button } from "@/components/ui/button"

function CharacterSheet() {
  return (
    <div>
      <Button className="cursor-pointer">nova ficha</Button>
      <h1>Fichas salvas</h1>
      <p>Aqui vai listar todas as fichas salvas no localstorage</p>
    </div>
  )
}

export default CharacterSheet