// Dados do jogo baseados no HTML original

export interface CharacterAttributes {
  forca: number;
  inteligencia: number;
  sabedoria: number;
  destreza: number;
  constitution: number;
  carisma: number;
}

// Bônus raciais para cada raça
export const racialBonuses: Record<string, Partial<CharacterAttributes>> = {
  'humano': {
    forca: 0,
    inteligencia: 0,
    sabedoria: 0,
    destreza: 0,
    constitution: 0,
    carisma: 0
  },
  'elfo': {
    forca: 0,
    inteligencia: 0,
    sabedoria: 0,
    destreza: 1,
    constitution: -1,
    carisma: 0
  },
  'anao': {
    forca: 0,
    inteligencia: 0,
    sabedoria: 0,
    destreza: 0,
    constitution: 1,
    carisma: -1
  },
  'pequenino': {
    forca: -1,
    inteligencia: 0,
    sabedoria: 0,
    destreza: 1,
    constitution: 0,
    carisma: 0
  },
  'gnomo': {
    forca: -1,
    inteligencia: 1,
    sabedoria: 0,
    destreza: 0,
    constitution: 0,
    carisma: 0
  },
  'meio-elfo-humano': {
    forca: 0,
    inteligencia: 0,
    sabedoria: 0,
    destreza: 0,
    constitution: 0,
    carisma: 0
  },
  'meio-elfo-elfo': {
    forca: 0,
    inteligencia: 0,
    sabedoria: 0,
    destreza: 1,
    constitution: -1,
    carisma: 0
  },
  'meio-orc': {
    forca: 1,
    inteligencia: 0,
    sabedoria: 0,
    destreza: 0,
    constitution: 1,
    carisma: -2
  }
};

// Tabelas de idade por raça e classe
interface AgeFormula {
  base: number;
  dice: string;
}

export const ageFormulas: Record<string, Record<string, AgeFormula>> = {
  'anao': {
    'clerigo': { base: 250, dice: '2d20' },
    'druida': { base: 250, dice: '2d20' },
    'mago': { base: 300, dice: '2d20' },
    'ilusionista': { base: 300, dice: '2d20' },
    'trapaceiro': { base: 75, dice: '3d6' },
    'default': { base: 40, dice: '5d4' }
  },
  'elfo': {
    'clerigo': { base: 500, dice: '10d10' },
    'druida': { base: 500, dice: '10d10' },
    'mago': { base: 150, dice: '5d6' },
    'ilusionista': { base: 150, dice: '5d6' },
    'trapaceiro': { base: 100, dice: '5d6' },
    'default': { base: 130, dice: '5d6' }
  },
  'gnomo': {
    'clerigo': { base: 300, dice: '3d12' },
    'druida': { base: 300, dice: '3d12' },
    'mago': { base: 100, dice: '2d12' },
    'ilusionista': { base: 100, dice: '2d12' },
    'trapaceiro': { base: 80, dice: '5d8' },
    'default': { base: 60, dice: '5d4' }
  },
  'meio-elfo-elfo': {
    'clerigo': { base: 40, dice: '2d4' },
    'druida': { base: 40, dice: '2d4' },
    'mago': { base: 30, dice: '2d8' },
    'ilusionista': { base: 30, dice: '2d8' },
    'trapaceiro': { base: 22, dice: '3d8' },
    'default': { base: 22, dice: '3d4' }
  },
  'meio-elfo-humano': {
    'clerigo': { base: 40, dice: '2d4' },
    'druida': { base: 40, dice: '2d4' },
    'mago': { base: 30, dice: '2d8' },
    'ilusionista': { base: 30, dice: '2d8' },
    'trapaceiro': { base: 22, dice: '3d8' },
    'default': { base: 22, dice: '3d4' }
  },
  'pequenino': {
    'clerigo': { base: 40, dice: '3d4' },
    'druida': { base: 40, dice: '3d4' },
    'mago': { base: 50, dice: '3d4' },
    'ilusionista': { base: 50, dice: '3d4' },
    'trapaceiro': { base: 40, dice: '2d4' },
    'default': { base: 20, dice: '3d4' }
  },
  'meio-orc': {
    'clerigo': { base: 20, dice: '1d4' },
    'druida': { base: 20, dice: '1d4' },
    'mago': { base: 25, dice: '3d4' },
    'ilusionista': { base: 25, dice: '3d4' },
    'trapaceiro': { base: 20, dice: '2d4' },
    'default': { base: 13, dice: '1d4' }
  },
  'humano': {
    'clerigo': { base: 20, dice: '1d4' },
    'druida': { base: 20, dice: '1d4' },
    'mago': { base: 24, dice: '1d4' },
    'ilusionista': { base: 24, dice: '1d4' },
    'trapaceiro': { base: 20, dice: '1d4' },
    'default': { base: 15, dice: '1d4' }
  }
};

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
    'barbaro': ['constitution'],
  'bardo': ['carisma'],
    'cavaleiro': ['forca'],
  'clerigo': ['sabedoria'],
  'combatente': ['forca'],
  'druida': ['sabedoria'],
  'explorador': ['forca'],
  'ilusionista': ['inteligencia'],
    'lutador': ['constitution'],
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
    0: ['Criar água', 'descobrir veneno', 'discernir disposição', 'discernir magia', 'luz', 'primeiros socorros', 'purificar', 'resistir ao frio/calor'],
    1: ['chamar relâmpago', 'conjurar animal (pequeno)', 'curar ferimentos leves', 'encontrar armadilhas e perigos', 'falar com animais', 'floresta em crescimento', 'moldar pedra', 'neblina', 'proteção contra disposição', 'remover medo', 'resistir a um elemento', 'santuário']
  },
  'mago': {
    0: ['apagamento', 'armadura arcana', 'bruxaria', 'consertar', 'criar água', 'luz', 'mãos mágicas', 'mensagem', 'miscelânea', 'projetar imagem menor', 'raio de gelo', 'sonho inquieto', 'truque da mente'],
    1: ['armadura de mago', 'arma mágica menor', 'compreensão de idiomas', 'concealment (obscurecimento)', 'detect magic (detectar magia)', 'disguise self (disfarçar-se)', 'enfeitiçar pessoa', 'escudo arcano', 'imagem silenciosa', 'mísseis mágicos', 'neblina', 'proteção contra disposição', 'sono', 'trovão estrondoso']
  },
  'ilusionista': {
    0: ['apagamento', 'armadura arcana', 'bruxaria', 'consertar', 'criar água', 'luz', 'mãos mágicas', 'mensagem', 'miscelânea', 'projetar imagem menor', 'raio de gelo', 'sonho inquieto', 'truque da mente'],
    1: ['armadura de mago', 'arma mágica menor', 'compreensão de idiomas', 'concealment (obscurecimento)', 'detect magic (detectar magia)', 'disguise self (disfarçar-se)', 'enfeitiçar pessoa', 'escudo arcano', 'imagem silenciosa', 'mísseis mágicos', 'neblina', 'proteção contra disposição', 'sono', 'trovão estrondoso']
  }
};

// Quantidade de magias por classe
export const spellCount: Record<string, Record<number, number>> = {
  'clerigo': { 0: 3, 1: 2 },
  'druida': { 0: 3, 1: 2 },
  'mago': { 0: 4, 1: 3 },
  'ilusionista': { 0: 4, 1: 3 }
};