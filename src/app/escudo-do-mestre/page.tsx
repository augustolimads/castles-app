"use client"

import { X } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type DmTopic = {
  id: string
  title: string
  subtitle: string
  quickInfo: string[]
  details: string[]
}

const dmTopics: DmTopic[] = [
  {
    id: "combate",
    title: "Combate Rápido",
    subtitle: "Fluxo de turnos e decisões táticas",
    quickInfo: ["Iniciativa", "Ações", "Condições"],
    details: [
      "Turno padrão: movimento, ação e bônus (se aplicável).",
      "Cobertura: meia (+2 CA), três quartos (+5 CA), total (sem linha de visão).",
      "Condições úteis para consulta rápida: enfeitiçado, caído, agarrado e inconsciente.",
      "Em caso de dúvida de regra, decida em até 30 segundos e mantenha o ritmo da mesa.",
    ],
  },
  {
    id: "economia",
    title: "Economia e Recompensas",
    subtitle: "Preços, saque e progressão de ouro",
    quickInfo: ["Ouro", "Tesouro", "Loja"],
    details: [
      "Use recompensas escalonadas por risco: baixo, moderado, alto e épico.",
      "Itens consumíveis são ótimos para variar loot sem quebrar o balanço.",
      "Mantenha uma tabela curta de preços para itens comuns da campanha.",
      "Permita negociação com testes sociais para criar cenas memoráveis fora de combate.",
    ],
  },
  {
    id: "exploracao",
    title: "Exploração e Viagem",
    subtitle: "Distâncias, clima e ritmo de jornada",
    quickInfo: ["Terreno", "Clima", "Fadiga"],
    details: [
      "Defina uma consequência clara para cada falha de navegação ou sobrevivência.",
      "Use marcos narrativos para evitar viagem longa sem significado.",
      "Clima severo impacta testes físicos e consumo de recursos.",
      "Intercale perigo, descoberta e descanso para manter o engajamento do grupo.",
    ],
  },
  {
    id: "npcs",
    title: "NPCs e Facções",
    subtitle: "Relações, motivação e conflitos vivos",
    quickInfo: ["Aliados", "Vilões", "Reputação"],
    details: [
      "Todo NPC importante deve ter objetivo, medo e algo a oferecer.",
      "Facções reagem às ações dos personagens mesmo fora de cena.",
      "Crie 2 frases de voz/trejeito para interpretação rápida.",
      "Atualize um marcador de reputação para medir impactos de longo prazo.",
    ],
  },
  {
    id: "rituais",
    title: "Magia e Rituais",
    subtitle: "Conjuração, efeitos e riscos mágicos",
    quickInfo: ["Concentração", "Ritual", "Contrapartida"],
    details: [
      "Concentração quebra ao lançar outra magia concentrada ou ao falhar em teste de resistência.",
      "Rituais podem substituir custo em recursos por tempo e exposição narrativa.",
      "Use fenômenos mágicos colaterais para enriquecer a ambientação.",
      "Defina limites claros para magia improvisada antes da cena começar.",
    ],
  },
  {
    id: "anotacoes",
    title: "Anotações de Sessão",
    subtitle: "Pistas, ganchos e próximos passos",
    quickInfo: ["Pistas", "Pendências", "Próximo jogo"],
    details: [
      "Registre nomes, locais e consequências no fim de cada sessão.",
      "Marque pendências abertas para iniciar o próximo encontro com foco.",
      "Mantenha um bloco de ganchos curtos para improviso rápido.",
      "Separe fatos confirmados de rumores para evitar contradições.",
    ],
  },
]

function DmScreen() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const selectedTopicId = searchParams.get("tema")

  const selectedTopic = useMemo(
    () => dmTopics.find((topic) => topic.id === selectedTopicId),
    [selectedTopicId]
  )

  const updateTopicParam = useCallback(
    (topicId?: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (!topicId) {
        params.delete("tema")
      } else {
        params.set("tema", topicId)
      }

      const query = params.toString()
      const url = query ? `${pathname}?${query}` : pathname
      router.push(url, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const closeDetails = useCallback(() => {
    updateTopicParam(undefined)
  }, [updateTopicParam])

  useEffect(() => {
    if (!selectedTopic) {
      return
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDetails()
      }
    }

    window.addEventListener("keydown", handleEsc)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [closeDetails, selectedTopic])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 md:px-6">
      <header className="relative overflow-hidden rounded-3xl border bg-muted/20 shadow-sm">
        <div className="relative h-44 w-full sm:h-56 lg:h-64">
          <Image
            src="/banner-00.jpg"
            alt="Capa do Escudo do Mestre"
            fill
            priority
            className="object-cover brightness-[1]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_35%),linear-gradient(120deg,rgba(30,27,24,0.5),rgba(120,53,15,0.75))]" />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div className="flex items-end gap-3">
            <div className="relative size-20 overflow-hidden rounded-2xl border-2 border-white/60 bg-black/30 shadow-lg sm:size-24">
              <Image src="/icons/shield.webp" alt="Ícone do escudo" fill className="object-cover" />
            </div>
            <div className="space-y-1 text-white">
              <p className="text-xs uppercase tracking-[0.25em] text-white/75">Dm Screen</p>
              <h1 className="text-2xl font-semibold sm:text-3xl">Escudo do Mestre</h1>
              <p className="text-sm text-white/80">Atalhos de regra e narrativa para consultas rápidas.</p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dmTopics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className="cursor-pointer text-left"
              onClick={() => updateTopicParam(topic.id)}
            >
              <Card className="group border-border/70 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
                <CardHeader className="gap-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>{topic.title}</span>
                    <span className="text-muted-foreground transition group-hover:text-primary">+</span>
                  </CardTitle>
                  <CardDescription>{topic.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {topic.quickInfo.map((info) => (
                    <Badge key={info} variant="outline" className="font-normal">
                      {info}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </main>

      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
          <button
            type="button"
            aria-label="Fechar detalhes"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDetails}
          />
          <Card
            className="relative max-h-[85vh] w-full max-w-2xl gap-4 overflow-auto border-border/80"
          >
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{selectedTopic.title}</CardTitle>
                  <CardDescription className="text-base">{selectedTopic.subtitle}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={closeDetails} aria-label="Fechar detalhes">
                  <X />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pb-6">
              <div className="flex flex-wrap gap-2 pb-2">
                {selectedTopic.quickInfo.map((info) => (
                  <Badge key={info} variant="secondary">
                    {info}
                  </Badge>
                ))}
              </div>

              {selectedTopic.details.map((detail) => (
                <div key={detail} className="rounded-lg border bg-muted/30 px-4 py-3 text-sm leading-relaxed">
                  {detail}
                </div>
              ))}

              <div className="pt-2">
                <Button className="cursor-pointer" onClick={closeDetails}>
                  Fechar e voltar ao escudo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default DmScreen