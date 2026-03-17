// Dados do jogo baseados no HTML original

export interface CharacterAttributes {
    forca: number;
    inteligencia: number;
    sabedoria: number;
    destreza: number;
    constituicao: number;
    carisma: number;
}

// Bônus raciais para cada raça
export const racialBonuses: Record<string, Partial<CharacterAttributes>> = {
    'humano': {
        forca: 0,
        inteligencia: 0,
        sabedoria: 0,
        destreza: 0,
        constituicao: 0,
        carisma: 0
    },
    'elfo': {
        forca: 0,
        inteligencia: 0,
        sabedoria: 0,
        destreza: 1,
        constituicao: -1,
        carisma: 0
    },
    'anao': {
        forca: 0,
        inteligencia: 0,
        sabedoria: 0,
        destreza: -1,
        constituicao: 1,
        carisma: 0
    },
    'pequenino': {
        forca: -1,
        inteligencia: 0,
        sabedoria: 0,
        destreza: 1,
        constituicao: 0,
        carisma: 0
    },
    'gnomo': {
        forca: -1,
        inteligencia: 1,
        sabedoria: 0,
        destreza: 0,
        constituicao: 0,
        carisma: 0
    },
    'meio-elfo-humano': {
        forca: 0,
        inteligencia: 0,
        sabedoria: 0,
        destreza: 0,
        constituicao: 0,
        carisma: 0
    },
    'meio-elfo-elfo': {
        forca: 0,
        inteligencia: 0,
        sabedoria: 0,
        destreza: 1,
        constituicao: -1,
        carisma: 0
    },
    'meio-orc': {
        forca: 1,
        inteligencia: 0,
        sabedoria: 0,
        destreza: 0,
        constituicao: 1,
        carisma: -2
    }
};

// Faixas etárias
export type AgeCategory = 'Adolescente' | 'Jovem' | 'Adulto' | 'Meia-idade' | 'Idoso';

// Ranges de d12 para cada classe (mapeamento de resultado do d12 para a categoria)
export const ageRangesByClass: Record<string, (roll: number) => AgeCategory> = {
    'barbaro': (roll: number) => {
        if (roll <= 4) return 'Adolescente';
        if (roll <= 8) return 'Jovem';
        if (roll <= 10) return 'Adulto';
        if (roll === 11) return 'Meia-idade';
        return 'Idoso';
    },
    'bardo': (roll: number) => {
        if (roll === 1) return 'Adolescente';
        if (roll <= 5) return 'Jovem';
        if (roll <= 10) return 'Adulto';
        if (roll === 11) return 'Meia-idade';
        return 'Idoso';
    },
    'cavaleiro': (roll: number) => {
        if (roll === 1) return 'Adolescente';
        if (roll <= 5) return 'Jovem';
        if (roll <= 10) return 'Adulto';
        if (roll === 11) return 'Meia-idade';
        return 'Idoso';
    },
    'clerigo': (roll: number) => {
        if (roll === 1) return 'Adolescente';
        if (roll <= 3) return 'Jovem';
        if (roll <= 7) return 'Adulto';
        if (roll <= 10) return 'Meia-idade';
        return 'Idoso';
    },
    'combatente': (roll: number) => {
        if (roll <= 3) return 'Adolescente';
        if (roll <= 7) return 'Jovem';
        if (roll <= 10) return 'Adulto';
        if (roll === 11) return 'Meia-idade';
        return 'Idoso';
    },
    'druida': (roll: number) => {
        if (roll === 1) return 'Adolescente';
        if (roll === 2) return 'Jovem';
        if (roll <= 6) return 'Adulto';
        if (roll <= 10) return 'Meia-idade';
        return 'Idoso';
    },
    'explorador': (roll: number) => {
        if (roll === 1) return 'Adolescente';
        if (roll <= 5) return 'Jovem';
        if (roll <= 10) return 'Adulto';
        if (roll === 11) return 'Meia-idade';
        return 'Idoso';
    },
    'ilusionista': (roll: number) => {
        if (roll === 1) return 'Adolescente';
        if (roll === 2) return 'Jovem';
        if (roll <= 5) return 'Adulto';
        if (roll <= 9) return 'Meia-idade';
        return 'Idoso';
    },
    'lutador': (roll: number) => {
        if (roll === 1) return 'Adolescente';
        if (roll <= 5) return 'Jovem';
        if (roll <= 10) return 'Adulto';
        if (roll === 11) return 'Meia-idade';
        return 'Idoso';
    },
    'mago': (roll: number) => {
        if (roll === 1) return 'Adolescente';
        if (roll === 2) return 'Jovem';
        if (roll <= 5) return 'Adulto';
        if (roll <= 9) return 'Meia-idade';
        return 'Idoso';
    },
    'paladino': (roll: number) => {
        if (roll <= 3) return 'Adolescente';
        if (roll <= 7) return 'Jovem';
        if (roll <= 10) return 'Adulto';
        if (roll === 11) return 'Meia-idade';
        return 'Idoso';
    },
    'trapaceiro': (roll: number) => {
        if (roll <= 4) return 'Adolescente';
        if (roll <= 8) return 'Jovem';
        if (roll <= 10) return 'Adulto';
        if (roll === 11) return 'Meia-idade';
        return 'Idoso';
    },
    'assassino': (roll: number) => {
        if (roll <= 4) return 'Adolescente';
        if (roll <= 8) return 'Jovem';
        if (roll <= 10) return 'Adulto';
        if (roll === 11) return 'Meia-idade';
        return 'Idoso';
    }
};

// Função para gerar faixa etária
export function generateAgeCategory(characterClass: string): AgeCategory {
    const ageFunction = ageRangesByClass[characterClass];
    if (!ageFunction) {
        // Fallback para classe não encontrada (usar combatente)
        return ageRangesByClass['combatente'](Math.floor(Math.random() * 12) + 1);
    }

    const roll = Math.floor(Math.random() * 12) + 1; // 1d12
    return ageFunction(roll);
}

// Faixas de altura
export type HeightCategory = 'muito baixo' | 'baixo' | 'médio' | 'alto' | 'muito alto';

// Ranges de d12 para cada raça (mapeamento de resultado do d12 para a categoria de altura)
export const heightRangesByRace: Record<string, (roll: number) => HeightCategory | null> = {
    'elfo': (roll: number) => {
        if (roll === 1) return 'muito baixo';
        if (roll <= 6) return 'baixo';
        if (roll <= 10) return 'médio';
        if (roll === 11) return 'alto';
        return 'muito alto';
    },
    'anao': (roll: number) => {
        if (roll <= 4) return 'muito baixo';
        if (roll <= 11) return 'baixo';
        return 'médio';
    },
    'humano': (roll: number) => {
        if (roll === 1) return 'muito baixo';
        if (roll <= 4) return 'baixo';
        if (roll <= 8) return 'médio';
        if (roll <= 11) return 'alto';
        return 'muito alto';
    },
    'pequenino': (roll: number) => {
        if (roll <= 7) return 'muito baixo';
        return 'baixo';
    },
    'gnomo': (roll: number) => {
        if (roll <= 7) return 'muito baixo';
        return 'baixo';
    },
    'meio-elfo': (roll: number) => {
        if (roll === 1) return 'muito baixo';
        if (roll <= 4) return 'baixo';
        if (roll <= 9) return 'médio';
        if (roll <= 11) return 'alto';
        return 'muito alto';
    },
    'meio-elfo-humano': (roll: number) => {
        if (roll === 1) return 'muito baixo';
        if (roll <= 4) return 'baixo';
        if (roll <= 9) return 'médio';
        if (roll <= 11) return 'alto';
        return 'muito alto';
    },
    'meio-elfo-elfo': (roll: number) => {
        if (roll === 1) return 'muito baixo';
        if (roll <= 4) return 'baixo';
        if (roll <= 9) return 'médio';
        if (roll <= 11) return 'alto';
        return 'muito alto';
    },
    'meio-orc': (roll: number) => {
        if (roll === 1) return 'muito baixo';
        if (roll === 2) return 'baixo';
        if (roll <= 5) return 'médio';
        if (roll <= 9) return 'alto';
        return 'muito alto';
    }
};

// Função para gerar categoria de altura
export function generateHeightCategory(race: string): HeightCategory {
    const heightFunction = heightRangesByRace[race];
    if (!heightFunction) {
        // Fallback para raça não encontrada (usar humano)
        const roll = Math.floor(Math.random() * 12) + 1; // 1d12
        return heightRangesByRace['humano'](roll) || 'médio';
    }

    const roll = Math.floor(Math.random() * 12) + 1; // 1d12
    return heightFunction(roll) || 'médio';
}

// Faixas de peso
export type WeightCategory = 'magro' | 'em forma' | 'robusto' | 'gordo';

// Ranges de d12 para cada raça (mapeamento de resultado do d12 para a categoria de peso)
export const weightRangesByRace: Record<string, (roll: number) => WeightCategory | null> = {
    'elfo': (roll: number) => {
        if (roll <= 7) return 'magro';
        if (roll <= 11) return 'em forma';
        return 'robusto';
    },
    'anao': (roll: number) => {
        if (roll <= 3) return 'em forma';
        if (roll <= 8) return 'robusto';
        return 'gordo';
    },
    'humano': (roll: number) => {
        if (roll <= 3) return 'magro';
        if (roll <= 7) return 'em forma';
        if (roll <= 11) return 'robusto';
        return 'gordo';
    },
    'pequenino': (roll: number) => {
        if (roll <= 2) return 'magro';
        if (roll <= 5) return 'em forma';
        if (roll <= 9) return 'robusto';
        return 'gordo';
    },
    'gnomo': (roll: number) => {
        if (roll <= 7) return 'magro';
        if (roll <= 10) return 'em forma';
        if (roll === 11) return 'robusto';
        return 'gordo';
    },
    'meio-elfo': (roll: number) => {
        if (roll <= 4) return 'magro';
        if (roll <= 9) return 'em forma';
        if (roll <= 11) return 'robusto';
        return 'gordo';
    },
    'meio-elfo-humano': (roll: number) => {
        if (roll <= 4) return 'magro';
        if (roll <= 9) return 'em forma';
        if (roll <= 11) return 'robusto';
        return 'gordo';
    },
    'meio-elfo-elfo': (roll: number) => {
        if (roll <= 4) return 'magro';
        if (roll <= 9) return 'em forma';
        if (roll <= 11) return 'robusto';
        return 'gordo';
    },
    'meio-orc': (roll: number) => {
        if (roll <= 3) return 'magro';
        if (roll <= 7) return 'em forma';
        if (roll <= 11) return 'robusto';
        return 'gordo';
    }
};

// Função para gerar categoria de peso
export function generateWeightCategory(race: string): WeightCategory {
    const weightFunction = weightRangesByRace[race];
    if (!weightFunction) {
        // Fallback para raça não encontrada (usar humano)
        const roll = Math.floor(Math.random() * 12) + 1; // 1d12
        return weightRangesByRace['humano'](roll) || 'em forma';
    }

    const roll = Math.floor(Math.random() * 12) + 1; // 1d12
    return weightFunction(roll) || 'em forma';
}

// Lista de traços marcantes
export const distinctiveTraits = [
    'Peludo',
    'Sem pelos',
    'Tatuado',
    'Cicatriz aparente',
    'Múltiplas cicatrizes',
    'Marcas de espinha',
    'Muitos sinais',
    'Sardas',
    'Sinal no rosto',
    'Marca de nascença',
    'Vitiligo',
    'Pele muito lisa',
    'Pele rachada/ressecada',
    'Pele avermelhada constante',
    'Veias muito aparentes',
    'Queimadura visível',
    'Pele com brilho incomum',
    'Olhos animalescos',
    'Cor de olho incomum',
    'Heterocromia',
    'Olhos tristes',
    'Olhos cansados',
    'Olhos alegres',
    'Olhos atormentados',
    'Olhos grandes',
    'Olhos pequenos',
    'Olhos fundos',
    'Olhos saltados',
    'Olhar intenso',
    'Olhar distante',
    'Olhos semicerrados',
    'Tremor no olhar',
    'Olheiras profundas',
    'Um olho cego',
    'Pisca excessivamente',
    'Pouco cabelo',
    'Careca',
    'Cor de cabelo incomum',
    'Duas cores de cabelo',
    'Cabelo muito longo',
    'Cabelo extremamente curto',
    'Cabelo sempre bagunçado',
    'Cabelo perfeitamente arrumado',
    'Cabelo oleoso',
    'Cabelo ressecado',
    'Cabelo cacheado extremo',
    'Cabelo liso extremo',
    'Sobrancelha grossa',
    'Monocelha',
    'Sobrancelhas finíssimas',
    'Sem Sobrancelhas',
    'Falhas no cabelo',
    'Dentes tronchos',
    'Dentes proeminentes',
    'Banguela',
    'Dentes muito brancos',
    'Dentes escurecidos',
    'Nariz distinto',
    'Nariz torto',
    'Nariz grande',
    'Nariz pequeno',
    'Orelha grande',
    'Orelha pequena',
    'Orelha rasgada',
    'Boca grande',
    'Boca pequena',
    'Testa grande',
    'Bochecha grande',
    'Queixo pontudo',
    'Queixo retraído',
    'Mandíbula muito marcada',
    'Membros longos demais',
    'Membros curtos',
    'Postura torta',
    'Postura rígida',
    'Anda mancando',
    'Ombros caídos',
    'Dedo faltando',
    'Dedo extra',
    'Tremor nas mãos',
    'Cicatriz ritualística',
    'Cheiro marcante',
    'Voz rouca',
    'Voz muito suave',
    'Risada estranha'
] as const;

// Função para gerar traço marcante aleatório
export function generateDistinctiveTrait(): string {
    const randomIndex = Math.floor(Math.random() * distinctiveTraits.length);
    return distinctiveTraits[randomIndex];
}

// Fórmulas de pontos de vida por classe
export const hpFormula: Record<string, string> = {
    'assassino': '1d6',
    'barbaro': '1d12',
    'bardo': '1d10',
    'cavaleiro': '1d10',
    'clerigo': '1d8',
    'combatente': '1d10',
    'druida': '1d8',
    'explorador': '1d10',
    'ilusionista': '1d4',
    'lutador': '1d12',
    'mago': '1d4',
    'paladino': '1d10',
    'trapaceiro': '1d6'
};

// Fórmulas de tesouro inicial por classe
export const treasureFormula: Record<string, string> = {
    'assassino': '3d4',
    'barbaro': '2d4',
    'bardo': '3d4',
    'cavaleiro': '6d4',
    'clerigo': '2d10',
    'combatente': '3d8',
    'druida': '2d10',
    'explorador': '3d8',
    'ilusionista': '1d10',
    'lutador': '2d4',
    'mago': '1d10',
    'paladino': '6d4',
    'trapaceiro': '3d4'
};

// Atributos prime por classe
export const primeAttributes: Record<string, string[]> = {
    'assassino': ['destreza'],
    'barbaro': ['constituicao'],
    'bardo': ['carisma'],
    'cavaleiro': ['carisma'],
    'clerigo': ['sabedoria'],
    'combatente': ['forca'],
    'druida': ['sabedoria'],
    'explorador': ['forca'],
    'ilusionista': ['inteligencia'],
    'lutador': ['constituicao'],
    'mago': ['inteligencia'],
    'paladino': ['carisma'],
    'trapaceiro': ['destreza']
};

// Função para normalizar nome da classe para busca nos dados
export function normalizeClassName(className: string): string {
    return className
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .trim();
}

// Função para calcular modificador de atributo
export function calculateModifier(score: number): number {
    switch (score) {
        case 3: return -3;
        case 4:
        case 5: return -2;
        case 6:
        case 7:
        case 8: return -1;
        case 9:
        case 10:
        case 11:
        case 12: return 0;
        case 13:
        case 14:
        case 15: return 1;
        case 16:
        case 17: return 2;
        case 18: return 3;
        default: return 0;
    }
}

// Tabelas de altura e peso por raça e gênero (do HTML original)
const heightWeightTables = {
    'humano': {
        'Masculino': {
            '10': {
                description: 'pequeno',
                ft: '5',
                in: '1d4+1',
                lbs: '1d20 + 105'
            },
            '30': {
                description: 'magro',
                ft: '5',
                in: '1d4+5',
                lbs: '1d20 + 115'
            },
            '70': {
                description: 'normal',
                ft: '5',
                in: '1d4+6',
                lbs: '1d20 + 125'
            },
            '80': {
                description: 'robusto',
                ft: '5',
                in: '1d4+6',
                lbs: '1d20 + 135'
            },
            '95': {
                description: 'grande',
                ft: '5',
                in: '1d4+10',
                lbs: '1d20 + 135'
            },
            '00': {
                description: 'descomunal',
                ft: '6',
                in: '1d4+1',
                lbs: '1d20 + 145'
            }
        },
        'Feminino': {
            '15': {
                description: 'pequena',
                ft: '4',
                in: '1d4+9',
                lbs: '1d20 + 80'
            },
            '30': {
                description: 'esbelta',
                ft: '5',
                in: '1d4+1',
                lbs: '1d20 + 90'
            },
            '65': {
                description: 'normal',
                ft: '5',
                in: '1d4+2',
                lbs: '1d20 + 100'
            },
            '85': {
                description: 'gordinha',
                ft: '5',
                in: '1d4+2',
                lbs: '1d20 + 110'
            },
            '95': {
                description: 'grande',
                ft: '5',
                in: '1d4+6',
                lbs: '1d20 + 110'
            },
            '00': {
                description: 'descomunal',
                ft: '5',
                in: '1d4+9',
                lbs: '1d20 + 120'
            }
        }
    },
    'anao': {
        'Masculino': {
            '10': {
                description: 'pequeno',
                ft: '3',
                in: '1d4+9',
                lbs: '1d20 + 130'
            },
            '25': {
                description: 'magro',
                ft: '4',
                in: '1d4+1',
                lbs: '1d20 + 140'
            },
            '55': {
                description: 'normal',
                ft: '4',
                in: '1d4+2',
                lbs: '1d20 + 150'
            },
            '85': {
                description: 'robusto',
                ft: '4',
                in: '1d4+2',
                lbs: '1d20 + 160'
            },
            '95': {
                description: 'grande',
                ft: '4',
                in: '1d4+6',
                lbs: '1d20 + 160'
            },
            '00': {
                description: 'descomunal',
                ft: '4',
                in: '1d4+9',
                lbs: '1d20 + 170'
            }
        },
        'Feminino': {
            '15': {
                description: 'pequena',
                ft: '3',
                in: '1d4+7',
                lbs: '1d20 + 100'
            },
            '30': {
                description: 'esbelta',
                ft: '3',
                in: '1d4+11',
                lbs: '1d20 + 110'
            },
            '65': {
                description: 'normal',
                ft: '4',
                in: '1d4',
                lbs: '1d20 + 120'
            },
            '85': {
                description: 'gordinha',
                ft: '4',
                in: '1d4',
                lbs: '1d20 + 130'
            },
            '95': {
                description: 'grande',
                ft: '4',
                in: '1d4+4',
                lbs: '1d20 + 130'
            },
            '00': {
                description: 'descomunal',
                ft: '4',
                in: '1d4+7',
                lbs: '1d20 + 140'
            }
        }
    },
    'elfo': {
        'Masculino': {
            '15': {
                description: 'pequeno',
                ft: '4',
                in: '1d4+7',
                lbs: '1d20 + 70'
            },
            '45': {
                description: 'magro',
                ft: '4',
                in: '1d4+11',
                lbs: '1d20 + 80'
            },
            '75': {
                description: 'normal',
                ft: '5',
                in: '1d4',
                lbs: '1d20 + 90'
            },
            '80': {
                description: 'robusto',
                ft: '5',
                in: '1d4',
                lbs: '1d20 + 95'
            },
            '95': {
                description: 'grande',
                ft: '5',
                in: '1d4+4',
                lbs: '1d20 + 95'
            },
            '00': {
                description: 'descomunal',
                ft: '5',
                in: '1d4+7',
                lbs: '1d20 + 100'
            }
        },
        'Feminino': {
            '15': {
                description: 'pequena',
                ft: '4',
                in: '1d4+3',
                lbs: '1d20 + 64'
            },
            '45': {
                description: 'esbelta',
                ft: '4',
                in: '1d4+7',
                lbs: '1d20 + 72'
            },
            '75': {
                description: 'normal',
                ft: '4',
                in: '1d4+8',
                lbs: '1d20 + 80'
            },
            '80': {
                description: 'gordinha',
                ft: '4',
                in: '1d4+8',
                lbs: '1d20 + 85'
            },
            '95': {
                description: 'grande',
                ft: '5',
                in: '1d4',
                lbs: '1d20 + 85'
            },
            '00': {
                description: 'descomunal',
                ft: '5',
                in: '1d4+3',
                lbs: '1d20 + 90'
            }
        }
    },
    'gnomo': {
        'Masculino': {
            '10': {
                description: 'pequeno',
                ft: '2',
                in: '1d3+10',
                lbs: '1d20 + 50'
            },
            '25': {
                description: 'magro',
                ft: '3',
                in: '1d3+1',
                lbs: '1d20 + 55'
            },
            '55': {
                description: 'normal',
                ft: '3',
                in: '1d3+2',
                lbs: '1d20 + 60'
            },
            '85': {
                description: 'robusto',
                ft: '3',
                in: '1d3+2',
                lbs: '1d20 + 65'
            },
            '95': {
                description: 'grande',
                ft: '3',
                in: '1d3+5',
                lbs: '1d20 + 65'
            },
            '00': {
                description: 'descomunal',
                ft: '3',
                in: '1d3+7',
                lbs: '1d20 + 70'
            }
        },
        'Feminino': {
            '15': {
                description: 'pequena',
                ft: '2',
                in: '1d3+8',
                lbs: '1d20 + 42'
            },
            '30': {
                description: 'esbelta',
                ft: '2',
                in: '1d3+11',
                lbs: '1d20 + 45'
            },
            '65': {
                description: 'normal',
                ft: '3',
                in: '1d3',
                lbs: '1d20 + 50'
            },
            '85': {
                description: 'gordinha',
                ft: '3',
                in: '1d3',
                lbs: '1d20 + 55'
            },
            '95': {
                description: 'grande',
                ft: '3',
                in: '1d3+3',
                lbs: '1d20 + 55'
            },
            '00': {
                description: 'descomunal',
                ft: '3',
                in: '1d3+5',
                lbs: '1d20 + 60'
            }
        }
    },
    'pequenino': {
        'Masculino': {
            '10': {
                description: 'pequeno',
                ft: '2',
                in: '1d3+10',
                lbs: '1d20 + 50'
            },
            '25': {
                description: 'magro',
                ft: '3',
                in: '1d3+1',
                lbs: '1d20 + 55'
            },
            '55': {
                description: 'normal',
                ft: '3',
                in: '1d3+2',
                lbs: '1d20 + 60'
            },
            '85': {
                description: 'robusto',
                ft: '3',
                in: '1d3+2',
                lbs: '1d20 + 65'
            },
            '95': {
                description: 'grande',
                ft: '3',
                in: '1d3+5',
                lbs: '1d20 + 65'
            },
            '00': {
                description: 'descomunal',
                ft: '3',
                in: '1d3+7',
                lbs: '1d20 + 70'
            }
        },
        'Feminino': {
            '15': {
                description: 'pequena',
                ft: '2',
                in: '1d3+8',
                lbs: '1d20 + 42'
            },
            '30': {
                description: 'esbelta',
                ft: '2',
                in: '1d3+11',
                lbs: '1d20 + 45'
            },
            '65': {
                description: 'normal',
                ft: '3',
                in: '1d3',
                lbs: '1d20 + 50'
            },
            '85': {
                description: 'gordinha',
                ft: '3',
                in: '1d3',
                lbs: '1d20 + 55'
            },
            '95': {
                description: 'grande',
                ft: '3',
                in: '1d3+3',
                lbs: '1d20 + 55'
            },
            '00': {
                description: 'descomunal',
                ft: '3',
                in: '1d3+5',
                lbs: '1d20 + 60'
            }
        }
    },
    'meio-elfo': {
        'Masculino': {
            '10': {
                description: 'pequeno',
                ft: '5',
                in: '1d4+1',
                lbs: '1d20 + 105'
            },
            '30': {
                description: 'magro',
                ft: '5',
                in: '1d4+5',
                lbs: '1d20 + 115'
            },
            '70': {
                description: 'normal',
                ft: '5',
                in: '1d4+6',
                lbs: '1d20 + 125'
            },
            '80': {
                description: 'robusto',
                ft: '5',
                in: '1d4+6',
                lbs: '1d20 + 135'
            },
            '95': {
                description: 'grande',
                ft: '5',
                in: '1d4+10',
                lbs: '1d20 + 135'
            },
            '00': {
                description: 'descomunal',
                ft: '6',
                in: '1d4+1',
                lbs: '1d20 + 145'
            }
        },
        'Feminino': {
            '15': {
                description: 'pequena',
                ft: '4',
                in: '1d4+9',
                lbs: '1d20 + 80'
            },
            '30': {
                description: 'esbelta',
                ft: '5',
                in: '1d4+1',
                lbs: '1d20 + 90'
            },
            '65': {
                description: 'normal',
                ft: '5',
                in: '1d4+2',
                lbs: '1d20 + 100'
            },
            '85': {
                description: 'gordinha',
                ft: '5',
                in: '1d4+2',
                lbs: '1d20 + 110'
            },
            '95': {
                description: 'grande',
                ft: '5',
                in: '1d4+6',
                lbs: '1d20 + 110'
            },
            '00': {
                description: 'descomunal',
                ft: '5',
                in: '1d4+9',
                lbs: '1d20 + 120'
            }
        }
    },
    'meio-orc': {
        'Masculino': {
            '10': {
                description: 'pequeno',
                ft: '5',
                in: '1d4+3',
                lbs: '1d20 + 130'
            },
            '25': {
                description: 'magro',
                ft: '5',
                in: '1d4+7',
                lbs: '1d20 + 140'
            },
            '55': {
                description: 'normal',
                ft: '5',
                in: '1d4+8',
                lbs: '1d20 + 150'
            },
            '85': {
                description: 'robusto',
                ft: '5',
                in: '1d4+8',
                lbs: '1d20 + 165'
            },
            '95': {
                description: 'grande',
                ft: '6',
                in: '1d4',
                lbs: '1d20 + 160'
            },
            '00': {
                description: 'descomunal',
                ft: '6',
                in: '1d4+3',
                lbs: '1d20 + 170'
            }
        },
        'Feminino': {
            '15': {
                description: 'pequena',
                ft: '4',
                in: '1d4+10',
                lbs: '1d20 + 100'
            },
            '30': {
                description: 'esbelta',
                ft: '5',
                in: '1d4+2',
                lbs: '1d20 + 110'
            },
            '65': {
                description: 'normal',
                ft: '5',
                in: '1d4+3',
                lbs: '1d20 + 120'
            },
            '85': {
                description: 'gordinha',
                ft: '5',
                in: '1d4+3',
                lbs: '1d20 + 135'
            },
            '95': {
                description: 'grande',
                ft: '5',
                in: '1d4+3',
                lbs: '1d20 + 130'
            },
            '00': {
                description: 'descomunal',
                ft: '5',
                in: '1d4+7',
                lbs: '1d20 + 140'
            }
        }
    }
} as const;

interface PhysicalStats {
    description: string;
    height: string;
    weight: string;
}

export function generatePhysicalStats(race: string, gender: string): PhysicalStats {
    // Função auxiliar para rolar dados
    const rollDice = (formula: string): number => {
        // Parse fórmulas como "1d4+1", "1d20 + 130", "1d3+10"
        const match = formula.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
        if (!match) return 0;

        const [, numDice, sides, bonus = '0'] = match;
        let total = 0;

        for (let i = 0; i < parseInt(numDice); i++) {
            total += Math.floor(Math.random() * parseInt(sides)) + 1;
        }

        return total + parseInt(bonus);
    };

    // Função para determinar qual linha da tabela usar baseado no percentual
    const rollTable = (roll: number, genderTable: any) => {
        const keys = Object.keys(genderTable).sort((a, b) => {
            // Tratar '00' como 100 para ordenação correta
            const aVal = a === '00' ? 100 : parseInt(a);
            const bVal = b === '00' ? 100 : parseInt(b);
            return aVal - bVal;
        });

        for (const key of keys) {
            const threshold = key === '00' ? 100 : parseInt(key);
            if (roll <= threshold) {
                return key;
            }
        }
        return keys[keys.length - 1]; // Retorna o último (maior percentil)
    };

    // Verificar se a raça existe na tabela
    const raceTable = heightWeightTables[race as keyof typeof heightWeightTables];
    if (!raceTable) {
        // Fallback para raças não encontradas (usar humano)
        return generatePhysicalStats('humano', gender);
    }

    // Verificar se o gênero existe para a raça
    const genderTable = raceTable[gender as keyof typeof raceTable] || raceTable['Masculino'];

    // Rolar percentual (1-100)
    const roll = Math.floor(Math.random() * 100) + 1;
    const key = rollTable(roll, genderTable);
    const entry = genderTable[key as keyof typeof genderTable];

    if (!entry) {
        return { height: "5'6\"", weight: "150 lbs", description: "normal" };
    }

    // Calcular altura
    const feet = parseInt(entry.ft);
    const inches = rollDice(entry.in);
    // Converter para centímetros (1 pé = 30.48 cm, 1 polegada = 2.54 cm)
    const totalCm = Math.round((feet * 30.48) + (inches * 2.54));
    const height = `${totalCm} cm`;

    // Calcular peso
    const weightLbs = rollDice(entry.lbs);
    // Converter para quilos (1 libra = 0.453592 kg)
    const weightKg = Math.round(weightLbs * 0.453592);
    const weight = `${weightKg} kg`;

    return {
        height,
        weight,
        description: entry.description
    };
}

// Magias por classe
export const spellsByClass = {
    'clerigo': {
        0: ['Criar água', 'descobrir veneno', 'discernir disposição', 'discernir magia', 'luz', 'primeiros socorros', 'purificar', 'resistir ao frio/calor'],
        1: ['abençoar', 'abençoar água', 'comando', 'curar ferimentos leves', 'descobrir portas secretas', 'escudo divino', 'manto invisível à mortos-vivos', 'proteção contra disposição', 'remover medo', 'resistir a um elemento', 'revelar mortos-vivos', 'santuário', 'tempestade sonora']
    },
    'druida': {
        0: ['Conhecer o caminho', 'Criar água', 'descobrir veneno', 'discernir disposição', 'luz', 'primeiros socorros', 'purificar', 'resistir ao frio/calor'],
        1: ['Acalmar animais', 'Alarme', 'Aura das fadas', 'Bom fruto', 'Bordão mágico', 'Descobrir armadilhas e poços', 'Descobrir portas secretas', 'Elo animal', 'Funda mágica', 'Invisibilidade a animais', 'Obscurecer com névoa', 'Passo da trilha selvagem', 'Vegetação enredadora']
    },
    'mago': {
        0: ['Abrir/fechar', 'Alcance arcano', 'Consertar', 'Descobrir veneno', 'Discernir magia', 'Luz', 'Mensagem', 'Orbes dançantes', 'Prestidigitação', 'Resistir ao frio/calor', 'Runa arcana', 'Som fantasma'],
        1: ['Alterar-se menor', 'Alterar tamanho', 'Apagar', 'Armadura arcana', 'Chamas ardentes', 'Choque', 'Compreensão', 'Decifrar escrita arcana', 'Disco flutuante', 'Encantar humanóide', 'Escudo', 'Identificar', 'Invocar familiar', 'Leve como uma pena', 'Mísseis arcanos', 'Passo da aranha', 'Proteção contra disposição', 'Salto', 'Servo invisível', 'Sono', 'Travar barras ou portão']
    },
    'ilusionista': {
        0: ['Consertar', 'Discernir ilusão', 'Glamour arcano', 'Influenciar', 'Luz', 'Marca do dragão', 'Mensagem', 'Orbes dançantes', 'Prestidigitação', 'Primeiros socorros', 'Runa arcana', 'Som fantasma'],
        1: ['Açoite sombrio menor', 'Alterar-se menor', 'Apagar', 'Armadura arcana', 'Armadura do dragão', 'Atordoar', 'Aura indetectável', 'Cães ilusórios', 'Cores', 'Decifrar escrita arcana', 'Encantar humanóide', 'Força temporária de Ward', 'Hipnotismo', 'Ilusão', 'Ilusão silenciosa', 'Imagem de dragão', 'Nublar visão', 'Obscurecer com névoa', 'reflexo feérico', 'Trevas', 'Ventriloquismo', 'Ver o invisível']
    }
};

// Quantidade de magias por classe
export const spellCount: Record<string, Record<number, number>> = {
    'clerigo': { 0: 3, 1: 2 },
    'druida': { 0: 3, 1: 2 },
    'mago': { 0: 4, 1: 3 },
    'ilusionista': { 0: 4, 1: 3 }
};