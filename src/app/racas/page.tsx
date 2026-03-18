"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { races } from "@/modules/compendium/races"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"


function RacesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentRace = searchParams.get("raca") || "anao"

  const handleRaceChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("raca", value)
    router.push(`?${params.toString()}`)
  }

  const selectedRace = races.find(race => race.id === currentRace)

  return (
    <div className="mt-4 space-y-6">
      <div className="flex gap-4 items-center">
        <SidebarTrigger />
        <Select value={currentRace} onValueChange={handleRaceChange}>
          <SelectTrigger className="w-full lg:hidden">
            <SelectValue placeholder="Selecione uma raça" />
          </SelectTrigger>
          <SelectContent>
            {races.map((race) => (
              <SelectItem key={race.id} value={race.id}>
                {race.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Tabs
          value={currentRace}
          className="hidden lg:block"
          onValueChange={handleRaceChange}
        >
          <TabsList variant="default">
            {races.map((race) => (
              <TabsTrigger key={race.id} value={race.id}>
                {race.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {selectedRace && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{selectedRace.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold w-1/3">Idiomas</TableCell>
                    <TableCell>{selectedRace.languages}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Tamanho</TableCell>
                    <TableCell>{selectedRace.size}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Movimento</TableCell>
                    <TableCell>{selectedRace.movement}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Classes Típicas</TableCell>
                    <TableCell>{selectedRace.typicalClasses}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Modificador de Atributo</TableCell>
                    <TableCell>{selectedRace.attributeMod}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Modificador de Classe</TableCell>
                    <TableCell>{selectedRace.classMod}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Visão</TableCell>
                    <TableCell>{selectedRace.vision}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {selectedRace.traits && selectedRace.traits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Características Especiais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedRace.traits.map((trait, index) => (
                    <div key={trait.id}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{index + 1}</Badge>
                          <h3 className="font-semibold">{trait.title}</h3>
                        </div>
                        <p className="text-muted-foreground pl-8">
                          {trait.description}
                        </p>
                      </div>
                      {index < selectedRace.traits.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default function RacesPage() {
  return (
    <Suspense fallback={<div className="mt-4">Carregando...</div>}>
      <RacesContent />
    </Suspense>
  )
}