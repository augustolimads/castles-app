type DmTopic = {
  id: string
  title: string
  subtitle: string
  quickInfo: string[]
  details: string[]
}

export const dmTopics: DmTopic[] = [
  {
    id: "combate-desarmado",
    title: "Combate desarmado",
    subtitle: "",
    quickInfo: ["Combate", "Desarmado", "Agarrão"],
    details: [],
  },
  {
    id: "modificadores-situacionais",
    title: "Modificadores situacionais",
    subtitle: "",
    quickInfo: ["Modificadores", "Situações", "Caído", "Cego", "Atordoado", "Elevação", "Invisível", "Montaria", "Cobertura", "Ataque à distância"],
    details: [],
  }
]