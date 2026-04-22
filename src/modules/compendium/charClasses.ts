export const charClasses = [
    {
        id: "barbaro",
        name: "Bárbaro",
        hitDice: "1d12",
        disposition: "Qualquer",
        primaryAttribute: "Constituição",
        armas: 'Qualquer',
        armaduras: 'Qualquer',
        levels: [
            {
                level: 1,
                hp: 'd12',
                attackBonus: '+0',
                experience: 0,
                abilities: [
                    {
                        id: 1,
                        name: "Senso de Combate",
                        description: "",
                        check: "-"
                    },
                    {
                        id: 2,
                        name: "Caçador de Cervos",
                        description: "",
                        check: "-"
                    },
                    {
                        id: 3,
                        name: "Intimidar",
                        description: "",
                        check: "Constituição"
                    },
                    {
                        id: 4,
                        name: "Instinto Primitivo",
                        description: "",
                        check: "-"
                    }
                ]
            },
            {
                level: 2,
                hp: 'd12',
                attackBonus: '+1',
                experience: 2101,
                abilities: []
            },
            {
                level: 3,
                hp: 'd12',
                attackBonus: '+2',
                experience: 4701,
                abilities: [
                    {
                        id: 1,
                        name: "Intimidar",
                        description: "",
                        check: "Constituição"
                    },
                ]
            },
            {
                level: 4,
                hp: 'd12',
                attackBonus: '+3',
                experience: 9401,
                abilities: [
                    {
                        id: 1,
                        name: "Turbilhão",
                        description: "",
                        check: "-"
                    },
                ]
            },
            {
                level: 5,
                hp: 'd12',
                attackBonus: '+4',
                experience: 20001,
                abilities: []
            },
            {
                level: 6,
                hp: 'd12',
                attackBonus: '+5',
                experience: 40001,
                abilities: [
                    {
                        id: 1,
                        name: "Intimidar",
                        description: "",
                        check: "Constituição"
                    },
                    {
                        id: 2,
                        name: "Turbilhão",
                        description: "",
                        check: "-"
                    },
                    {
                        id: 3,
                        name: "Vontade Primitiva",
                        description: "",
                        check: "-"
                    }
                ]
            },
            {
                level: 7,
                hp: 'd12',
                attackBonus: '+6',
                experience: 80001,
                abilities: []
            },
            {
                level: 8,
                hp: 'd12',
                attackBonus: '+7',
                experience: 170001,
                abilities: []
            },
            {
                level: 9,
                hp: 'd12',
                attackBonus: '+8',
                experience: 340001,
                abilities: []
            },
            {
                level: 10,
                hp: 'd12',
                attackBonus: '+9',
                experience: 600001,
                abilities: [
                    {
                        id: 1,
                        name: "Intimidar",
                        description: "",
                        check: "Constituição"
                    },
                    {
                        id: 2,
                        name: "Turbilhão",
                        description: "",
                        check: "-"
                    },
                    {
                        id: 3,
                        name: "Chamado Ancestral",
                        description: "",
                        check: "-"
                    }
                ]
            },
            {
                level: 11,
                hp: '+5 PV',
                attackBonus: '+10',
                experience: 800001,
                abilities: []
            },
            {
                level: 12,
                hp: '+5 PV',
                attackBonus: '+11',
                experience: 1000001,
                abilities: []
            }
        ]
    },
    {
        id: "bardo",
        name: "Bardo",
        hitDice: "1d10",
        disposition: "Qualquer",
        primaryAttribute: "Carisma",
        armas: 'espada larga, arcos, clava, adaga, dardo, machado de mão, martelos, dardo, espada longa, florete, cimitarra, espada curta, funda, lança, bastão',
        armaduras: 'peitorais, camisa de cota de malha, couro cozido, conjunto grego, peles, laminar de couro, couro, jaqueta de couro, acolchoada, cota de anéis, couro tachado',
        levels: [
            {
                level: 1,
                hp: 'd10',
                attackBonus: '+0',
                experience: 0,
                abilities: []
            },
            {
                level: 2,
                hp: 'd10',
                attackBonus: '+1',
                experience: 1501,
                abilities: []
            },
            {
                level: 3,
                hp: 'd10',
                attackBonus: '+2',
                experience: 3251,
                abilities: []
            },
            {
                level: 4,
                hp: 'd10',
                attackBonus: '+3',
                experience: 7501,
                abilities: []
            },
            {
                level: 5,
                hp: 'd10',
                attackBonus: '+4',
                experience: 15001,
                abilities: []
            },
            {
                level: 6,
                hp: 'd10',
                attackBonus: '+5',
                experience: 30001,
                abilities: []
            },
            {
                level: 7,
                hp: 'd10',
                attackBonus: '+6',
                experience: 60001,
                abilities: []
            },
            {
                level: 8,
                hp: 'd10',
                attackBonus: '+7',
                experience: 120001,
                abilities: []
            },
            {
                level: 9,
                hp: 'd10',
                attackBonus: '+8',
                experience: 240001,
                abilities: []
            },
            {
                level: 10,
                hp: 'd10',
                attackBonus: '+9',
                experience: 450001,
                abilities: []
            },
            {
                level: 11,
                hp: '+4 PV',
                attackBonus: '+10',
                experience: 625001,
                abilities: []
            },
            {
                level: 12,
                hp: '+4 PV',
                attackBonus: '+11',
                experience: 800001,
                abilities: []
            }
        ]
    },
    {
        id: "cavaleiro",
        name: "Cavaleiro",
        hitDice: "1d10",
        disposition: "Leal e Bom",
        primaryAttribute: "Carisma",
        armas: 'qualquer, exceto as limitadas pelo Código de Conduta',
        armaduras: 'Qualquer',
        levels: [
            {
                level: 1,
                hp: 'd10',
                attackBonus: '+0',
                experience: 0,
                abilities: []
            },
            {
                level: 2,
                hp: 'd10',
                attackBonus: '+1',
                experience: 2251,
                abilities: []
            },
            {
                level: 3,
                hp: 'd10',
                attackBonus: '+2',
                experience: 4501,
                abilities: []
            },
            {
                level: 4,
                hp: 'd10',
                attackBonus: '+3',
                experience: 9001,
                abilities: []
            },
            {
                level: 5,
                hp: 'd10',
                attackBonus: '+4',
                experience: 18001,
                abilities: []
            },
            {
                level: 6,
                hp: 'd10',
                attackBonus: '+5',
                experience: 36001,
                abilities: []
            },
            {
                level: 7,
                hp: 'd10',
                attackBonus: '+6',
                experience: 72001,
                abilities: []
            },
            {
                level: 8,
                hp: 'd10',
                attackBonus: '+7',
                experience: 150001,
                abilities: []
            },
            {
                level: 9,
                hp: 'd10',
                attackBonus: '+8',
                experience: 300001,
                abilities: []
            },
            {
                level: 10,
                hp: 'd10',
                attackBonus: '+9',
                experience: 600001,
                abilities: []
            },
            {
                level: 11,
                hp: 'd10',
                attackBonus: '+10',
                experience: 725001,
                abilities: []
            },
            {
                level: 12,
                hp: 'd10',
                attackBonus: '+11',
                experience: 900001,
                abilities: []
            },
        ]
    },
    {
        id: "clerigo",
        name: "Clérigo",
        hitDice: "1d8",
        disposition: "Qualquer",
        primaryAttribute: "Sabedoria",
        armas: 'especial, clava, picareta de guerra, adaga, mangual leve ou pesado, martelo leve, maça leve ou pesada, maça-estrela, bordão, martelo de guerra',
        armaduras: 'Qualquer',
        levels: [
            {
                level: 1,
                hp: 'd8',
                attackBonus: '+0',
                experience: 0,
                abilities: [
                    {
                        id: 1,
                        name: "Usar Magia",
                        description: "a habilidade de conjurar feitiços divinos. Com uma sabedoria 13-15, um feitiço extra de 1º nível. Com sabedoria 16-17, um feitiço extra de 2º nível. Com sabedoria 18-19, um feitiço extra de 3º nível.",
                        check: "-"
                    },
                    {
                        id: 2,
                        name: "Afastar Mortos-Vivos",
                        description: "Afasta ou destrói monstros mortos-vivos.",
                        check: "SAB"
                    },
                ]
            },
            {
                level: 2,
                hp: 'd8',
                attackBonus: '+1',
                experience: 2251,
                abilities: []
            },
            {
                level: 3,
                hp: 'd8',
                attackBonus: '+1',
                experience: 5001,
                abilities: []
            },
            {
                level: 4,
                hp: 'd8',
                attackBonus: '+2',
                experience: 9001,
                abilities: []
            },
            {
                level: 5,
                hp: 'd8',
                attackBonus: '+2',
                experience: 18001,
                abilities: []
            },
            {
                level: 6,
                hp: 'd8',
                attackBonus: '+3',
                experience: 35001,
                abilities: []
            },
            {
                level: 7,
                hp: 'd8',
                attackBonus: '+3',
                experience: 70001,
                abilities: []
            },
            {
                level: 8,
                hp: 'd8',
                attackBonus: '+4',
                experience: 140001,
                abilities: []
            },
            {
                level: 9,
                hp: 'd8',
                attackBonus: '+4',
                experience: 300001,
                abilities: []
            },
            {
                level: 10,
                hp: 'd8',
                attackBonus: '+5',
                experience: 425001,
                abilities: []
            },
            {
                level: 11,
                hp: '+3 PV',
                attackBonus: '+5',
                experience: 650001,
                abilities: []
            },
            {
                level: 12,
                hp: '+3 PV',
                attackBonus: '+6',
                experience: 900001,
                abilities: []
            },
        ]
    },
    {
        id: "combatente",
        name: "Combatente",
        hitDice: "1d10",
        disposition: "Qualquer",
        primaryAttribute: "Força",
        armas: 'Qualquer',
        armaduras: 'Qualquer',
        levels: [
            {
                level: 1,
                hp: 'd10',
                attackBonus: '+1',
                experience: 0,
                abilities: [
                    {
                        id: 1,
                        name: "Especialização em Armas",
                        description: "escolha uma arma para se especializar. +1 para jogadas de ataque e dano com a arma escolhida",
                    },
                ]
            },
            {
                level: 2,
                hp: 'd10',
                attackBonus: '+2',
                experience: 2001,
                abilities: []
            },
            {
                level: 3,
                hp: 'd10',
                attackBonus: '+3',
                experience: 4001,
                abilities: []
            },
            {
                level: 4,
                hp: 'd10',
                attackBonus: '+4',
                experience: 8501,
                abilities: [
                    {
                        id: 1,
                        name: "Domínio de Combate",
                        description: "1 ataque extra contra monstros de nível 1 ou menos",
                    },
                ]
            },
            {
                level: 5,
                hp: 'd10',
                attackBonus: '+5',
                experience: 17001,
                abilities: []
            },
            {
                level: 6,
                hp: 'd10',
                attackBonus: '+6',
                experience: 34001,
                abilities: []
            },
            {
                level: 7,
                hp: 'd10',
                attackBonus: '+7',
                experience: 68001,
                abilities: [
                    {
                        id: 1,
                        name: "Especialização em Armas",
                        description: "os bônus aumentam para +2 nas jogadas de ataque e dano",
                    },
                ]
            },
            {
                level: 8,
                hp: 'd10',
                attackBonus: '+8',
                experience: 136001,
                abilities: [
                    {
                        id: 1,
                        name: "Domínio de Combate",
                        description: "2 ataques extra contra monstros de nível 1 ou menos",
                    },
                ]
            },
            {
                level: 9,
                hp: 'd10',
                attackBonus: '+9',
                experience: 272001,
                abilities: []
            },
            {
                level: 10,
                hp: 'd10',
                attackBonus: '+10',
                experience: 500001,
                abilities: [
                    {
                        id: 1,
                        name: "Ataque Extra",
                        description: "um ataque adicional por rodada de combate",
                    },
                ]
            },
            {
                level: 11,
                hp: 'd10',
                attackBonus: '+11',
                experience: 750001,
                abilities: []
            },
            {
                level: 12,
                hp: 'd10',
                attackBonus: '+12',
                experience: 1000001,
                abilities: [
                    {
                        id: 1,
                        name: "Domínio de Combate",
                        description: "3 ataques extra contra monstros de nível 1 ou menos",
                    },
                ]
            },
        ]
    },
    {
        id: "druida",
        name: "Druida",
        hitDice: "1d8",
        disposition: "Neutro + Qualquer",
        primaryAttribute: "Sabedoria",
        armas: 'arco, clava, adaga, dardo, machadinha, martelos, foices, funda, lanças, espada (todas), cajado',
        armaduras: 'couro cozido, laminar de couro, peles, couro, cota de couro, couro batido',
        levels: [
            {
                level: 1,
                hp: 'd8',
                attackBonus: '+0',
                experience: 0,
                abilities: []
            },
            {
                level: 2,
                hp: 'd8',
                attackBonus: '+1',
                experience: 2001,
                abilities: []
            },
            {
                level: 3,
                hp: 'd8',
                attackBonus: '+1',
                experience: 4251,
                abilities: []
            },
            {
                level: 4,
                hp: 'd8',
                attackBonus: '+2',
                experience: 8501,
                abilities: []
            },
            {
                level: 5,
                hp: 'd8',
                attackBonus: '+2',
                experience: 17001,
                abilities: []
            },
            {
                level: 6,
                hp: 'd8',
                attackBonus: '+3',
                experience: 35001,
                abilities: []
            },
            {
                level: 7,
                hp: 'd8',
                attackBonus: '+3',
                experience: 70001,
                abilities: []
            },
            {
                level: 8,
                hp: 'd8',
                attackBonus: '+4',
                experience: 180001,
                abilities: []
            },
            {
                level: 9,
                hp: 'd8',
                attackBonus: '+5',
                experience: 275001,
                abilities: []
            },
            {
                level: 10,
                hp: 'd8',
                attackBonus: '+5',
                experience: 400001,
                abilities: []
            },
            {
                level: 11,
                hp: 'd8',
                attackBonus: '+6',
                experience: 525001,
                abilities: []
            },
            {
                level: 12,
                hp: 'd8',
                attackBonus: '+6',
                experience: 650001,
                abilities: []
            },
        ]
    },
    {
        id: "explorador",
        name: "Explorador",
        hitDice: "1d10",
        disposition: "Qualquer",
        primaryAttribute: "Força",
        armas: 'Qualquer',
        armaduras: 'peitorais, cota de malha, camisa de malha, couro cozido, conjunto grego, couro, coifa de malha, jaqueta de couro, gibão de peles, cota de anéis, cota de escamas, couro batido',
        levels: [
            {
                level: 1,
                hp: 'd10',
                attackBonus: '+0',
                experience: 0,
                abilities: []
            },
            {
                level: 2,
                hp: 'd10',
                attackBonus: '+1',
                experience: 2251,
                abilities: []
            },
            {
                level: 3,
                hp: 'd10',
                attackBonus: '+2',
                experience: 4501,
                abilities: []
            },
            {
                level: 4,
                hp: 'd10',
                attackBonus: '+3',
                experience: 9001,
                abilities: []
            },
            {
                level: 5,
                hp: 'd10',
                attackBonus: '+4',
                experience: 18001,
                abilities: []
            },
            {
                level: 6,
                hp: 'd10',
                attackBonus: '+5',
                experience: 40001,
                abilities: []
            },
            {
                level: 7,
                hp: 'd10',
                attackBonus: '+6',
                experience: 75001,
                abilities: []
            },
            {
                level: 8,
                hp: 'd10',
                attackBonus: '+7',
                experience: 150001,
                abilities: []
            },
            {
                level: 9,
                hp: 'd10',
                attackBonus: '+8',
                experience: 250001,
                abilities: []
            },
            {
                level: 10,
                hp: 'd10',
                attackBonus: '+9',
                experience: 500001,
                abilities: []
            },
            {
                level: 11,
                hp: '+4 PV',
                attackBonus: '+10',
                experience: 725001,
                abilities: []
            },
            {
                level: 12,
                hp: '+4 PV',
                attackBonus: '+11',
                experience: 950001,
                abilities: []
            },
        ]
    },
    {
        id: "ilusionista",
        name: "Ilusionista",
        hitDice: "1d4",
        disposition: "Qualquer",
        primaryAttribute: "Inteligência",
        armas: 'clava, adaga, lança de mão, cajado',
        armaduras: 'Nenhuma',
        levels: [
            {
                level: 1,
                hp: 'd4',
                attackBonus: '+0',
                experience: 0,
                abilities: []
            },
            {
                level: 2,
                hp: 'd4',
                attackBonus: '+1',
                experience: 2601,
                abilities: []
            },
            {
                level: 3,
                hp: 'd4',
                attackBonus: '+1',
                experience: 5201,
                abilities: []
            },
            {
                level: 4,
                hp: 'd4',
                attackBonus: '+1',
                experience: 10401,
                abilities: []
            },
            {
                level: 5,
                hp: 'd4',
                attackBonus: '+1',
                experience: 20801,
                abilities: []
            },
            {
                level: 6,
                hp: 'd4',
                attackBonus: '+2',
                experience: 42501,
                abilities: []
            },
            {
                level: 7,
                hp: 'd4',
                attackBonus: '+2',
                experience: 85001,
                abilities: []
            },
            {
                level: 8,
                hp: 'd4',
                attackBonus: '+2',
                experience: 170001,
                abilities: []
            },
            {
                level: 9,
                hp: 'd4',
                attackBonus: '+2',
                experience: 340001,
                abilities: []
            },
            {
                level: 10,
                hp: 'd4',
                attackBonus: '+3',
                experience: 500001,
                abilities: []
            },
            {
                level: 11,
                hp: '+1 PV',
                attackBonus: '+3',
                experience: 750001,
                abilities: []
            },
            {
                level: 12,
                hp: '+1 PV',
                attackBonus: '+3',
                experience: 900001,
                abilities: []
            },
        ]
    },
    {
        id: "lutador",
        name: "Lutador",
        hitDice: "1d12",
        disposition: "Qualquer",
        primaryAttribute: "Constituição",
        armas: 'aclis, zarabatana, bola, arcos, soco inglês, gato de nove caudas, cestus, cutelo, clava, adaga, lança de mão, punhal, falcione, gancho com cabo, machado de mão, machadinha, espada-gancho, azagaia, punhal katar, faca, mangual leve, maça leve, espada larga de nove anéis, armas de haste, pedra, porrete, foice, cimitarra, foice longa, funda, lança, manopla com espinhos, cajado, chicote',
        armaduras: 'Qualquer',
        levels: [],
    },
    {
        id: "mago",
        name: "Mago",
        hitDice: "1d4",
        disposition: "Qualquer",
        primaryAttribute: "Inteligência",
        armas: 'clava, adaga, dardo, cajado',
        armaduras: 'Nenhuma',
        levels: [
            {
                level: 1,
                hp: 'd4',
                attackBonus: '+0',
                experience: 0,
                abilities: [
                    {
                        id: 1,
                        name: "Conjuração",
                        description: "a habilidade de conjurar feitiços arcanos. Com um valor de inteligência 13-15 recebe um feitiço adicional de primeiro nível. Com uma inteligência 16-17, recebe um feitiço extra de segundo nível. Com uma inteligência 18-19, um feitiço extra de terceiro nível",
                    },
                ]
            },
            {
                level: 2,
                hp: 'd4',
                attackBonus: '+1',
                experience: 2601,
                abilities: []
            },
            {
                level: 3,
                hp: 'd4',
                attackBonus: '+1',
                experience: 5201,
                abilities: []
            },
            {
                level: 4,
                hp: 'd4',
                attackBonus: '+1',
                experience: 10401,
                abilities: []
            },
            {
                level: 5,
                hp: 'd4',
                attackBonus: '+1',
                experience: 20801,
                abilities: []
            },
            {
                level: 6,
                hp: 'd4',
                attackBonus: '+2',
                experience: 42501,
                abilities: []
            },
            {
                level: 7,
                hp: 'd4',
                attackBonus: '+2',
                experience: 85001,
                abilities: []
            },
            {
                level: 8,
                hp: 'd4',
                attackBonus: '+2',
                experience: 170001,
                abilities: []
            },
            {
                level: 9,
                hp: 'd4',
                attackBonus: '+2',
                experience: 340001,
                abilities: []
            },
            {
                level: 10,
                hp: 'd4',
                attackBonus: '+3',
                experience: 500001,
                abilities: []
            },
            {
                level: 11,
                hp: '+1 PV',
                attackBonus: '+3',
                experience: 750001,
                abilities: []
            },
            {
                level: 12,
                hp: '+1 PV',
                attackBonus: '+3',
                experience: 1000001,
                abilities: []
            },
        ]
    },
    {
        id: "paladino",
        name: "Paladino",
        hitDice: "1d10",
        disposition: "Lei/Bem ou Bem/Lei",
        primaryAttribute: "Carisma",
        armas: 'Qualquer',
        armaduras: 'Qualquer',
        levels: [
            {
                level: 1,
                hp: 'd10',
                attackBonus: '+0',
                experience: 0,
                abilities: []
            },
            {
                level: 2,
                hp: 'd10',
                attackBonus: '+1',
                experience: 2701,
                abilities: []
            },
            {
                level: 3,
                hp: 'd10',
                attackBonus: '+2',
                experience: 5501,
                abilities: []
            },
            {
                level: 4,
                hp: 'd10',
                attackBonus: '+3',
                experience: 12001,
                abilities: []
            },
            {
                level: 5,
                hp: 'd10',
                attackBonus: '+4',
                experience: 24001,
                abilities: []
            },
            {
                level: 6,
                hp: 'd10',
                attackBonus: '+5',
                experience: 48001,
                abilities: []
            },
            {
                level: 7,
                hp: 'd10',
                attackBonus: '+6',
                experience: 95001,
                abilities: []
            },
            {
                level: 8,
                hp: 'd10',
                attackBonus: '+7',
                experience: 180001,
                abilities: []
            },
            {
                level: 9,
                hp: 'd10',
                attackBonus: '+8',
                experience: 360001,
                abilities: []
            },
            {
                level: 10,
                hp: 'd10',
                attackBonus: '+9',
                experience: 700001,
                abilities: []
            },
            {
                level: 11,
                hp: '+4 PV',
                attackBonus: '+10',
                experience: 1000001,
                abilities: []
            },
            {
                level: 12,
                hp: '+4 PV',
                attackBonus: '+11',
                experience: 1300001,
                abilities: []
            },
        ]
    },
    {
        id: "trapaceiro",
        name: "Trapaceiro",
        hitDice: "1d6",
        disposition: "Qualquer",
        primaryAttribute: "Destreza",
        armas: 'zarabatana, espada larga, gato de nove caudas, cestus, clava, adaga, lança de mão, martelo, machadin- ha, besta de mão, azagaia, faca, besta leve, espada longa, maça, main gauche, bastão, paieira, porrete, arco curto, espada curta, foice curta, manopla com cravos, funda, chicote, sodegarami',
        armaduras: 'couro, jaqueta de couro e gibão de peles',
        levels: [
            {
                level: 1,
                hp: 'd6',
                attackBonus: '+0',
                experience: 0,
                abilities: [
                    {
                        id: 1,
                        name: "Especial",
                        description: "pode usar couro, jaqueta de couro e gibão de peles sem penalidades",
                    },
                    {
                        id: 2,
                        name: "Ataque pelas costas",
                        description: "recebe um bônus de +4 para acertar e causa dano dobrado, após um teste bem-sucedido de mover-se em silêncio ou esconder-se",
                    },
                    {
                        id: 3,
                        name: "A Gíria",
                        description: "fala através de palavras codificadas e gestos",
                    },
                    {
                        id: 4,
                        name: "Escalar",
                        description: "escala qualquer superfície",
                        check: "DES"
                    },
                    {
                        id: 5,
                        name: "Decifrar Escrita",
                        description: "decifra escritos/linguagens/códigos",
                        check: "INT"
                    },
                    {
                        id: 6,
                        name: "Esconder-se",
                        description: "pode se esconder em sombras e locais ocultos",
                        check: "DES"
                    },
                    {
                        id: 7,
                        name: "Ouvir",
                        description: "ouve ruídos a até 9m (10ft)",
                        check: "SAB"
                    },
                    {
                        id: 8,
                        name: "Passos Leves",
                        description: "se desloca silenciosamente em ambientes fechados e abertos",
                        check: "DES"
                    },
                    {
                        id: 9,
                        name: "Abrir fechaduras",
                        description: "destranca fechaduras mecânicas",
                        check: "DES"
                    },
                    {
                        id: 10,
                        name: "Furtar Bolsos",
                        description: "remove o conteúdo de bolsos ou bolsas, faz truques de prestidigitação",
                        check: "DES"
                    },
                    {
                        id: 11,
                        name: "Encontrar/Desarmar Armadilhas",
                        description: "encontra, desarma ou ativa uma armadilha",
                        check: "INT"
                    },
                ]
            },
            {
                level: 2,
                hp: 'd6',
                attackBonus: '+1',
                experience: 1251,
                abilities: []
            },
            {
                level: 3,
                hp: 'd6',
                attackBonus: '+1',
                experience: 2501,
                abilities: [
                    {
                        id: 1,
                        name: "Esconder-se",
                        description: "pode se esconder em sombras e locais ocultos. Testes -5",
                        check: "DES"
                    },
                ]
            },
            {
                level: 4,
                hp: 'd6',
                attackBonus: '+1',
                experience: 6001,
                abilities: [
                    {
                        id: 1,
                        name: "Ataque furtivo",
                        description: "recebe +2 para acertar e +4 para o dano contra um alvo desprevenido",
                    },
                ]
            },
            {
                level: 5,
                hp: 'd6',
                attackBonus: '+2',
                experience: 12001,
                abilities: [
                    {
                        id: 1,
                        name: "Ataque pelas costas",
                        description: "recebe um bônus de +4 para acertar e causa dano triplicado, após um teste bem-sucedido de mover-se em silêncio ou esconder-se",
                    },
                ]
            },
            {
                level: 6,
                hp: 'd6',
                attackBonus: '+2',
                experience: 24001,
                abilities: []
            },
            {
                level: 7,
                hp: 'd6',
                attackBonus: '+2',
                experience: 48001,
                abilities: []
            },
            {
                level: 8,
                hp: 'd6',
                attackBonus: '+3',
                experience: 80001,
                abilities: []
            },
            {
                level: 9,
                hp: 'd6',
                attackBonus: '+3',
                experience: 120001,
                abilities: [
                     {
                        id: 1,
                        name: "Ataque pelas costas",
                        description: "recebe um bônus de +4 para acertar e causa dano quadruplicado, após um teste bem-sucedido de mover-se em silêncio ou esconder-se",
                    },
                ]
            },
            {
                level: 10,
                hp: 'd6',
                attackBonus: '+3',
                experience: 175001,
                abilities: []
            },
            {
                level: 11,
                hp: '+2 PV',
                attackBonus: '+4',
                experience: 325001,
                abilities: []
            },
            {
                level: 12,
                hp: '+2 PV',
                attackBonus: '+4',
                experience: 450001,
                abilities: []
            },
        ]
    },
    {
        id: "Assassino",
        name: "Assassino",
        hitDice: "1d6",
        disposition: "Qualquer uma não boa",
        primaryAttribute: "Destreza",
        armas: 'Qualquer',
        armaduras: 'couro, jaqueta de couro e armadura acolchoada',
        levels: [
            {
                level: 1,
                hp: 'd6',
                attackBonus: '+0',
                experience: 0,
                abilities: []
            },
            {
                level: 2,
                hp: 'd6',
                attackBonus: '+1',
                experience: 1751,
                abilities: []
            },
            {
                level: 3,
                hp: 'd6',
                attackBonus: '+1',
                experience: 3501,
                abilities: []
            },
            {
                level: 4,
                hp: 'd6',
                attackBonus: '+1',
                experience: 7001,
                abilities: []
            },
            {
                level: 5,
                hp: 'd6',
                attackBonus: '+2',
                experience: 14001,
                abilities: []
            },
            {
                level: 6,
                hp: 'd6',
                attackBonus: '+2',
                experience: 25001,
                abilities: []
            },
            {
                level: 7,
                hp: 'd6',
                attackBonus: '+2',
                experience: 50001,
                abilities: []
            },
            {
                level: 8,
                hp: 'd6',
                attackBonus: '+3',
                experience: 90001,
                abilities: []
            },
            {
                level: 9,
                hp: 'd6',
                attackBonus: '+3',
                experience: 150001,
                abilities: []
            },
            {
                level: 10,
                hp: 'd6',
                attackBonus: '+3',
                experience: 200001,
                abilities: []
            },
            {
                level: 11,
                hp: '+2 PV',
                attackBonus: '+4',
                experience: 350001,
                abilities: []
            },
            {
                level: 12,
                hp: '+2 PV',
                attackBonus: '+4',
                experience: 500001,
                abilities: []
            },
        ]
    }
]