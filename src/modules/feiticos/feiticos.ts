export interface Spell {
    id: string;
    name: string;
    level: number; // 0 a 9
    shortDescription: string;
    completeDescription: string;
    type: 'mago' | 'clerigo' | 'druida';
}

export const spells: Spell[] = [
    // Exemplo de estrutura - preencha com suas magias
    {
        id: "spell-1",
        name: "Detectar Magia",
        level: 1,
        shortDescription: "Detecta objetos mágicos em um raio de 18 metros",
        completeDescription: "O conjurador pode detectar objetos encantados, personagens ou criaturas enfeitiçadas em um raio de 18 metros. Apontando o objeto, o conjurador saberá que tipo de magia está presente. A magia dura 2 rodadas.",
        type: "mago"
    },
    {
        id: "spell-2",
        name: "Curar Ferimentos Leves",
        level: 1,
        shortDescription: "Cura 1d6+1 pontos de vida",
        completeDescription: "Ao tocar um personagem ou criatura, o clérigo pode curar 1d6+1 pontos de vida. Esta magia não pode ser usada para curar criaturas mortas-vivas. A magia requer concentração e dura instantaneamente.",
        type: "clerigo"
    },
    {
        id: "spell-3",
        name: "Falar com Animais",
        level: 1,
        shortDescription: "Permite comunicação com animais naturais",
        completeDescription: "O druida pode falar e compreender animais naturais por 1 turno. Os animais não se tornam mais amigáveis ou cooperativos do que o normal, mas podem prestar informações sobre o que viram ou ouviram recentemente.",
        type: "druida"
    }
];