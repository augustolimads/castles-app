"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as CharGen from "@/modules/char-gen";
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

export default function Home() {
  // Estados do personagem
  const [playerName, setPlayerName] = useState('');
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
  const [primeAttributeStates, setPrimeAttributeStates] = useState<Record<string, boolean>>({
    forca: false,
    inteligencia: false,
    sabedoria: false,
    destreza: false,
    constitution: false,
    carisma: false
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
  const [canRollAttributes, setCanRollAttributes] = useState(false);
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

  // Efeito para verificar se pode rolar atributos
  useEffect(() => {
    setCanRollAttributes(playerName.trim().length > 0);
  }, [playerName]);

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
      playerName.trim() &&
      selectedRace &&
      selectedClass &&
      hp &&
      age &&
      height &&
      weight
    );
    setIsCharacterComplete(complete);
  }, [playerName, selectedRace, selectedClass, hp, age, height, weight]);

  // Efeito para marcar atributos prime da classe automaticamente
  useEffect(() => {
    if (selectedClass) {
      // Para classes não-humanas, sempre marca os atributos prime obrigatórios da classe
      const classKey = selectedClass;
      const primes = primeAttributes[classKey] || [];

      const newPrimeStates = { ...primeAttributeStates };

      // Se for humano, permite escolha livre completa
      if (selectedRace.toLowerCase().startsWith('humano')) {
        // Para humanos, não força nenhum atributo, mas preserva seleções manuais
        // Só limpa se estiver mudando de uma classe não-humana para humana
        return;
      }

      // Para outras raças, sempre garante que os atributos prime da classe estejam marcados
      primes.forEach(attr => {
        newPrimeStates[attr] = true;
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

      // Se for humano, permite escolha livre mas mantém atributos da classe
      if (selectedRace.toLowerCase().startsWith('humano')) {
        const newPrimeStates = { ...primeAttributeStates };

        // Para humanos, mantém os atributos da classe (se existirem) mas permite escolha livre
        // Se há classe selecionada, mantém os atributos prime da classe
        if (selectedClass) {
          const classPrimes = primeAttributes[selectedClass] || [];

          // Reset todos para false primeiro
          Object.keys(newPrimeStates).forEach(key => {
            newPrimeStates[key] = false;
          });

          // Depois marca apenas os da classe (para dar uma base, mas podem ser desmarcados)
          classPrimes.forEach(attr => {
            newPrimeStates[attr] = true;
          });
        } else {
          // Se não há classe, limpa todos
          Object.keys(newPrimeStates).forEach(key => {
            newPrimeStates[key] = false;
          });
        }

        setPrimeAttributeStates(newPrimeStates);
        return;
      }

      // Para outras raças, verifica se a quantidade atual excede o limite
      const currentCount = Object.values(primeAttributeStates).filter(Boolean).length;

      if (currentCount > maxPrimes) {
      // Se excede o limite, mantém apenas os atributos obrigatórios da classe
        const newPrimeStates = { ...primeAttributeStates };
        Object.keys(newPrimeStates).forEach(key => {
          newPrimeStates[key] = primes.includes(key);
        });
        setPrimeAttributeStates(newPrimeStates);
      } else {
        // Se não excede, apenas garante que os obrigatórios da classe estejam marcados
        const newPrimeStates = { ...primeAttributeStates };
        primes.forEach(attr => {
          newPrimeStates[attr] = true;
        });
        setPrimeAttributeStates(newPrimeStates);
      }
    }
  }, [selectedRace]); // Só executa quando a raça muda

  // Função para alternar atributo prime
  const togglePrimeAttribute = (attr: string) => {
    const maxPrimes = getMaxPrimeAttributes();
    const currentCount = Object.values(primeAttributeStates).filter(Boolean).length;

    // Para raças não-humanas, não permite desmarcar atributos obrigatórios da classe
    // Para humanos, permite desmarcar qualquer atributo (escolha livre)
    if (!selectedRace.toLowerCase().startsWith('humano') && selectedClass) {
      const classKey = selectedClass;
      const requiredPrimes = primeAttributes[classKey] || [];

      // Se está tentando desmarcar um atributo obrigatório da classe, não permite
      if (primeAttributeStates[attr] && requiredPrimes.includes(attr)) {
        return;
      }
    }

    // Se está tentando marcar e já atingiu o limite, não permite
    if (!primeAttributeStates[attr] && currentCount >= maxPrimes) {
      return;
    }

    setPrimeAttributeStates(prev => ({
      ...prev,
      [attr]: !prev[attr]
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

    // Calcular HP
    if (hpFormula[classKey]) {
      const hpRoll = new DiceRoll(hpFormula[classKey]);
      const conMod = calculateModifier(finalAttributes.constitution);
      const totalHp = Math.max(1, hpRoll.total + conMod);
      setHp(totalHp.toString());
    }

    // Calcular tesouro
    if (treasureFormula[classKey]) {
      const treasureRoll = new DiceRoll(treasureFormula[classKey]);
      setTreasure(`${treasureRoll.total * 10} PO`);
    }

    // Calcular idade
    if (ageFormulas[raceKey]) {
      const ageData = ageFormulas[raceKey][classKey] || ageFormulas[raceKey]['default'];
      if (ageData) {
        const ageRoll = new DiceRoll(ageData.dice);
        const totalAge = ageData.base + ageRoll.total;
        setAge(`${totalAge} anos`);
      }
    }

    // Gerar características físicas
    const genders = ['masc.', 'fem.'];
    const selectedGender = genders[Math.floor(Math.random() * genders.length)];
    setGender(selectedGender);

    const physicalStats = generatePhysicalStats(raceKey, selectedGender);
    setHeight(physicalStats.height);
    setWeight(physicalStats.weight);
    setDescription(physicalStats.description);

    // Calcular capacidade de carga
    const carryCapacity = finalAttributes.forca;
    setCarryingCapacity(carryCapacity.toString());

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

      setSpells({ level0: level0Spells, level1: level1Spells });
    }

    // Enviar automaticamente para Discord se webhook estiver configurado
    setTimeout(() => {
      if (discordWebhook.trim()) {
        sendToDiscord();
      }
    }, 100); // Pequeno delay para garantir que todos os states foram atualizados
  };

  // Função para coletar dados do personagem
  const getCharacterData = () => {
    const selectedPrimes = Object.entries(primeAttributeStates)
      .filter(([_, isSelected]) => isSelected)
      .map(([attr, _]) => attr.charAt(0).toUpperCase() + attr.slice(1));

    return {
      playerName: playerName.trim(),
      race: selectedRace,
      characterClass: selectedClass,
      gender: gender,
      age: age,
      height: height,
      weight: weight,
      description: description,
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
      hp: hp,
      treasure: treasure,
      carryingCapacity: carryingCapacity,
      spells: showSpells ? spells : null,
      rollAttempts: rollAttempts
    };
  };

  // Função para formatar mensagem do Discord
  const formatDiscordMessage = (characterData: any) => {
    const { playerName, race, characterClass, gender, age, height, weight, description, attributes, modifiers, totalModifier, primeAttributes, hp, treasure, carryingCapacity, spells, rollAttempts } = characterData;

    let message = `** PERSONAGEM GERADO - CASTLES & CRUSADES**\n\n`;
    message += `** Jogador:** ${playerName}\n`;
    message += `** Raça:** ${race} | ** Classe:** ${characterClass}\n`;
    message += `** Gênero:** ${gender} | ** Idade:** ${age}\n`;
    message += `** Altura:** ${height} | ** Peso:** ${weight} | **Descrição:** ${description}\n\n`;

    message += `**ATRIBUTOS:**\n`;
    message += `• **Força:** ${attributes.forca} (${modifiers.forca >= 0 ? '+' : ''}${modifiers.forca})\n`;
    message += `• **Inteligência:** ${attributes.inteligencia} (${modifiers.inteligencia >= 0 ? '+' : ''}${modifiers.inteligencia})\n`;
    message += `• **Sabedoria:** ${attributes.sabedoria} (${modifiers.sabedoria >= 0 ? '+' : ''}${modifiers.sabedoria})\n`;
    message += `• **Destreza:** ${attributes.destreza} (${modifiers.destreza >= 0 ? '+' : ''}${modifiers.destreza})\n`;
    message += `• **Constituição:** ${attributes.constitution} (${modifiers.constitution >= 0 ? '+' : ''}${modifiers.constitution})\n`;
    message += `• **Carisma:** ${attributes.carisma} (${modifiers.carisma >= 0 ? '+' : ''}${modifiers.carisma})\n`;
    message += `• **Modificador Total:** ${totalModifier >= 0 ? '+' : ''}${totalModifier}\n\n`;

    message += `**Atributos Prime:** ${primeAttributes.join(', ')}\n\n`;

    message += `**DETALHES:**\n`;
    message += `• **Pontos de Vida:** ${hp}\n`;
    message += `• **Tesouro Inicial:** ${treasure}\n`;
    message += `• **Capacidade de Carga:** ${carryingCapacity} kg\n\n`;

    if (spells && (spells.level0.length > 0 || spells.level1.length > 0)) {
      message += `**MAGIAS CONHECIDAS:**\n`;
      if (spells.level0.length > 0) {
        message += `• **Nível 0:** ${spells.level0.join(', ')}\n`;
      }
      if (spells.level1.length > 0) {
        message += `• **Nível 1:** ${spells.level1.join(', ')}\n`;
      }
      message += `\n`;
    }

    message += `**Tentativas de rolagem:** ${rollAttempts}x`;

    return { content: message };
  };

  // Função para enviar para Discord
  const sendToDiscord = async () => {
    if (!discordWebhook.trim()) {
      alert('Por favor, insira o webhook do Discord.');
      return;
    }

    if (!isCharacterComplete) {
      alert('Por favor, complete a geração do personagem antes de enviar.');
      return;
    }

    try {
      const characterData = getCharacterData();
      const discordMessage = formatDiscordMessage(characterData);

      const response = await fetch(discordWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordMessage)
      });

      if (response.ok) {
        alert('✅ Personagem enviado para Discord com sucesso!');
      } else {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao enviar para Discord:', error);
      alert('❌ Erro ao enviar para Discord. Verifique o webhook e tente novamente.');
    }
  };

  // Contar atributos prime selecionados
  const selectedPrimeCount = Object.values(primeAttributeStates).filter(Boolean).length;
  const maxPrimes = getMaxPrimeAttributes();

  return (
    <div>
      <main className="m-0 mx-auto max-w-3xl border min-h-screen flex flex-col gap-8 p-4">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance">C&C: Gerador de personagem</h1>

        <CharGen.TextInput
          label="Nome do jogador"
          id="playerName"
          value={playerName}
          onChange={setPlayerName}
        />

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
            disabled={!canRollAttributes}
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
          <p><span>Atributos Prime selecionados:</span> <Badge>{selectedPrimeCount}/{maxPrimes}</Badge></p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {Object.entries(primeAttributeStates).map(([attr, isChecked]) => {
              // Para humanos, nenhum atributo é obrigatório (escolha livre)
              const isHuman = selectedRace.toLowerCase().startsWith('humano');
              const isRequired = Boolean(!isHuman &&
                selectedClass &&
                (primeAttributes[selectedClass] || []).includes(attr));
              const isDisabled = Boolean(isRequired && !isHuman);

              return (
                <LabeledCheckbox
                  key={attr}
                  value={isChecked}
                  label={attr.charAt(0).toUpperCase() + attr.slice(1)}
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
      </main>
    </div>
  );
}
