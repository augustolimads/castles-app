export interface Race {
    id: string
    name: string
    languages: string
    size: string
    movement: string
    typicalClasses: string
    attributeMod: string
    classMod: string
    vision: string
    traits: {
        id: number
        title: string
        description: string
    }[]
}

export const races: Race[] = [
    {
        id: "anao",
        name: "Anão",
        languages: "Comum, Anão, Gnomo, Goblinóide, Pequenino, Élfico, Ogro, Gigante, Troll",
        size: "Pequeno",
        movement: "20ft (6m)",
        typicalClasses: "Fighter, Rogue, Barbarian, Cleric, Bard",
        attributeMod: "+1 Constituição, -1 Destreza",
        classMod: "+2 encontrar armadilhas apenas em estruturas",
        vision: "escuridão 120ft (36m)",
        traits: [
            {
                id: 1,
                title: "Animosidade (elfos)",
                description: "-2 em testes de carisma ao lidar com elfos",
            },
            {
                id: 2,
                title: "Determinar profundidade e direção",
                description: "sentir profundidade e direção aproximada no subsolo",
            },
            {
                id: 3,
                title: "Inimizade (goblins/orcs)",
                description: "+1 para acertar goblins e orcs. -4 em testes de carisma ao lidar com essas criaturas",
            },
            {
                id: 4,
                title: "Perícia defensiva (gigantes/ogros)",
                description: "+4 na classe de armadura contra gigantes e ogros",
            },
            {
                id: 5,
                title: "Resistente à magia arcana",
                description: "+3 em jogada de proteção contra feitiços arcanos e efeitos mágicos",
            },
            {
                id: 6,
                title: "Resistente ao medo",
                description: "+2 em jogada de proteção contra medo",
            },
            {
                id: 7,
                title: "Resistente a venenos",
                description: "+2 em jogada de proteção contra venenos",
            },
            {
                id: 8,
                title: "Escultor (Sabedoria)",
                description: "Identifica construções, características incomuns ou únicas de trabalhos em pedra e avalia o valor aproximado de objetos de pedra ou metal. Ao passar a 3m (10ft) tem direito a um teste de sabedoria +2 para reconhecer a construção. +4 Caso procurar ativamente.",
            },
        ]
    },
    {
        id: "gnomo",
        name: "Gnomo",
        languages: "Comum, Anão, Élfico, Gnomo, Goblinóide, Kobold",
        size: "Pequeno",
        movement: "20ft (6m)",
        typicalClasses: "Trapaceiro, Ilusionista, Druida, Bardo",
        attributeMod: "+1 Inteligência, -1 Força",
        classMod: "+3 Ouvir",
        vision: "escuridão 50ft (15m)",
        traits: [
            {
                id: 1,
                title: "Empatia animal",
                description: "Comunicação empática com animais da natureza",
            },
            {
                id: 2,
                title: "Perícia em Combate (goblins/kobolds)",
                description: "+1 para acertar goblins e kobolds usando armas de mão em combate corporal",
            },
            {
                id: 3,
                title: "Feitiços",
                description: "Habilidade inata de conjurar como um conjurador nv1 os seguintes feitiços: Orbes dançantes, Som fantasma e prestidigitação.",
            }
        ]
    },
    {
        id: "elfo",
        name: "Elfo",
        languages: "Comum, Élfico, Anão, Gnomo, Goblinóide, Pequenino, Orc",
        size: "Médio",
        movement: "30ft (9m)",
        typicalClasses: "Combatente, Explorador, Trapaceiro, Mago, Druida, Cavaleiro, Bardo",
        attributeMod: "+1 Destreza, -1 Constituição",
        classMod: "+2 Ouvir, +2 Mover-se em silêncio, +2 Encontrar armadilhas",
        vision: "crepuscular 1km (1/2 mile)",
        traits: [
            {
                id: 1,
                title: "Sentidos Aprimorados",
                description: "Visão e audição aprimoradas. A até 3 quilômetros (1,5 milhas) de distância",
            },
            {
                id: 2,
                title: "Resistente a magia",
                description: "+10 em jogada de proteção contra feitiços que encantam ou causam sono não natural",
            },
            {
                id: 3,
                title: "Detectar portas ocultas",
                description: "Ao passar 1,5m (5ft) de uma porta oculta, tem direito a um teste de sabedoria +2 para detectá-la. Se procurar ativamente +2",
            },
            {
                id: 4,
                title: "Treinamento com armas",
                description: "+1 para acertar com qualquer arco, espada longa ou espada curta",
            }
        ]
    },
    {
        id: "meio-elfo",
        name: "Meio-Elfo (escolha linhagem)",
        languages: "Comum, Élfico, Anão, Gnomo, Goblinóide, Pequenino e Orc",
        size: "Médio",
        movement: "30ft (9m)",
        typicalClasses: "Qualquer",
        attributeMod: "Veja abaixo de acordo com a linhagem escolhida",
        classMod: "+2 Encontrar armadilhas, +2 ouvir (linhagem élfica), +2 Mover-se em silêncio",
        vision: "Escuro 60ft (18m)",
        traits: [
            {
                id: 1,
                title: "Empatia",
                description: "+2 em todos os testes de Carisma",
            },
            {
                id: 2, 
                title: "Detectar portas escondidas",
                description: "Ao passar 1,5m (5ft) de uma porta oculta, tem direito a um teste de sabedoria para detectá-la. Se procurar ativamente +1",
            },
            {
                id: 3,
                title: "(linhagem humana) Bônus do teste de atributo",
                description: "+2 em todos os testes de atributo",
            },
            {
                id: 4,
                title: "(linhagem humana) Resistência a magia",
                description: "+2 em jogada de proteção contra feitiços que encantam ou causam sono não natural",
            },
            {
                id: 5,
                title: "(linhagem élfica) Modificadores de atributos",
                description: "+1 em Destreza e -1 em Constituição"
            },
            {
                id: 6,
                title: "(linhagem élfica) Sentidos aprimorados",
                description: "Visão e audição aprimoradas. A até 3 quilômetros (1,5 milhas) de distância",
            },
            {
                id: 7,
                title: "(linhagem élfica) Resistência a magia",
                description: "+4 em jogada de proteção contra feitiços que encantam ou causam sono não natural",
            }
        ]
    },
    {
        id: "meio-orc",
        name: "Meio-Orc",
        languages: "Comum, Goblinóide, Orc",
        size: "Médio",
        movement: "30ft (9m)",
        typicalClasses: "Combatente, Explorador, Trapaceiro, Assassino, Bárbaro, Lutador, Clérigo, Cavaleiro",
        attributeMod: "+1 Constituição, +1 Força ,-2 Carisma",
        classMod: "+2 Rastrear",
        vision: "Escuro 60ft (18m)",
        traits: [
            {
                id: 1,
                title: "Olfato aprimorado",
                description: "detecta presença de criaturas a até 18m (60ft). Pode reconhecer indivíduos com cheiro",
            },
            {
                id: 2,
                title: "Proeza marcial",
                description: "+1 CA sem armadura vestida."
            },
            {
                id: 3,
                title: "Resistente a doenças",
                description: "+2 em jogada de proteção contra doenças",
            }
        ]
    },
    {
        id: "humano",
        name: "Humano",
        languages: "Comum",
        size: "Médio",
        movement: "30ft (9m)",
        typicalClasses: "Qualquer",
        attributeMod: "Nenhum",
        classMod: "Nenhum",
        vision: "Normal",
        traits: [
            {
                id: 1,
                title: "Atributos primários",
                description: "Escolhem um atributo primário adicional, para um total de três.",
            },
        ]
    },
    {
        id: "pequenino",
        name: "Pequenino",
        languages: "Comum",
        size: "Pequeno",
        movement: "20ft (6m)",
        typicalClasses: "Combatente, Explorador, Trapaceiro, Clérigo, Druida, Bardo",
        attributeMod: "+1 Destreza, -1 Força",
        classMod: "+2 Ocultar, +2 Esconder-se, +2 Mover-se em silêncio",
        vision: "Crepuscular",
        traits: [
            {
                id: 1,
                title: "Destemido",
                description: "+2 em jogada de proteção contra medo",
            },
            {
                id: 2,
                title: "Resistente",
                description: "+1 em todas as jogadas de proteção de Constituição"
            }
        ]
    },
]