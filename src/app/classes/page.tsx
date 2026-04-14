"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { charClasses } from "@/modules/compendium/charClasses"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ClassesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const defaultClass = charClasses[0]?.id || ""
  const currentClass = searchParams.get("classe") || defaultClass

  const handleClassChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("classe", value)
    router.push(`?${params.toString()}`)
  }

  const handleAbilityClick = (level: number, abilityId: number) => {
    const targetId = `ability-${level}-${abilityId}`
    const element = document.getElementById(targetId)

    if (!element) return

    element.scrollIntoView({ behavior: "smooth", block: "start" })
    window.history.replaceState(null, "", `#${targetId}`)
  }

  const selectedClass = charClasses.find((characterClass) => characterClass.id === currentClass)

  return (
    <div className="mt-4 space-y-6">
      <header className="flex gap-4 items-center sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <SidebarTrigger />
        <Select value={currentClass} onValueChange={handleClassChange}>
          <SelectTrigger className="w-full xl:hidden">
            <SelectValue placeholder="Selecione uma classe" />
          </SelectTrigger>
          <SelectContent>
            {charClasses.map((characterClass) => (
              <SelectItem key={characterClass.id} value={characterClass.id}>
                {characterClass.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Tabs value={currentClass} className="hidden xl:block" onValueChange={handleClassChange}>
          <TabsList variant="default">
            {charClasses.map((characterClass) => (
              <TabsTrigger key={characterClass.id} value={characterClass.id}>
                {characterClass.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </header>

      {selectedClass && (
        <div className="space-y-6 flex flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{selectedClass.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold w-1/3">Dado de Vida</TableCell>
                      <TableCell>{selectedClass.hitDice}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Tendência</TableCell>
                      <TableCell>{selectedClass.disposition}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Atributo Primário</TableCell>
                      <TableCell>{selectedClass.primaryAttribute}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Armas</TableCell>
                      <TableCell>{selectedClass.armas}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Armaduras</TableCell>
                      <TableCell>{selectedClass.armaduras}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução por Nível</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nível</TableHead>
                      <TableHead>PV</TableHead>
                      <TableHead>Bônus de Ataque</TableHead>
                      <TableHead>XP</TableHead>
                      <TableHead className="hidden md:block lg:hidden 2xl:block">Habilidades</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedClass.levels.map((level) => (
                      <TableRow key={level.level}>
                        <TableCell className="font-semibold">{level.level}</TableCell>
                        <TableCell>{level.hp}</TableCell>
                        <TableCell>{level.attackBonus}</TableCell>
                        <TableCell>{level.experience.toLocaleString("pt-BR")}</TableCell>
                        <TableCell className="hidden md:block lg:hidden 2xl:block">
                          {level.abilities.length > 0
                            ? level.abilities.map((ability, index) => (
                              <span key={`${level.level}-${ability.id}`}>
                                <button
                                  type="button"
                                  className="text-primary hover:underline underline-offset-4"
                                  onClick={() => handleAbilityClick(level.level, ability.id)}
                                >
                                  {ability.name}
                                </button>
                                {index < level.abilities.length - 1 ? ", " : ""}
                              </span>
                            ))
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Habilidades por Nível</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedClass.levels.map((level, index) => {
                  if (level.abilities.length === 0) return null

                  return (
                    <div key={level.level}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Nível {level.level}</Badge>
                        </div>
                        <div className="space-y-2 pl-2">
                          {level.abilities.map((ability) => (
                            <div id={`ability-${level.level}-${ability.id}`} key={`${level.level}-${ability.id}`} className="scroll-mt-24">
                              <p className="font-semibold">{ability.name}</p>
                              <p className="text-muted-foreground text-sm">
                                Teste: {ability.check}
                                {ability.description ? ` - ${ability.description}` : ""}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {index < selectedClass.levels.length - 1 && <Separator className="mt-4" />}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
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