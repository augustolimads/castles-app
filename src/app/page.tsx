"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import * as CharGen from "@/modules/char-gen/ui";
import { LabeledCheckbox } from "@/modules/char-gen/ui/labeled-checkbox";
import { charClasses } from "@/modules/data/charClasses";
import { charRaces } from "@/modules/data/charRaces";
import {
  ageFormulas,
  calculateModifier,
  CharacterAttributes,
  generatePhysicalStats,
  hpFormula,
  primeAttributes,
  racialBonuses,
  spellCount,
  spellsByClass,
  treasureFormula
} from "@/modules/data/gameData";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  // Estados do personagem
  const [baseAttributes, setBaseAttributes] = useState<CharacterAttributes>({
    forca: 10,
    inteligencia: 10,
    sabedoria: 10,
    destreza: 10,
    constitution: 10,
    carisma: 10
  });
  const [finalAttributes, setFinalAttributes] = useState<CharacterAttributes>({ ...baseAttributes });
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [rollAttempts, setRollAttempts] = useState(0);
  const [totalModifier, setTotalModifier] = useState(0);
  const [primeAttributeStates, setPrimeAttributeStates] = useState<Record<string, { label: string; checked: boolean }>>({
    forca: {
      label: 'Força',
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
    destreza: {
      label: 'Destreza',
      checked: false
    },
    constitution: {
      label: 'Constituição',
      checked: false
    },
    carisma: {
      label: 'Carisma',
      checked: false
    }
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
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [isCharacterComplete, setIsCharacterComplete] = useState(false);

  // Estados de controle
  const [canSelectRaceClass, setCanSelectRaceClass] = useState(false);
  const [canRollFinalDetails, setCanRollFinalDetails] = useState(false);
  const [showSpells, setShowSpells] = useState(false);

  // Efeito para carregar webhook do localStorage
  useEffect(() => {
    const savedWebhook = localStorage.getItem('discordWebhook');
    if (savedWebhook) {
      setDiscordWebhook(savedWebhook);
    }
  }, []);

  // Efeito para salvar webhook no localStorage
  useEffect(() => {
    if (discordWebhook.trim()) {
      localStorage.setItem('discordWebhook', discordWebhook);
    }
  }, [discordWebhook]);

  // Efeito para aplicar bônus racial e calcular modificador total
  useEffect(() => {
    let newAttributes = { ...baseAttributes };

    if (selectedRace && racialBonuses[selectedRace.toLowerCase()]) {
      const raceKey = selectedRace.toLowerCase().split(' ')[0]; // pegar primeira palavra
      const bonuses = racialBonuses[raceKey];
      if (bonuses) {
        Object.keys(bonuses).forEach(attr => {
          const attrKey = attr as keyof CharacterAttributes;
          if (bonuses[attrKey] !== undefined) {
            newAttributes[attrKey] += bonuses[attrKey]!;
          }
        });
      }
    }

    setFinalAttributes(newAttributes);

    // Calcular modificador total
    const totalMod = Object.values(newAttributes).reduce((sum, value) => {
      return sum + calculateModifier(value);
    }, 0);
    setTotalModifier(totalMod);
  }, [baseAttributes, selectedRace]);

  // Efeito para verificar se pode rolar detalhes finais
  useEffect(() => {
    setCanRollFinalDetails(selectedRace !== '' && selectedClass !== '');
  }, [selectedRace, selectedClass]);

  // Efeito para mostrar magias se for classe conjuradora
  useEffect(() => {
    if (selectedClass) {
      setShowSpells(['mago', 'ilusionista', 'clerigo', 'druida'].includes(selectedClass));
    } else {
      setShowSpells(false);
    }
  }, [selectedClass]);

  // Efeito para verificar se o personagem está completo
  useEffect(() => {
    const complete = Boolean(
      selectedRace &&
      selectedClass &&
      hp &&
      age &&
      height &&
      weight
    );
    setIsCharacterComplete(complete);
  }, [selectedRace, selectedClass, hp, age, height, weight]);

  // Efeito para marcar atributos prime da classe automaticamente
  useEffect(() => {
    if (selectedClass) {
      // Para todas as raças, sempre marca os atributos prime obrigatórios da classe
      const classKey = selectedClass;
      const primes = primeAttributes[classKey] || [];

      const newPrimeStates = { ...primeAttributeStates };

      // Sempre garante que os atributos prime da classe estejam marcados
      primes.forEach(attr => {
        newPrimeStates[attr].checked = true;
      });

      setPrimeAttributeStates(newPrimeStates);
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

    setPrimeAttributeStates(prev => ({
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

  // Função para rolar atributos
  const handleRollAttributes = () => {
    const newAttributes: CharacterAttributes = {
      forca: new DiceRoll('3d6').total,
      inteligencia: new DiceRoll('3d6').total,
      sabedoria: new DiceRoll('3d6').total,
      destreza: new DiceRoll('3d6').total,
      constitution: new DiceRoll('3d6').total,
      carisma: new DiceRoll('3d6').total
    };

    setBaseAttributes(newAttributes);
    setCanSelectRaceClass(true);
    setRollAttempts(prev => prev + 1);
  };

  // Função para rolar detalhes finais
  const handleRollFinalDetails = () => {
    const classKey = selectedClass; // já é o ID da classe
    const raceKey = selectedRace.toLowerCase().split(' ')[0];

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
      const conMod = calculateModifier(finalAttributes.constitution);
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

    // Calcular idade
    if (ageFormulas[raceKey]) {
      const ageData = ageFormulas[raceKey][classKey] || ageFormulas[raceKey]['default'];
      if (ageData) {
        const ageRoll = new DiceRoll(ageData.dice);
        const totalAge = ageData.base + ageRoll.total;
        generatedAge = `${totalAge} anos`;
        setAge(generatedAge);
      }
    }

    // Gerar características físicas
    const genders = ['masc.', 'fem.'];
    generatedGender = genders[Math.floor(Math.random() * genders.length)];
    setGender(generatedGender);

    const physicalStats = generatePhysicalStats(raceKey, generatedGender);
    generatedHeight = physicalStats.height;
    generatedWeight = physicalStats.weight;
    generatedDescription = physicalStats.description;
    setHeight(generatedHeight);
    setWeight(generatedWeight);
    setDescription(generatedDescription);

    // Calcular capacidade de carga
    generatedCarryingCapacity = finalAttributes.forca.toString();
    setCarryingCapacity(generatedCarryingCapacity);

    // Gerar magias se for classe conjuradora
    if (showSpells && spellsByClass[classKey as keyof typeof spellsByClass]) {
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
      setSpells(generatedSpells);
    }

    // Enviar automaticamente para Discord se webhook estiver configurado
    if (discordWebhook.trim()) {
      // Usar os dados gerados localmente ao invés de depender dos estados
      setTimeout(() => {
        sendToDiscordWithData({
          selectedRace,
          selectedClass,
          generatedHp,
          generatedAge,
          generatedHeight,
          generatedWeight,
          generatedGender,
          generatedDescription,
          generatedTreasure,
          generatedCarryingCapacity,
          generatedSpells
        });
      }, 100);
    }
  };

  // Função para formatar mensagem do Discord
  const formatDiscordMessage = (characterData: any) => {
    const { race, characterClass, gender, age, height, weight, description, attributes, modifiers, totalModifier, primeAttributes, hp, treasure, carryingCapacity, spells, rollAttempts } = characterData;

    const embed = {
      color: parseInt("237feb", 16), // Converter hex para decimal
      title: "🎲 NOVO PERSONAGEM GERADO 🎲",
      description: `**Raça:** ${race}\n**Classe:** ${characterClass}`,
      fields: [
        {
          name: "📊 ATRIBUTOS",
          value: `**FOR:** ${attributes.forca} (${modifiers.forca >= 0 ? '+' : ''}${modifiers.forca})\n` +
            `**INT:** ${attributes.inteligencia} (${modifiers.inteligencia >= 0 ? '+' : ''}${modifiers.inteligencia})\n` +
            `**SAB:** ${attributes.sabedoria} (${modifiers.sabedoria >= 0 ? '+' : ''}${modifiers.sabedoria})\n` +
            `**DES:** ${attributes.destreza} (${modifiers.destreza >= 0 ? '+' : ''}${modifiers.destreza})\n` +
            `**CON:** ${attributes.constitution} (${modifiers.constitution >= 0 ? '+' : ''}${modifiers.constitution})\n` +
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
          name: "📋 DETALHES",
          value: `**PV:** ${hp}\n` +
            `**Tesouro:** ${treasure}\n` +
            `**Idade:** ${age}\n` +
            `**Gênero:** ${gender}\n` +
            `**Descrição:** ${description}\n` +
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
  }) => {
    if (!discordWebhook.trim()) {
      return; // Não faz nada se não há webhook
    }

    try {
      const selectedPrimes = Object.entries(primeAttributeStates)
        .filter(([_, state]) => state.checked)
        .map(([attr, _]) => attr.charAt(0).toUpperCase() + attr.slice(1));

      const characterData = {
        race: generatedData.selectedRace,
        characterClass: generatedData.selectedClass,
        gender: generatedData.generatedGender,
        age: generatedData.generatedAge,
        height: generatedData.generatedHeight,
        weight: generatedData.generatedWeight,
        description: generatedData.generatedDescription,
        attributes: finalAttributes,
        modifiers: {
          forca: calculateModifier(finalAttributes.forca),
          inteligencia: calculateModifier(finalAttributes.inteligencia),
          sabedoria: calculateModifier(finalAttributes.sabedoria),
          destreza: calculateModifier(finalAttributes.destreza),
          constitution: calculateModifier(finalAttributes.constitution),
          carisma: calculateModifier(finalAttributes.carisma)
        },
        totalModifier: totalModifier,
        primeAttributes: selectedPrimes,
        hp: generatedData.generatedHp,
        treasure: generatedData.generatedTreasure,
        carryingCapacity: generatedData.generatedCarryingCapacity,
        spells: showSpells ? generatedData.generatedSpells : null,
        rollAttempts: rollAttempts
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

  // Contar atributos prime selecionados
  const selectedPrimeCount = Object.values(primeAttributeStates).filter(state => state.checked).length;
  const maxPrimes = getMaxPrimeAttributes();

  return (
    <div className="flex flex-col gap-8 pt-8">
      <div className="flex gap-2">
        <SidebarTrigger />
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance">C&C: Gerador de personagem</h1>
      </div>

      <CharGen.TextInput
        label="Webhook do Discord"
        id="discordWebhook"
        value={discordWebhook}
        onChange={setDiscordWebhook}
      />

      <div id="attributes" className="grid grid-cols-3 gap-4">
        <CharGen.NumberInput
          label="Força"
          id="strength"
          value={finalAttributes.forca}
          onChange={(val) => {
            const newBase = { ...baseAttributes, forca: val };
            setBaseAttributes(newBase);
          }}
        />
        <CharGen.NumberInput
          label="Inteligência"
          id="intelligence"
          value={finalAttributes.inteligencia}
          onChange={(val) => {
            const newBase = { ...baseAttributes, inteligencia: val };
            setBaseAttributes(newBase);
          }}
        />
        <CharGen.NumberInput
          label="Sabedoria"
          id="wisdom"
          value={finalAttributes.sabedoria}
          onChange={(val) => {
            const newBase = { ...baseAttributes, sabedoria: val };
            setBaseAttributes(newBase);
          }}
        />
        <CharGen.NumberInput
          label="Destreza"
          id="dexterity"
          value={finalAttributes.destreza}
          onChange={(val) => {
            const newBase = { ...baseAttributes, destreza: val };
            setBaseAttributes(newBase);
          }}
        />
        <CharGen.NumberInput
          label="Constituição"
          id="constitution"
          value={finalAttributes.constitution}
          onChange={(val) => {
            const newBase = { ...baseAttributes, constitution: val };
            setBaseAttributes(newBase);
          }}
        />
        <CharGen.NumberInput
          label="Carisma"
          id="charisma"
          value={finalAttributes.carisma}
          onChange={(val) => {
            const newBase = { ...baseAttributes, carisma: val };
            setBaseAttributes(newBase);
          }}
        />
      </div>

      <div className="flex gap-4 items-center justify-between">
        <Button
          type="button"
          onClick={handleRollAttributes}
        >
          Rolar atributos
        </Button>
        <div className="flex gap-10">
          <p className="flex gap-1">
            <span>Mod. total:</span>
            <Badge variant={totalModifier < 0 ? 'destructive' : totalModifier > 0 ? 'default' : 'secondary'}>
              {totalModifier > 0 ? `+${totalModifier}` : totalModifier}
            </Badge>
          </p>
          <p className="flex gap-1">
            <span>Tentativas:</span>
            <Badge>{rollAttempts}x</Badge>
          </p>
        </div>
      </div>

      <hr />

      <div className="grid grid-cols-2 gap-4">
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

      <div>
        <p><span>Atributos Prime selecionados:</span> <Badge variant={selectedPrimeCount > maxPrimes ? 'destructive' : 'default'}>{selectedPrimeCount}/{maxPrimes}</Badge></p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {Object.entries(primeAttributeStates).map(([attr, state]) => {
            // Atributos obrigatórios da classe se aplicam a todas as raças
            const isRequired = Boolean(selectedClass &&
              (primeAttributes[selectedClass] || []).includes(attr));
            const isDisabled = Boolean(isRequired);

            return (
              <LabeledCheckbox
                key={attr}
                value={state.checked}
                label={state.label}
                onChange={() => togglePrimeAttribute(attr)}
                disabled={isDisabled}
                required={isRequired}
              />
            );
          })}
        </div>

        <Button
          className="mt-4"
          onClick={handleRollFinalDetails}
          disabled={!canRollFinalDetails}
        >
          Rolar detalhes finais
        </Button>
      </div>

      {showSpells && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Magias Conhecidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Nível 0 ({spells.level0.length})</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {spells.level0.map((spell, idx) => (
                  <li key={idx}>{spell}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Nível 1 ({spells.level1.length})</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {spells.level1.map((spell, idx) => (
                  <li key={idx}>{spell}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <hr />

      <div className="grid grid-cols-4 gap-4">
        <CharGen.TextInput disabled label="PV" id="hp" value={hp} />
        <CharGen.TextInput disabled label="Tesouro inicial" id="treasure" value={treasure} />
        <CharGen.TextInput disabled label="Idade" id="age" value={age} />
        <CharGen.TextInput disabled label="Altura" id="height" value={height} />
        <CharGen.TextInput disabled label="Peso" id="weight" value={weight} />
        <CharGen.TextInput disabled label="Gênero" id="gender" value={gender} />
        <CharGen.TextInput disabled label="Descrição" id="description" value={description} />
        <CharGen.TextInput disabled label="Sobrecarga" id="carryingCapacity" value={carryingCapacity} />
      </div>
    </div>
  );
}
