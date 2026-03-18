import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense } from "react"


const characterClasses = [
  { value: "barbaro", label: "Bárbaro" },
  { value: "bardo", label: "Bardo" },
  { value: "cavaleiro", label: "Cavaleiro" },
  { value: "clerigo", label: "Clérigo" },
  { value: "combatente", label: "Combatente" },
  { value: "druida", label: "Druida" },
  { value: "explorador", label: "Explorador" },
  { value: "ilusionista", label: "Ilusionista" },
  { value: "lutador", label: "Lutador" },
  { value: "mago", label: "Mago" },
  { value: "paladino", label: "Paladino" },
  { value: "trapaceiro", label: "Trapaceiro" },
  { value: "assassino", label: "Assassino" },
]

function ClassesContent() {
  return (
    <div className="mt-4 space-y-6">
      <div className="flex gap-4 items-center">
        <SidebarTrigger />
        <Select defaultValue="barbaro">
          <SelectTrigger className="w-full 2xl:hidden">
            <SelectValue placeholder="Selecione uma classe" />
          </SelectTrigger>
          <SelectContent>
            {characterClasses.map((characterClass) => (
              <SelectItem key={characterClass.value} value={characterClass.value}>
                {characterClass.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Tabs defaultValue="barbaro" className="hidden 2xl:block">
          <TabsList variant="default">
            {characterClasses.map((characterClass) => (
              <TabsTrigger key={characterClass.value} value={characterClass.value}>
                {characterClass.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

function ClassesPage() {
  return (
    <Suspense fallback={<div className="mt-4">Carregando...</div>}>
      <ClassesContent />
    </Suspense>
  )
}

export default ClassesPage