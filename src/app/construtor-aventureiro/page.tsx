/** biome-ignore-all lint/correctness/useExhaustiveDependencies: Effects intencionalmente dependem apenas de variáveis específicas */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConfig } from "@/hooks/use-config";
import * as CharGen from "@/modules/char-gen/ui";
import { LabeledCheckbox } from "@/modules/char-gen/ui/labeled-checkbox";
import { charClasses } from "@/modules/compendium/charClasses";
import { charRaces } from "@/modules/data/charRaces";
import {
  type CharacterAttributes,
  calculateModifier,
  generateAgeCategory,
  generateDistinctiveTrait,
  generateHeightCategory,
  generateWeightCategory,
  hpFormula,
  primeAttributes,
  racialBonuses,
  spellCount,
  spellsByClass,
  treasureFormula
} from "@/modules/data/gameData";
import { saveCharacterToStorage } from "@/modules/fichas/stores/character";
import type { CharacterState } from "@/modules/fichas/types";
import { useSheets } from "@/modules/fichas/use-sheets";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const initialAttributes: CharacterAttributes = {
  forca: 10,
  destreza: 10,
  constituicao: 10,
  inteligencia: 10,
  sabedoria: 10,
  carisma: 10
};

type GeneratedCharacterContext = {
  selectedRace: string;
  selectedClass: string;
  attributes: CharacterAttributes;
  primeAttributes: string[];
  secondaryAttributes: string[];
  totalModifier: number;
  rollAttempts: number;
};

const attributeKeys = Object.keys(initialAttributes) as (keyof CharacterAttributes)[];

const classWeights: Record<string, number> = {
  assassino: 2,
  barbaro: 2,
  bardo: 2,
  cavaleiro: 2,
  clerigo: 8,
  combatente: 10,
  druida: 2,
  explorador: 2,
  ilusionista: 2,
  lutador: 1,
  mago: 8,
  paladino: 1,
  trapaceiro: 10
};

const classesByRace: Record<string, string[]> = {
  anao: ['combatente', 'trapaceiro', 'barbaro', 'clerigo', 'bardo'],
  elfo: ['combatente', 'explorador', 'trapaceiro', 'mago', 'druida', 'cavaleiro', 'bardo'],
  gnomo: ['trapaceiro', 'ilusionista', 'druida', 'bardo'],
  'meio-orc': ['combatente', 'explorador', 'trapaceiro', 'assassino', 'barbaro', 'lutador', 'clerigo', 'cavaleiro'],
  pequenino: ['combatente', 'explorador', 'trapaceiro', 'clerigo', 'druida', 'bardo']
};

const classRequiredNonNegativeAttributes: Record<string, (keyof CharacterAttributes)[]> = {
  assassino: ['destreza'],
  barbaro: ['constituicao', 'forca', 'destreza'],
  bardo: ['carisma', 'forca', 'destreza'],
  cavaleiro: ['carisma', 'forca', 'destreza'],
  clerigo: ['sabedoria', 'forca'],
  combatente: ['forca', 'constituicao'],
  druida: ['sabedoria', 'destreza'],
  explorador: ['destreza', 'sabedoria'],
  ilusionista: ['inteligencia', 'carisma'],
  lutador: ['forca', 'destreza', 'constituicao', 'sabedoria'],
  mago: ['inteligencia'],
  paladino: ['forca', 'constituicao', 'carisma'],
  trapaceiro: ['destreza', 'inteligencia']
};

const racialClassWeightBonuses: Record<string, Record<string, number>> = {
  anao: { combatente: 2 },
  elfo: { explorador: 2, druida: 2, bardo: 2 },
  gnomo: { ilusionista: 3, druida: 2 },
  'meio-orc': { barbaro: 2, explorador: 2, assassino: 2 }
};

const physicalAttributeClasses = new Set([
  'barbaro',
  'cavaleiro',
  'combatente',
  'explorador',
  'lutador',
  'paladino',
  'trapaceiro',
  'assassino'
]);

const mentalAttributeClasses = new Set([
  'bardo',
  'clerigo',
  'druida',
  'ilusionista',
  'mago'
]);

const pickRandom = <T,>(options: T[]): T => {
  if (options.length === 0) {
    throw new Error('Não há opções disponíveis para a rolagem.');
  }

  return options[Math.floor(Math.random() * options.length)];
};

const pickWeighted = <T,>(options: { value: T; weight: number }[]): T => {
  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
  if (options.length === 0 || totalWeight <= 0) {
    throw new Error('Não há opções válidas para a rolagem ponderada.');
  }

  let roll = Math.random() * totalWeight;

  for (const option of options) {
    roll -= option.weight;
    if (roll < 0) {
      return option.value;
    }
  }

  return options[options.length - 1].value;
};

const createInitialPrimeAttributeStates = () => ({
  forca: {
    label: 'Força',
    checked: false
  },
  destreza: {
    label: 'Destreza',
    checked: false
  },
  constituicao: {
    label: 'Constituição',
    checked: false
  },
  inteligencia: {
    label: 'Inteligência',
    checked: false
  },
  sabedoria: {
    label: 'Sabedoria',
    checked: false
  },
  carisma: {
    label: 'Carisma',
    checked: false
  }
});

export default function AdventurerConstructor() {
  // Estados do personagem
  const [baseAttributes, setBaseAttributes] = useState<CharacterAttributes>(initialAttributes);
  const [finalAttributes, setFinalAttributes] = useState<CharacterAttributes>({ ...baseAttributes });
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [rollAttempts, setRollAttempts] = useState(0);
  const [totalModifier, setTotalModifier] = useState(0);
  const [primeAttributeStates, setPrimeAttributeStates] = useState<Record<string, { label: string; checked: boolean }>>(createInitialPrimeAttributeStates());
  const [secondaryAttributeStates, setSecondaryAttributeStates] = useState<Record<string, { label: string; checked: boolean }>>(createInitialPrimeAttributeStates());

  // Estados de realocação de pontos
  const [pointAdjustments, setPointAdjustments] = useState<Record<string, number>>({
    forca: 0,
    destreza: 0,
    constituicao: 0,
    inteligencia: 0,
    sabedoria: 0,
    carisma: 0
  });

  // Estados dos detalhes finais
  const [hp, setHp] = useState('');
  const [treasure, setTreasure] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [carryingCapacity, setCarryingCapacity] = useState('');
  const [spells, setSpells] = useState<{ level0: string[], level1: string[] }>({ level0: [], level1: [] });


  // Hook do Zustand para configurações
  const { discordWebhook } = useConfig();

  // Hooks de navegação e sheets
  const router = useRouter();
  const { addSheet } = useSheets();

  // Estados de controle
  const [canSelectRaceClass, setCanSelectRaceClass] = useState(false);
  const [canRollFinalDetails, setCanRollFinalDetails] = useState(false);
  const [showSpells, setShowSpells] = useState(false);
  const [activeTab, setActiveTab] = useState("step1");

  // Função helper para calcular atributos com bônus racial (sem realocação)
  const getAttributesWithRacialBonus = () => {
    const withBonus = { ...baseAttributes };

    if (selectedRace && racialBonuses[selectedRace.toLowerCase()]) {
      const raceKey = selectedRace.toLowerCase().split(' ')[0];
      const bonuses = racialBonuses[raceKey];
      if (bonuses) {
        Object.keys(bonuses).forEach(attr => {
          const attrKey = attr as keyof CharacterAttributes;
          const bonus = bonuses[attrKey];
          if (bonus !== undefined) {
            withBonus[attrKey] += bonus;
          }
        });
      }
    }

    return withBonus;
  };

  // Efeito para aplicar bônus racial, realocações e calcular modificador total
  useEffect(() => {
    const newAttributes = { ...baseAttributes };

    if (selectedRace && racialBonuses[selectedRace.toLowerCase()]) {
      const raceKey = selectedRace.toLowerCase().split(' ')[0]; // pegar primeira palavra
      const bonuses = racialBonuses[raceKey];
      if (bonuses) {
        Object.keys(bonuses).forEach(attr => {
          const attrKey = attr as keyof CharacterAttributes;
          const bonus = bonuses[attrKey];
          if (bonus !== undefined) {
            newAttributes[attrKey] += bonus;
          }
        });
      }
    }

    // Aplicar ajustes de realocação de pontos
    Object.keys(pointAdjustments).forEach(attr => {
      const attrKey = attr as keyof CharacterAttributes;
      newAttributes[attrKey] += pointAdjustments[attrKey];
    });

    setFinalAttributes(newAttributes);

    // Calcular modificador total
    const totalMod = Object.values(newAttributes).reduce((sum, value) => {
      return sum + calculateModifier(value);
    }, 0);
    setTotalModifier(totalMod);
  }, [baseAttributes, selectedRace, pointAdjustments]);

  // Efeito para verificar se pode rolar detalhes finais
  useEffect(() => {
    setCanRollFinalDetails(selectedRace !== '' && selectedClass !== '');
  }, [selectedRace, selectedClass]);

  // Efeito para mostrar magias se for classe conjuradora
  useEffect(() => {
    if (selectedClass) {
      setShowSpells(['mago', 'ilusionista', 'clerigo', 'druida'].includes(selectedClass) || selectedRace === 'gnomo');
    } else {
      setShowSpells(selectedRace === 'gnomo');
    }
  }, [selectedClass, selectedRace]);

  // Efeito para marcar atributos prime da classe automaticamente
  useEffect(() => {
    if (selectedClass) {
      // Para todas as raças, sempre marca os atributos prime obrigatórios da classe
      const classKey = selectedClass;
      const primes = primeAttributes[classKey] || [];

      setPrimeAttributeStates(previousStates => {
        const newPrimeStates = { ...previousStates };
        primes.forEach(attr => {
          newPrimeStates[attr].checked = true;
        });
        return newPrimeStates;
      });
    }
  }, [selectedClass]); // Só executa quando a classe muda

  // Efeito separado para ajustar quando a raça muda
  useEffect(() => {
    if (selectedRace && selectedClass) {
      const classKey = selectedClass;
      const primes = primeAttributes[classKey] || [];
      const maxPrimes = selectedRace.toLowerCase().startsWith('humano') ? 3 : Math.max(2, primes.length);

      // Para humanos, o limite é diferente mas os atributos obrigatórios da classe são os mesmos
      const isHuman = selectedRace.toLowerCase().startsWith('humano');
      if (isHuman) {
        // Para humanos, ainda marca os atributos obrigatórios da classe
        const newPrimeStates = { ...primeAttributeStates };

        if (selectedClass) {
          const classPrimes = primeAttributes[selectedClass] || [];
          // Garante que os atributos prime da classe estejam marcados
          classPrimes.forEach(attr => {
            newPrimeStates[attr].checked = true;
          });
          setPrimeAttributeStates(newPrimeStates);
        }

        // Continua com a verificação de limite abaixo
      }

      // Para outras raças, verifica se a quantidade atual excede o limite
      const currentCount = Object.values(primeAttributeStates).filter(state => state.checked).length;

      if (currentCount > maxPrimes) {
        // Se excede o limite, mantém apenas os atributos obrigatórios da classe
        const newPrimeStates = { ...primeAttributeStates };
        Object.keys(newPrimeStates).forEach(key => {
          newPrimeStates[key].checked = primes.includes(key);
        });
        setPrimeAttributeStates(newPrimeStates);
      } else {
        // Se não excede, apenas garante que os obrigatórios da classe estejam marcados
        const newPrimeStates = { ...primeAttributeStates };
        primes.forEach(attr => {
          newPrimeStates[attr].checked = true;
        });
        setPrimeAttributeStates(newPrimeStates);
      }
    }
  }, [selectedRace]); // Só executa quando a raça muda

  // Função para alternar atributo prime
  const togglePrimeAttribute = (attr: string) => {
    const maxPrimes = getMaxPrimeAttributes();
    const currentCount = Object.values(primeAttributeStates).filter(state => state.checked).length;

    // Não permite desmarcar atributos obrigatórios da classe para nenhuma raça
    if (selectedClass) {
      const classKey = selectedClass;
      const requiredPrimes = primeAttributes[classKey] || [];

      // Se está tentando desmarcar um atributo obrigatório da classe, não permite
      if (primeAttributeStates[attr].checked && requiredPrimes.includes(attr)) {
        return;
      }
    }

    // Se está tentando marcar e já atingiu o limite, não permite
    if (!primeAttributeStates[attr].checked && currentCount >= maxPrimes) {
      return;
    }

    // Se está tentando marcar como primário, desmarca de secundário (se estiver marcado)
    if (!primeAttributeStates[attr].checked && secondaryAttributeStates[attr].checked) {
      setSecondaryAttributeStates(prev => ({
        ...prev,
        [attr]: {
          ...prev[attr],
          checked: false
        }
      }));
    }

    setPrimeAttributeStates(prev => ({
      ...prev,
      [attr]: {
        ...prev[attr],
        checked: !prev[attr].checked
      }
    }));
  };

  // Função para alternar atributo secundário
  const toggleSecondaryAttribute = (attr: string) => {
    const currentCount = Object.values(secondaryAttributeStates).filter(state => state.checked).length;
    const maxSecondary = 2;

    // Não permite marcar como secundário se já é primário
    if (primeAttributeStates[attr].checked) {
      return;
    }

    // Se está tentando marcar e já atingiu o limite, não permite
    if (!secondaryAttributeStates[attr].checked && currentCount >= maxSecondary) {
      return;
    }

    setSecondaryAttributeStates(prev => ({
      ...prev,
      [attr]: {
        ...prev[attr],
        checked: !prev[attr].checked
      }
    }));
  };

  // Função para obter número máximo de atributos prime
  const getMaxPrimeAttributes = (): number => {
    // Humanos podem escolher qualquer atributo como prime, até 3
    if (selectedRace.toLowerCase().startsWith('humano')) {
      return 3;
    }
    // Outras raças seguem os atributos prime da classe (normalmente 2)
    const primes = primeAttributes[selectedClass] || [];
    return Math.max(2, primes.length);
  };

  // Função para rolar atributos com 3d6
  const handleRollAttributes = () => {
    const newAttributes: CharacterAttributes = {
      forca: new DiceRoll('3d6').total,
      destreza: new DiceRoll('3d6').total,
      constituicao: new DiceRoll('3d6').total,
      inteligencia: new DiceRoll('3d6').total,
      sabedoria: new DiceRoll('3d6').total,
      carisma: new DiceRoll('3d6').total
    };

    setBaseAttributes(newAttributes);
    setCanSelectRaceClass(true);
    setRollAttempts(prev => prev + 1);
  };

  const handleQuickCharacter = () => {
    let generatedAttributes: CharacterAttributes;
    let attempts = 0;
    let rolledModifierTotal: number;

    do {
      generatedAttributes = {
        forca: new DiceRoll('3d6').total,
        destreza: new DiceRoll('3d6').total,
        constituicao: new DiceRoll('3d6').total,
        inteligencia: new DiceRoll('3d6').total,
        sabedoria: new DiceRoll('3d6').total,
        carisma: new DiceRoll('3d6').total
      };
      attempts += 1;
      rolledModifierTotal = Object.values(generatedAttributes)
        .reduce((sum, value) => sum + calculateModifier(value), 0);
    } while (rolledModifierTotal < 1);

    const raceWeights: Record<string, number> = {
      humano: 55,
      elfo: 10,
      anao: 10,
      pequenino: 5,
      'meio-elfo-humano': 5,
      'meio-elfo-elfo': 5,
      'meio-orc': 5,
      gnomo: 5
    };
    const eligibleRaces = charRaces
      .filter(({ id }) => {
        const bonuses = racialBonuses[id] || {};
        const raceAttributes = { ...generatedAttributes };
        attributeKeys.forEach(attribute => {
          raceAttributes[attribute] += bonuses[attribute] || 0;
        });
        const raceModifierTotal = attributeKeys.reduce((sum, attribute) => {
          return sum + calculateModifier(raceAttributes[attribute]);
        }, 0);
        if (raceModifierTotal < 0) {
          return false;
        }

        const allowedClasses = charClasses.filter(({ id: classId }) => {
          const isAllowedForRace = !classesByRace[id] || classesByRace[id].includes(classId);
          const meetsAttributeRequirements = (classRequiredNonNegativeAttributes[classId] || [])
            .every(attribute => calculateModifier(raceAttributes[attribute]) >= 0);
          return isAllowedForRace && meetsAttributeRequirements;
        });
        return allowedClasses.length > 0;
      })
      .map(({ id }) => ({ value: id, weight: raceWeights[id] }));
    const race = pickWeighted(eligibleRaces);
    const racialBonusesForRace = racialBonuses[race] || {};
    const attributesWithRacialBonus = { ...generatedAttributes };
    attributeKeys.forEach(attribute => {
      attributesWithRacialBonus[attribute] += racialBonusesForRace[attribute] || 0;
    });
    const physicalAttributeTotal = attributesWithRacialBonus.forca
      + attributesWithRacialBonus.destreza
      + attributesWithRacialBonus.constituicao;
    const mentalAttributeTotal = attributesWithRacialBonus.inteligencia
      + attributesWithRacialBonus.sabedoria
      + attributesWithRacialBonus.carisma;
    const attributeGroupWeightBonus = physicalAttributeTotal > mentalAttributeTotal
      ? physicalAttributeClasses
      : mentalAttributeTotal > physicalAttributeTotal
        ? mentalAttributeClasses
        : null;
    const modifiers = Object.fromEntries(
      attributeKeys.map(attribute => [attribute, calculateModifier(attributesWithRacialBonus[attribute])])
    ) as Record<keyof CharacterAttributes, number>;
    const sortedModifierValues = [...new Set(Object.values(modifiers))].sort((a, b) => b - a);
    const highestModifier = sortedModifierValues[0];
    const relevantModifiers = highestModifier <= 1
      ? sortedModifierValues.filter(value => value >= highestModifier - 1)
      : [highestModifier];
    const relevantAttributes = attributeKeys.filter(attribute => relevantModifiers.includes(modifiers[attribute]));
    const raceEligibleClasses = charClasses.filter(({ id }) => !classesByRace[race] || classesByRace[race].includes(id));
    const classesMeetingAttributeRequirements = raceEligibleClasses.filter(({ id }) =>
      (classRequiredNonNegativeAttributes[id] || [])
        .every(attribute => modifiers[attribute] >= 0)
    );
    const classesMatchingHighestAttributes = relevantAttributes.length === attributeKeys.length
      ? classesMeetingAttributeRequirements
      : classesMeetingAttributeRequirements.filter(({ id }) => {
        const matchesPrimaryAttribute = (primeAttributes[id] || [])
          .some(attribute => relevantAttributes.includes(attribute as keyof CharacterAttributes));
        const isCombatantPhysicalAttributeException = id === 'combatente'
          && (
            (modifiers.constituicao >= 2 && relevantAttributes.includes('constituicao'))
            || (modifiers.destreza >= 2 && relevantAttributes.includes('destreza'))
          );

        return matchesPrimaryAttribute || isCombatantPhysicalAttributeException;
      });
    const eligibleClasses = classesMatchingHighestAttributes.length > 0
      ? classesMatchingHighestAttributes
      : classesMeetingAttributeRequirements;
    const characterClass = pickWeighted(eligibleClasses.map(({ id }) => ({
      value: id,
      weight: classWeights[id]
        + (racialClassWeightBonuses[race]?.[id] || 0)
        + (attributeGroupWeightBonus?.has(id) ? 4 : 0)
    })));
    const requiredPrimes = primeAttributes[characterClass] || [];
    const maxPrimesForRace = race.startsWith('humano') ? 3 : Math.max(2, requiredPrimes.length);
    const selectedPrimes = new Set<string>(requiredPrimes);
    const racePreferredAttributes: Record<string, (keyof CharacterAttributes)[]> = {
      anao: ['constituicao', 'forca'],
      elfo: ['inteligencia', 'sabedoria', 'destreza'],
      'meio-elfo-elfo': ['inteligencia', 'sabedoria', 'destreza'],
      pequenino: ['destreza', 'sabedoria'],
      'meio-orc': ['forca', 'destreza', 'constituicao'],
      gnomo: ['inteligencia', 'carisma', 'constituicao']
    };
    const classSecondaryPriorities: Record<string, (keyof CharacterAttributes)[]> = {
      barbaro: ['forca'],
      bardo: ['inteligencia'],
      cavaleiro: ['forca'],
      clerigo: ['forca'],
      combatente: ['constituicao', 'destreza'],
      explorador: ['destreza'],
      ilusionista: ['carisma', 'sabedoria'],
      lutador: ['destreza', 'forca'],
      paladino: ['sabedoria', 'forca'],
      trapaceiro: ['inteligencia', 'sabedoria'],
      assassino: ['sabedoria', 'carisma', 'inteligencia']
    };

    while (selectedPrimes.size < maxPrimesForRace) {
      const availableAttributes = attributeKeys.filter(attribute => !selectedPrimes.has(attribute));
      const classPriorityOptions = selectedPrimes.size === requiredPrimes.length
        ? (classSecondaryPriorities[characterClass] || [])
          .filter(attribute => !selectedPrimes.has(attribute) && modifiers[attribute] >= 0)
        : [];

      if (classPriorityOptions.length > 0) {
        selectedPrimes.add(pickRandom(classPriorityOptions));
        continue;
      }

      const positiveAttributes = availableAttributes.filter(attribute => modifiers[attribute] > 0);
      const nonNegativeAttributes = availableAttributes.filter(attribute => modifiers[attribute] >= 0);
      const candidates = positiveAttributes.length > 0
        ? positiveAttributes
        : nonNegativeAttributes.length > 0
          ? nonNegativeAttributes
          : availableAttributes;
      const options = race.startsWith('humano')
        ? candidates.filter(attribute => {
          const bestAvailableModifier = Math.max(...candidates.map(candidate => modifiers[candidate]));
          return modifiers[attribute] === bestAvailableModifier;
        })
        : candidates;
      const preferredAttributes = racePreferredAttributes[race] || [];
      const additionalPrime = pickWeighted(options.map(attribute => ({
        value: attribute,
        weight: preferredAttributes.includes(attribute) ? 2 : 1
      })));
      selectedPrimes.add(additionalPrime);
    }

    const secondaryCandidates = attributeKeys.filter(attribute => !selectedPrimes.has(attribute));
    const selectedSecondaries: string[] = [];
    while (selectedSecondaries.length < 2) {
      const nextSecondary = pickRandom(secondaryCandidates);
      selectedSecondaries.push(nextSecondary);
      secondaryCandidates.splice(secondaryCandidates.indexOf(nextSecondary), 1);
    }

    const primeStates = createInitialPrimeAttributeStates();
    selectedPrimes.forEach(attribute => {
      primeStates[attribute as keyof typeof primeStates].checked = true;
    });
    const secondaryStates = createInitialPrimeAttributeStates();
    selectedSecondaries.forEach(attribute => {
      secondaryStates[attribute as keyof typeof secondaryStates].checked = true;
    });
    const nextRollAttempts = rollAttempts + attempts;
    const generatedCharacter: GeneratedCharacterContext = {
      selectedRace: race,
      selectedClass: characterClass,
      attributes: attributesWithRacialBonus,
      primeAttributes: [...selectedPrimes],
      secondaryAttributes: selectedSecondaries,
      totalModifier: Object.values(modifiers).reduce((sum, modifier) => sum + modifier, 0),
      rollAttempts: nextRollAttempts
    };

    setBaseAttributes(generatedAttributes);
    setSelectedRace(race);
    setSelectedClass(characterClass);
    setRollAttempts(nextRollAttempts);
    setPrimeAttributeStates(primeStates);
    setSecondaryAttributeStates(secondaryStates);
    setPointAdjustments({
      forca: 0,
      destreza: 0,
      constituicao: 0,
      inteligencia: 0,
      sabedoria: 0,
      carisma: 0
    });
    setCanSelectRaceClass(true);
    setShowSpells(['mago', 'ilusionista', 'clerigo', 'druida'].includes(characterClass));
    handleRollFinalDetails(generatedCharacter);
    setCanRollFinalDetails(true);
    setActiveTab('step5');
  };

  // Função para rolar atributos com 4d6 (descarta o menor)
  const handleRollAttributes4d6 = () => {
    const roll4d6DropLowest = () => {
      const rolls = [
        new DiceRoll('1d6').total,
        new DiceRoll('1d6').total,
        new DiceRoll('1d6').total,
        new DiceRoll('1d6').total
      ];
      const minValue = Math.min(...rolls);
      const minIndex = rolls.indexOf(minValue);
      const remainingRolls = rolls.filter((_, index) => index !== minIndex);
      return remainingRolls.reduce((sum, val) => sum + val, 0);
    };

    const newAttributes: CharacterAttributes = {
      forca: roll4d6DropLowest(),
      destreza: roll4d6DropLowest(),
      constituicao: roll4d6DropLowest(),
      inteligencia: roll4d6DropLowest(),
      sabedoria: roll4d6DropLowest(),
      carisma: roll4d6DropLowest()
    };

    setBaseAttributes(newAttributes);
    setCanSelectRaceClass(true);
    setRollAttempts(prev => prev + 1);
  };

  // Função para rolar detalhes finais
  const handleRollFinalDetails = (character?: GeneratedCharacterContext) => {
    const classKey = character?.selectedClass || selectedClass;
    const raceKey = (character?.selectedRace || selectedRace).toLowerCase().split(' ')[0];
    const attributes = character?.attributes || finalAttributes;

    // Variáveis para armazenar os dados gerados
    let generatedHp = '';
    let generatedTreasure = '';
    let generatedAge = '';
    let generatedHeight = '';
    let generatedWeight = '';
    let generatedGender = '';
    let generatedDescription = '';
    let generatedCarryingCapacity = '';
    let generatedSpells = { level0: [] as string[], level1: [] as string[] };

    // Calcular HP
    if (hpFormula[classKey]) {
      const hpRoll = new DiceRoll(hpFormula[classKey]);
      const conMod = calculateModifier(attributes.constituicao);
      const totalHp = Math.max(1, hpRoll.total + conMod);
      generatedHp = totalHp.toString();
      setHp(generatedHp);
    }

    // Calcular tesouro
    if (treasureFormula[classKey]) {
      const treasureRoll = new DiceRoll(treasureFormula[classKey]);
      generatedTreasure = `${treasureRoll.total * 10} PO`;
      setTreasure(generatedTreasure);
    }

    // Gerar faixa etária
    generatedAge = generateAgeCategory(classKey);
    setAge(generatedAge);

    // Gerar características físicas
    const genders = ['masc.', 'fem.'];
    generatedGender = genders[Math.floor(Math.random() * genders.length)];
    setGender(generatedGender);

    // Gerar faixa de altura
    generatedHeight = generateHeightCategory(raceKey);
    setHeight(generatedHeight);

    // Gerar faixa de peso
    generatedWeight = generateWeightCategory(raceKey);
    setWeight(generatedWeight);

    // Gerar traço marcante
    generatedDescription = generateDistinctiveTrait();
    setDescription(generatedDescription);

    // Calcular capacidade de carga
    generatedCarryingCapacity = attributes.forca.toString();
    setCarryingCapacity(generatedCarryingCapacity);

    // Gerar magias se for classe conjuradora
    if (['mago', 'ilusionista', 'clerigo', 'druida'].includes(classKey) && spellsByClass[classKey as keyof typeof spellsByClass]) {
      const spellData = spellsByClass[classKey as keyof typeof spellsByClass];
      const counts = spellCount[classKey];

      const shuffleArray = (arr: string[]) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const level0Spells = shuffleArray(spellData[0]).slice(0, counts[0]);
      const level1Spells = shuffleArray(spellData[1]).slice(0, counts[1]);

      generatedSpells = { level0: level0Spells, level1: level1Spells };
    }

    if ((character?.selectedRace || selectedRace) === 'gnomo') {
      generatedSpells.level1.push('orbes dançantes', 'som fantasma', 'prestidigitação');
    }
    setSpells(generatedSpells);

    // Enviar automaticamente para Discord se webhook estiver configurado
    if (discordWebhook.trim()) {
      sendToDiscordWithData({
        selectedRace: character?.selectedRace || selectedRace,
        selectedClass: character?.selectedClass || selectedClass,
        generatedHp,
        generatedAge,
        generatedHeight,
        generatedWeight,
        generatedGender,
        generatedDescription,
        generatedTreasure,
        generatedCarryingCapacity,
        generatedSpells,
        character
      });
    }
  };

  // Função para reiniciar todos os campos e estados da tela
  const handleResetCharacter = () => {
    setBaseAttributes(initialAttributes);
    setFinalAttributes(initialAttributes);
    setSelectedRace('');
    setSelectedClass('');
    setRollAttempts(0);
    setTotalModifier(0);
    setPrimeAttributeStates(createInitialPrimeAttributeStates());
    setSecondaryAttributeStates(createInitialPrimeAttributeStates());
    setPointAdjustments({
      forca: 0,
      destreza: 0,
      constituicao: 0,
      inteligencia: 0,
      sabedoria: 0,
      carisma: 0
    });

    setHp('');
    setTreasure('');
    setAge('');
    setHeight('');
    setWeight('');
    setGender('');
    setDescription('');
    setCarryingCapacity('');
    setSpells({ level0: [], level1: [] });

    setCanSelectRaceClass(false);
    setCanRollFinalDetails(false);
    setShowSpells(false);
    setActiveTab("step1"); // Volta para a primeira aba
  };

  // Função para formatar mensagem do Discord
  const formatDiscordMessage = (characterData: {
    race: string;
    characterClass: string;
    gender: string;
    age: string;
    height: string;
    weight: string;
    description: string;
    attributes: CharacterAttributes;
    modifiers: Record<string, number>;
    totalModifier: number;
    primeAttributes: string[];
    secondaryAttributes: string[];
    hp: string;
    treasure: string;
    carryingCapacity: string;
    spells: { level0: string[]; level1: string[] } | null;
    rollAttempts: number;
  }) => {
    const { race, characterClass, gender, age, height, weight, description, attributes, modifiers, totalModifier, primeAttributes, secondaryAttributes, hp, treasure, carryingCapacity, spells, rollAttempts } = characterData;

    const embed = {
      color: 0x237feb,
      title: "🎲 NOVO PERSONAGEM GERADO 🎲",
      description: `**Raça:** ${race}\n**Classe:** ${characterClass}`,
      fields: [
        {
          name: "📊 ATRIBUTOS",
          value: `**FOR:** ${attributes.forca} (${modifiers.forca >= 0 ? '+' : ''}${modifiers.forca})\n` +
            `**DES:** ${attributes.destreza} (${modifiers.destreza >= 0 ? '+' : ''}${modifiers.destreza})\n` +
            `**CON:** ${attributes.constituicao} (${modifiers.constituicao >= 0 ? '+' : ''}${modifiers.constituicao})\n` +
            `**INT:** ${attributes.inteligencia} (${modifiers.inteligencia >= 0 ? '+' : ''}${modifiers.inteligencia})\n` +
            `**SAB:** ${attributes.sabedoria} (${modifiers.sabedoria >= 0 ? '+' : ''}${modifiers.sabedoria})\n` +
            `**CAR:** ${attributes.carisma} (${modifiers.carisma >= 0 ? '+' : ''}${modifiers.carisma})\n` +
            `**Modificador Total:** ${totalModifier >= 0 ? '+' : ''}${totalModifier}`,
          inline: false
        },
        {
          name: "⭐ ATRIBUTOS PRIME",
          value: primeAttributes.join(', ') || 'Nenhum',
          inline: false
        },
        {
          name: "⚡ ATRIBUTOS SECUNDÁRIOS",
          value: secondaryAttributes.join(', ') || 'Nenhum',
          inline: false
        },
        {
          name: "📋 DETALHES",
          value: `**PV:** ${hp}\n` +
            `**Tesouro:** ${treasure}\n` +
            `**Idade:** ${age}\n` +
            `**Gênero:** ${gender}\n` +
            `**Traço Marcante:** ${description}\n` +
            `**Altura:** ${height}\n` +
            `**Peso:** ${weight}\n` +
            `**Capacidade de Carga:** ${carryingCapacity} kg`,
          inline: false
        }
      ],
      footer: {
        text: `Tentativas de rolagem: ${rollAttempts}x • Gerador de Personagens C&C`
      }
    };

    // Adicionar campo de magias se houver
    if (spells && (spells.level0.length > 0 || spells.level1.length > 0)) {
      let spellsValue = '';
      if (spells.level0.length > 0) {
        spellsValue += `**Nível 0:** ${spells.level0.join(', ')}\n`;
      }
      if (spells.level1.length > 0) {
        spellsValue += `**Nível 1:** ${spells.level1.join(', ')}`;
      }

      embed.fields.push({
        name: "🔮 MAGIAS CONHECIDAS",
        value: spellsValue,
        inline: false
      });
    }

    return { embeds: [embed] };
  };

  // Função para enviar para Discord com dados específicos
  const sendToDiscordWithData = async (generatedData: {
    selectedRace: string;
    selectedClass: string;
    generatedHp: string;
    generatedAge: string;
    generatedHeight: string;
    generatedWeight: string;
    generatedGender: string;
    generatedDescription: string;
    generatedTreasure: string;
    generatedCarryingCapacity: string;
    generatedSpells: { level0: string[]; level1: string[] };
    character?: GeneratedCharacterContext;
  }) => {
    if (!discordWebhook.trim()) {
      return; // Não faz nada se não há webhook
    }

    try {
      const selectedPrimes = generatedData.character
        ? generatedData.character.primeAttributes.map(attribute => attribute.charAt(0).toUpperCase() + attribute.slice(1))
        : Object.entries(primeAttributeStates)
          .filter(([_, state]) => state.checked)
          .map(([attr, _]) => attr.charAt(0).toUpperCase() + attr.slice(1));

      const selectedSecondaries = generatedData.character
        ? generatedData.character.secondaryAttributes.map(attribute => attribute.charAt(0).toUpperCase() + attribute.slice(1))
        : Object.entries(secondaryAttributeStates)
          .filter(([_, state]) => state.checked)
          .map(([attr, _]) => attr.charAt(0).toUpperCase() + attr.slice(1));
      const characterAttributes = generatedData.character?.attributes || finalAttributes;

      const characterData = {
        race: generatedData.selectedRace,
        characterClass: generatedData.selectedClass,
        gender: generatedData.generatedGender,
        age: generatedData.generatedAge,
        height: generatedData.generatedHeight,
        weight: generatedData.generatedWeight,
        description: generatedData.generatedDescription,
        attributes: characterAttributes,
        modifiers: {
          forca: calculateModifier(characterAttributes.forca),
          destreza: calculateModifier(characterAttributes.destreza),
          constituicao: calculateModifier(characterAttributes.constituicao),
          inteligencia: calculateModifier(characterAttributes.inteligencia),
          sabedoria: calculateModifier(characterAttributes.sabedoria),
          carisma: calculateModifier(characterAttributes.carisma)
        },
        totalModifier: generatedData.character?.totalModifier ?? totalModifier,
        primeAttributes: selectedPrimes,
        secondaryAttributes: selectedSecondaries,
        hp: generatedData.generatedHp,
        treasure: generatedData.generatedTreasure,
        carryingCapacity: generatedData.generatedCarryingCapacity,
        spells: ['mago', 'ilusionista', 'clerigo', 'druida'].includes(generatedData.selectedClass)
          ? generatedData.generatedSpells
          : null,
        rollAttempts: generatedData.character?.rollAttempts ?? rollAttempts
      };

      const discordMessage = formatDiscordMessage(characterData);

      const response = await fetch(discordWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordMessage)
      });

      if (response.ok) {
        toast('✅ Personagem enviado para Discord com sucesso!');
      } else {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao enviar para Discord:', error);
      toast('❌ Erro ao enviar para Discord. Verifique o webhook e tente novamente.');
    }
  };

  // Função para criar ficha de personagem
  const handleCreateSheet = () => {
    if (!hp || !selectedRace || !selectedClass) {
      toast.error('Complete todos os detalhes finais antes de criar a ficha');
      return;
    }

    try {
      // Mapear os atributos do construtor para o formato da ficha
      const attributeMapping: Record<string, 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'> = {
        forca: 'str',
        destreza: 'dex',
        constituicao: 'con',
        inteligencia: 'int',
        sabedoria: 'wis',
        carisma: 'cha'
      };

      // Criar estrutura de atributos com tipos (1=primário, 2=secundário, 3=terciário)
      const attributes = {
        str: { value: 10, type: 3 },
        dex: { value: 10, type: 3 },
        con: { value: 10, type: 3 },
        int: { value: 10, type: 3 },
        wis: { value: 10, type: 3 },
        cha: { value: 10, type: 3 }
      };

      Object.entries(attributeMapping).forEach(([ptName, enName]) => {
        let type = 3; // terciário por padrão
        if (primeAttributeStates[ptName]?.checked) {
          type = 1; // primário
        } else if (secondaryAttributeStates[ptName]?.checked) {
          type = 2; // secundário
        }
        attributes[enName] = {
          value: finalAttributes[ptName as keyof CharacterAttributes],
          type
        };
      });

      // Extrair o valor de tesouro (remove " PO" do final)
      const goldAmount = treasure ? Number.parseInt(treasure.replace(' PO', '')) : 0;

      // Calcular encumbrance rating baseado na força e constituição
      const strValue = finalAttributes.forca;
      const strBonus = primeAttributeStates.forca?.checked ? 3 : 0;
      const conBonus = primeAttributeStates.constituicao?.checked ? 3 : 0;
      const rating = strValue + strBonus + conBonus;
      const enc3x = rating * 3;

      // Montar as notas com informações extras
      const notesArray = [];
      if (age) notesArray.push(`Idade: ${age}`);
      if (height) notesArray.push(`Altura: ${height}`);
      if (weight) notesArray.push(`Peso: ${weight}`);
      if (gender) notesArray.push(`Gênero: ${gender}`);
      if (description) notesArray.push(`Traço marcante: ${description}`);
      const notesText = notesArray.join('\n');

      // Criar a ficha básica
      const sheetId = addSheet({
        name: 'Novo Personagem',
        race: selectedRace,
        class: selectedClass,
        level: 1,
        portrait: '',
        type: 'personagem'
      });

      // Calcular XP necessária para o próximo nível (nível 2)
      let nextLevelXp = 0;
      const characterClass = charClasses.find(
        (c) => c.name.toLowerCase() === selectedClass.toLowerCase()
      );
      if (characterClass) {
        const nextLevel = characterClass.levels.find((l) => l.level === 2);
        if (nextLevel) {
          nextLevelXp = nextLevel.experience;
        }
      }

      // Criar character state completo
      const characterData: CharacterState = {
        id: sheetId,
        name: 'Novo Personagem',
        portrait: 'https://i.pinimg.com/736x/29/f9/96/29f996b8d38b9e6d2b3e7cc70df54bcb.jpg',
        attr: attributes,
        ac: {
          head: 0,
          main: 10
        },
        hp: {
          current: Number.parseInt(hp) || 1,
          max: Number.parseInt(hp) || 1,
          temp: 0
        },
        stats: {
          capacity: 0,
          speed: '30ft',
          bth: 0,
        },
        info: {
          charClass: selectedClass,
          race: selectedRace,
          disposition: '',
          level: 1,
          xp: 0,
          nextLevel: nextLevelXp,
          languages: 'Comum',
        },
        armor: {
          helm: '',
          main: '',
          shield: '',
          magicalItem: '',
        },
        treasure: {
          platinum: 0,
          gold: goldAmount,
          silver: 0,
          copper: 0,
        },
        encumbrance: {
          total: 0,
          rating: rating,
          enc3x: enc3x,
        },
        tracking: {
          water: 0,
          food: 0,
          arrows: 0,
          torches: 0,
          conditions: ''
        },
        abilities: [],
        notes: notesText
      };

      // Preparar magias conhecidas se houver
      const spellsData = {
        level: {
          lv0: 0,
          lv1: 0,
          lv2: 0,
          lv3: 0,
          lv4: 0,
          lv5: 0,
          lv6: 0,
          lv7: 0,
          lv8: 0,
          lv9: 0,
        },
        known: [] as Array<{
          id: string;
          name: string;
          level: number;
          slots: number;
          description: string;
        }>
      };

      if (showSpells && (spells.level0.length > 0 || spells.level1.length > 0)) {
        spells.level0.forEach((spellName, index) => {
          spellsData.known.push({
            id: `spell-0-${index}`,
            name: spellName,
            level: 0,
            slots: 0,
            description: ''
          });
        });
        spells.level1.forEach((spellName, index) => {
          spellsData.known.push({
            id: `spell-1-${index}`,
            name: spellName,
            level: 1,
            slots: 0,
            description: ''
          });
        });
      }

      // Preparar inventário vazio
      const inventoryData = {
        weapons: [],
        equipments: [],
        items: []
      };

      // Salvar o character completo
      saveCharacterToStorage(characterData, spellsData, inventoryData);

      toast.success('Ficha criada com sucesso!');

      // Redirecionar para a página da ficha
      router.push(`/fichas/${sheetId}`);
    } catch (error) {
      console.error('Erro ao criar ficha:', error);
      toast.error('Erro ao criar ficha');
    }
  };

  // Contar atributos prime selecionados
  const selectedPrimeCount = Object.values(primeAttributeStates).filter(state => state.checked).length;
  const selectedSecondaryCount = Object.values(secondaryAttributeStates).filter(state => state.checked).length;
  const maxPrimes = getMaxPrimeAttributes();

  // Lógica de habilitação de abas
  const canAccessStep2 = canSelectRaceClass;
  const canAccessStep3 = selectedRace !== '' && selectedClass !== '';
  const canAccessStep4 = canAccessStep3 && selectedPrimeCount >= Math.min(2, maxPrimes) && selectedSecondaryCount === 2;
  const canAccessStep5 = canAccessStep4; // Realocação é opcional, então pode pular
  const markdownRaceName = charRaces.find(race => race.id === selectedRace)?.name.split(' (')[0] || selectedRace;
  const markdownClassData = charClasses.find(characterClass => characterClass.id === selectedClass);
  const nextLevelExperience = markdownClassData?.levels.find(level => level.level === 2)?.experience ?? 0;
  const firstLevelData = markdownClassData?.levels.find(level => level.level === 1);
  const markdownAttributes: [string, keyof CharacterAttributes][] = [
    ['FOR', 'forca'],
    ['DeS', 'destreza'],
    ['Con', 'constituicao'],
    ['Int', 'inteligencia'],
    ['SAB', 'sabedoria'],
    ['CAR', 'carisma']
  ];
  const markdownPrimaryAttributes = new Set(
    markdownAttributes
      .filter(([, attribute]) => primeAttributeStates[attribute].checked)
      .map(([, attribute]) => attribute)
  );
  const markdownAttributeHeaders = markdownAttributes.map(([label, attribute]) => {
    const marker = markdownPrimaryAttributes.has(attribute)
      ? '▲'
      : secondaryAttributeStates[attribute].checked
        ? '●'
        : '';
    return `**${label}${marker}**`;
  });
  const markdownAttributeValues = markdownAttributes.map(([, attribute]) => `${finalAttributes[attribute]}`);
  const formatMarkdownSpellList = (level: number, spellList: string[]) => {
    return spellList.map(spell => `[${level}] [[${spell}]]`).join('\n');
  };
  const markdownLevelZeroSpells = showSpells ? formatMarkdownSpellList(0, spells.level0) : '';
  const markdownLevelOneSpells = showSpells ? formatMarkdownSpellList(1, spells.level1) : '';
  const spellSlotBaseCounts: Record<string, { level0: number; level1: number; bonusAttribute: keyof CharacterAttributes }> = {
    clerigo: { level0: 3, level1: 1, bonusAttribute: 'sabedoria' },
    druida: { level0: 3, level1: 1, bonusAttribute: 'sabedoria' },
    ilusionista: { level0: 4, level1: 2, bonusAttribute: 'inteligencia' },
    mago: { level0: 4, level1: 2, bonusAttribute: 'inteligencia' }
  };
  const spellSlotBaseCount = spellSlotBaseCounts[selectedClass];
  const markdownSpellSlots = spellSlotBaseCount
    ? [
      spellSlotBaseCount.level0,
      spellSlotBaseCount.level1 + (calculateModifier(finalAttributes[spellSlotBaseCount.bonusAttribute]) > 0 ? 1 : 0),
      ...Array<number>(8).fill(0)
    ]
    : Array<number>(10).fill(0);
  const markdownGold = treasure ? treasure.replace(/\s*PO$/, '') : '[preencher]';
  const markdownDexterityModifier = calculateModifier(finalAttributes.destreza);
  const markdownArmorClass = 10 + markdownDexterityModifier;
  const markdownMovement = ['anao', 'gnomo', 'pequenino'].includes(selectedRace) ? '20ft' : '30ft';
  const markdownEncumbranceRating = finalAttributes.forca
    + (markdownPrimaryAttributes.has('forca') ? 3 : 0)
    + (markdownPrimaryAttributes.has('constituicao') ? 3 : 0);
  const markdownSummary = [
    `[[${markdownRaceName}]] | [[${markdownClassData?.name || selectedClass}]] | **AL:** [preencher] | **NV** 1 | **XP:** 0 / ${nextLevelExperience}`,
    '',
    `| ${markdownAttributeHeaders.join(' | ')} |`,
    '| ----- | -------- | -------- | ------- | ---------- | -------- |',
    `| ${markdownAttributeValues.join(' | ')} |`,
    '',
    `**PV** ${hp || '[preencher]'}/${hp || '[preencher]'} | **CA** ${markdownArmorClass} | **BBA** ${firstLevelData?.attackBonus || '[preencher]'} | **MOV** ${markdownMovement}`,
    '- **Línguas** comum,',
    '---',
    `**Equipamentos** (0/${markdownEncumbranceRating})`,
    `- ${markdownGold} ouro`,
    '**Mochila** (0/8)',
    '- [preencher item da mochila]',
    '---',
    '**Magias Conhecidas**',
    markdownLevelZeroSpells,
    markdownLevelOneSpells,
    '',
    '**Magias Memorizadas**',
    '[0]',
    '[1]',
    '',
    '| 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    `| ${markdownSpellSlots.map(count => count || '').join(' | ')} |`,
    '',
    '---',
    '**Background**',
    `- Idade: ${age || '[preencher]'}`,
    `- Altura: ${height || '[preencher]'}`,
    `- Peso: ${weight || '[preencher]'}`,
    `- Gênero: ${gender || '[preencher]'}`,
    `- Traço marcante: ${description || '[preencher]'}`
  ].join('\n');

  return (
    <div className="flex flex-col gap-8 pt-8 max-w-4xl mx-auto">
      <div className="flex gap-2">
        <SidebarTrigger />
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance">Construtor de aventureiro</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="step1">
            <span className="md:hidden">1.</span>
            <span className="hidden md:block">
              1. Atributos
            </span>
          </TabsTrigger>
          <TabsTrigger value="step2" disabled={!canAccessStep2}>
            <span className="md:hidden">2.</span>
            <span className="hidden md:block">
              2. Raça/Classe
            </span>
          </TabsTrigger>
          <TabsTrigger value="step3" disabled={!canAccessStep3}>
            <span className="md:hidden">3.</span>
            <span className="hidden md:block">
              3. Atrib. Primários
            </span>
          </TabsTrigger>
          <TabsTrigger value="step4" disabled={!canAccessStep4}>
            <span className="md:hidden">4.</span>
            <span className="hidden md:block">
              4. Realocar Pontos
            </span>
          </TabsTrigger>
          <TabsTrigger value="step5" disabled={!canAccessStep5}>
            <span className="md:hidden">5.</span>
            <span className="hidden md:block">
              5. Detalhes Finais
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Aba 1: Rolar Atributos */}
        <TabsContent value="step1" className="space-y-6">
          <h2 className="text-xl font-semibold">1. Role os atributos</h2>

          <div id="attributes" className="grid grid-cols-3 gap-4">
            <CharGen.NumberInput
              label="Força"
              id="strength"
              value={baseAttributes.forca}
              onChange={(val) => {
                const newBase = { ...baseAttributes, forca: val };
                setBaseAttributes(newBase);
              }}
            />
            <CharGen.NumberInput
              label="Destreza"
              id="dexterity"
              value={baseAttributes.destreza}
              onChange={(val) => {
                const newBase = { ...baseAttributes, destreza: val };
                setBaseAttributes(newBase);
              }}
            />
            <CharGen.NumberInput
              label="Constituição"
              id="constituicao"
              value={baseAttributes.constituicao}
              onChange={(val) => {
                const newBase = { ...baseAttributes, constituicao: val };
                setBaseAttributes(newBase);
              }}
            />
            <CharGen.NumberInput
              label="Inteligência"
              id="intelligence"
              value={baseAttributes.inteligencia}
              onChange={(val) => {
                const newBase = { ...baseAttributes, inteligencia: val };
                setBaseAttributes(newBase);
              }}
            />
            <CharGen.NumberInput
              label="Sabedoria"
              id="wisdom"
              value={baseAttributes.sabedoria}
              onChange={(val) => {
                const newBase = { ...baseAttributes, sabedoria: val };
                setBaseAttributes(newBase);
              }}
            />
            <CharGen.NumberInput
              label="Carisma"
              id="charisma"
              value={baseAttributes.carisma}
              onChange={(val) => {
                const newBase = { ...baseAttributes, carisma: val };
                setBaseAttributes(newBase);
              }}
            />
          </div>

          <div className="flex gap-4 items-center justify-between flex-wrap">
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                onClick={handleRollAttributes}
              >
                Rolar atributos (3d6)
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleRollAttributes4d6}
              >
                Rolar atributos (4d6)
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleQuickCharacter}
              >
                Gerar personagem rápido
              </Button>
            </div>
            <p className="flex gap-1">
              <span>Tentativas:</span>
              <Badge>{rollAttempts}x</Badge>
            </p>
          </div>

          {canAccessStep2 && (
            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("step2")}>
                Próxima etapa →
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Aba 2: Raça e Classe */}
        <TabsContent value="step2" className="space-y-6">
          <h2 className="text-xl font-semibold">2. Selecione raça e classe</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CharGen.TextSelect
              placeholder="Selecione uma raça"
              label="Raça"
              values={charRaces}
              value={selectedRace ?? ''}
              disabled={!canSelectRaceClass}
              onChange={(raceId) => {
                setSelectedRace(raceId);
              }}
            />
            <CharGen.TextSelect
              placeholder="Selecione uma classe"
              label="Classe"
              values={charClasses}
              value={selectedClass ?? ''}
              disabled={!canSelectRaceClass}
              onChange={(classId) => {
                setSelectedClass(classId);
              }}
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("step1")}>
              ← Voltar
            </Button>
            {canAccessStep3 && (
              <Button onClick={() => setActiveTab("step3")}>
                Próxima etapa →
              </Button>
            )}
          </div>
        </TabsContent>

        {/* Aba 3: Atributos Primários */}
        <TabsContent value="step3" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">
              <span>3. Selecionar Atributos Primários: </span>
              <Badge variant={selectedPrimeCount > maxPrimes ? 'destructive' : 'default'}>
                {selectedPrimeCount}/{maxPrimes}
              </Badge>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {Object.entries(primeAttributeStates).map(([attr, state]) => {
                const isRequired = Boolean(selectedClass &&
                  (primeAttributes[selectedClass] || []).includes(attr));
                const isDisabled = Boolean(isRequired);

                return (
                  <LabeledCheckbox
                    key={attr}
                    id={`primary-${attr}`}
                    value={state.checked}
                    label={state.label}
                    onChange={() => togglePrimeAttribute(attr)}
                    disabled={isDisabled}
                    required={isRequired}
                  />
                );
              })}
            </div>
          </div>

          <hr />

          <div>
            <h2 className="text-xl font-semibold">
              <span>Selecionar Atributos Secundários: </span>
              <Badge variant={selectedSecondaryCount !== 2 ? 'destructive' : 'default'}>
                {selectedSecondaryCount}/2
              </Badge>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Escolha exatamente 2 atributos secundários (não podem ser primários)
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {Object.entries(secondaryAttributeStates).map(([attr, state]) => {
                const isPrime = primeAttributeStates[attr].checked;
                const isDisabled = isPrime;

                return (
                  <LabeledCheckbox
                    key={attr}
                    id={`secondary-${attr}`}
                    value={state.checked}
                    label={state.label}
                    onChange={() => toggleSecondaryAttribute(attr)}
                    disabled={isDisabled}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("step2")}>
              ← Voltar
            </Button>
            {canAccessStep4 && (
              <Button onClick={() => setActiveTab("step4")}>
                Próxima etapa →
              </Button>
            )}
          </div>
        </TabsContent>

        {/* Aba 4: Realocar Pontos */}
        <TabsContent value="step4" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">4. Realocar pontos de atributo (opcional)</h2>
            <p className="text-sm text-muted-foreground mt-1">
              A cada 2 pontos retirados de um atributo, você pode adicionar 1 ponto em um atributo primário. Nenhum atributo pode ficar abaixo de 9.
            </p>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            {Object.entries(pointAdjustments).map(([attr, adjustment]) => {
              const attrKey = attr as keyof CharacterAttributes;
              const attrLabel = {
                forca: 'Força',
                destreza: 'Destreza',
                constituicao: 'Constituição',
                inteligencia: 'Inteligência',
                sabedoria: 'Sabedoria',
                carisma: 'Carisma'
              }[attr];

              const isPrime = primeAttributeStates[attr]?.checked;
              const attributesWithRacialBonus = getAttributesWithRacialBonus();
              const baseValueWithRacialBonus = attributesWithRacialBonus[attrKey];
              const baseValue = baseAttributes[attrKey];
              const currentValue = finalAttributes[attrKey];
              const minValue = 9;

              // Usar o valor com bônus racial como base para calcular máximo de redução
              const maxDecrease = Math.floor((baseValueWithRacialBonus - minValue) / 2) * 2; // Sempre par

              // Calcular quantos pontos podem ser adicionados (baseado em pontos removidos de outros)
              const totalPointsRemoved = Object.entries(pointAdjustments)
                .filter(([key]) => key !== attr)
                .reduce((sum, [, val]) => sum + Math.abs(Math.min(0, val)), 0);
              const availablePointsToAdd = Math.floor(totalPointsRemoved / 2);

              return (
                <div key={attr} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{attrLabel}</span>
                      {isPrime && <Badge variant="default" className="text-xs">Prime</Badge>}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Base: {baseValue}
                      {baseValueWithRacialBonus !== baseValue && (
                        <span className="text-blue-600"> (+{baseValueWithRacialBonus - baseValue} racial = {baseValueWithRacialBonus})</span>
                      )}
                      {' '}→ Atual: {currentValue}
                      {adjustment !== 0 && (
                        <span className={adjustment > 0 ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                          ({adjustment > 0 ? '+' : ''}{adjustment})
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {/* Botão para remover pontos */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newAdjustments = { ...pointAdjustments };
                        newAdjustments[attr] = Math.max(adjustment - 2, -maxDecrease);
                        setPointAdjustments(newAdjustments);
                      }}
                      disabled={adjustment <= -maxDecrease || maxDecrease <= 0}
                    >
                      -2
                    </Button>

                    {/* Botão para adicionar pontos (só para prime e se tiver pontos disponíveis) */}
                    {isPrime && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newAdjustments = { ...pointAdjustments };
                          newAdjustments[attr] = adjustment + 1;
                          setPointAdjustments(newAdjustments);
                        }}
                        disabled={adjustment >= availablePointsToAdd}
                      >
                        +1
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
            <h3 className="font-semibold mb-2">Resumo da Realocação</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Pontos removidos:</span>{' '}
                {Object.values(pointAdjustments).reduce((sum, val) => sum + Math.abs(Math.min(0, val)), 0)}
              </p>
              <p>
                <span className="font-medium">Pontos adicionados:</span>{' '}
                {Object.values(pointAdjustments).reduce((sum, val) => sum + Math.max(0, val), 0)}
              </p>
              <p>
                <span className="font-medium">Pontos disponíveis para prime:</span>{' '}
                {Math.floor(Object.values(pointAdjustments).reduce((sum, val) => sum + Math.abs(Math.min(0, val)), 0) / 2) -
                  Object.values(pointAdjustments).reduce((sum, val) => sum + Math.max(0, val), 0)}
              </p>
            </div>
          </div>

          {/* Botão para resetar todas as realocações */}
          {Object.values(pointAdjustments).some(val => val !== 0) && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setPointAdjustments({
                    forca: 0,
                    destreza: 0,
                    constituicao: 0,
                    inteligencia: 0,
                    sabedoria: 0,
                    carisma: 0
                  });
                }}
              >
                Resetar Realocações
              </Button>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("step3")}>
              ← Voltar
            </Button>
            <Button onClick={() => setActiveTab("step5")}>
              Próxima etapa →
            </Button>
          </div>
        </TabsContent>

        {/* Aba 5: Detalhes Finais */}
        <TabsContent value="step5" className="space-y-6">
          <h2 className="text-xl font-semibold">5. Rolar detalhes finais e feitiços aprendidos</h2>

          <Button
            onClick={() => handleRollFinalDetails()}
            disabled={!canRollFinalDetails}
          >
            Rolar detalhes finais
          </Button>

          {showSpells && spells.level0.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Magias Conhecidas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Nível 0 ({spells.level0.length})</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {spells.level0.map((spell) => (
                      <li key={spell}>{spell}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Nível 1 ({spells.level1.length})</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {spells.level1.map((spell) => (
                      <li key={spell}>{spell}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CharGen.TextInput disabled label="PV" id="hp" value={hp} />
            <CharGen.TextInput disabled label="Tesouro inicial" id="treasure" value={treasure} />
            <CharGen.TextInput disabled label="Idade" id="age" value={age} />
            <CharGen.TextInput disabled label="Altura" id="height" value={height} />
            <CharGen.TextInput disabled label="Peso" id="weight" value={weight} />
            <CharGen.TextInput disabled label="Gênero" id="gender" value={gender} />
            <CharGen.TextInput disabled label="Traço marcante" id="description" value={description} />
            <CharGen.TextInput disabled label="Sobrecarga" id="carryingCapacity" value={carryingCapacity} />
          </div>

          <div className="flex justify-between flex-wrap gap-2">
            <Button variant="outline" onClick={() => setActiveTab("step4")}>
              ← Voltar
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleResetCharacter}>
                Começar de novo
              </Button>
              <Button variant="outline" onClick={handleQuickCharacter}>
                Gerar personagem rápido
              </Button>
              <Button onClick={handleCreateSheet}>
                Criar ficha
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Resumo dos Atributos Finais - Fixo abaixo das abas */}
      {canSelectRaceClass && (
        <div className="border rounded-lg p-6 bg-muted/50 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Resumo do Personagem</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Raça:</span>
                <Badge variant="secondary">{selectedRace || 'Não selecionada'}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Classe:</span>
                <Badge variant="secondary">{selectedClass || 'Não selecionada'}</Badge>
              </div>
            </div>
          </div>

          {(selectedPrimeCount > 0 || selectedSecondaryCount > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedPrimeCount > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">⭐ Atributos Primários</h4>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(primeAttributeStates)
                      .filter(([_, state]) => state.checked)
                      .map(([attr, state]) => (
                        <Badge key={attr} variant="default" className="text-xs">
                          {state.label}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
              {selectedSecondaryCount > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">⚡ Atributos Secundários</h4>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(secondaryAttributeStates)
                      .filter(([_, state]) => state.checked)
                      .map(([attr, state]) => (
                        <Badge key={attr} variant="outline" className="text-xs">
                          {state.label}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium mb-3">Atributos Finais (com bônus racial)</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground mb-1">FOR</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg font-bold">
                    {finalAttributes.forca}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({calculateModifier(finalAttributes.forca) >= 0 ? '+' : ''}{calculateModifier(finalAttributes.forca)})
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground mb-1">DES</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg font-bold">
                    {finalAttributes.destreza}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({calculateModifier(finalAttributes.destreza) >= 0 ? '+' : ''}{calculateModifier(finalAttributes.destreza)})
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground mb-1">CON</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg font-bold">
                    {finalAttributes.constituicao}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({calculateModifier(finalAttributes.constituicao) >= 0 ? '+' : ''}{calculateModifier(finalAttributes.constituicao)})
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground mb-1">INT</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg font-bold">
                    {finalAttributes.inteligencia}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({calculateModifier(finalAttributes.inteligencia) >= 0 ? '+' : ''}{calculateModifier(finalAttributes.inteligencia)})
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground mb-1">SAB</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg font-bold">
                    {finalAttributes.sabedoria}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({calculateModifier(finalAttributes.sabedoria) >= 0 ? '+' : ''}{calculateModifier(finalAttributes.sabedoria)})
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground mb-1">CAR</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg font-bold">
                    {finalAttributes.carisma}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({calculateModifier(finalAttributes.carisma) >= 0 ? '+' : ''}{calculateModifier(finalAttributes.carisma)})
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <p className="flex gap-2 items-center">
                <span className="text-sm">Modificador Total:</span>
                <Badge variant={totalModifier < 0 ? 'destructive' : totalModifier > 0 ? 'default' : 'secondary'}>
                  {totalModifier > 0 ? `+${totalModifier}` : totalModifier}
                </Badge>
              </p>
            </div>
          </div>

          <div className="border-t pt-6 space-y-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h4 className="text-sm font-medium">Markdown para Obsidian</h4>
              <Button
                type="button"
                variant="outline"
                disabled={!canAccessStep3 || !hp}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(markdownSummary);
                    toast.success('Resumo copiado em Markdown.');
                  } catch (error) {
                    console.error('Erro ao copiar o resumo em Markdown:', error);
                    toast.error('Não foi possível copiar o resumo. Verifique as permissões da área de transferência.');
                  }
                }}
              >
                Copiar Markdown
              </Button>
            </div>
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-background p-4 text-sm">
              {markdownSummary}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
