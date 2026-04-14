"use client"

import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import * as treasureData from "./treasure-data"
import {
    antiqueMaterialValues,
    antiquesTable,
    armorCategoriesTable,
    artifactsTable,
    cursedItemsTable,
    expertWeaponsTable,
    extraordinaryItemsReference,
    extraordinaryItemsTable,
    gemsTable,
    goldTable,
    handcraftedItemsTable,
    handcraftedMaterialValues,
    jewelryMaterialValues,
    jewelryTable,
    magicItemsReference,
    magicItemsTable,
    miscellaneousMagicTable,
    potionsTable,
    ringsTable,
    rodsStavesWandsTable,
    scrollsTable,
    specificGemsTable,
    weaponCategoriesTable,
    wornCeremonialMaterialValues,
    wornCeremonialTable,
} from "./treasure-data"

type NumberMap<T> = Record<number, T>

type GoldConfig = { chance: number; dice: number; sides: number; multiplier: number }
type GemsConfig = { chance: number; diceSides: number; bonus: number; valueReduction: number | null }
type ItemConfig = { chance: number; diceSides: number; bonus: number }
type MagicConfig = ItemConfig & { maxXP: number | null }

type GemItem = { roll: number; name: string; baseValue: number; finalValue: number }
type DetailedItem = { name: string; detail: string }
type NamedRollItem = { name: string; value?: number | string; xp?: number | string }

type GoldResult = { value: number; roll: string; multiplier: number }
type GemsResult = { numGems: number; gems: GemItem[]; totalValue: number; roll: string; bonus: number; valueReduction: number | null }
type SectionResult = { numItems: number; items: DetailedItem[]; roll: string; bonus: number }
type MagicResult = SectionResult & { chance: number; chanceRoll: number; maxXP: number | null }

type TreasureResult = {
    treasureType: number
    gold: GoldResult | null
    gems: GemsResult | null
    extraordinaryItems: SectionResult | null
    magicItems: MagicResult | null
}

const listButtons = [...Array(18).keys()].map((item) => item + 1)

function rollDie(sides: number) {
    return Math.floor(Math.random() * sides) + 1
}

function rollDice(count: number, sides: number) {
    const rolls = Array.from({ length: count }, () => rollDie(sides))
    const total = rolls.reduce((sum, current) => sum + current, 0)
    return { total, output: `${count}d${sides} (${rolls.join("+")})` }
}

function generateGold(treasureType: number): GoldResult | null {
    const config = (goldTable as NumberMap<GoldConfig>)[treasureType]
    if (!config) return null

    const chanceRoll = rollDie(100)
    if (chanceRoll > config.chance) return null

    const diceRoll = rollDice(config.dice, config.sides)
    return {
        value: diceRoll.total * config.multiplier,
        roll: diceRoll.output,
        multiplier: config.multiplier,
    }
}

function generateGems(treasureType: number): GemsResult | null {
    const config = (gemsTable as NumberMap<GemsConfig>)[treasureType]
    if (!config) return null

    const chanceRoll = rollDie(100)
    if (chanceRoll > config.chance) return null

    const diceRoll = rollDice(1, config.diceSides)
    const numGems = diceRoll.total + config.bonus
    const gems: GemItem[] = []
    let totalValue = 0

    for (let i = 0; i < numGems; i++) {
        const gemRoll = rollDie(100)
        const gemData = (specificGemsTable as NumberMap<{ name: string; value: number }>)[gemRoll]
        const reductionPercent = config.valueReduction ?? 0
        const finalValue = Math.floor((gemData.value * (100 - reductionPercent)) / 100)

        gems.push({
            roll: gemRoll,
            name: gemData.name,
            baseValue: gemData.value,
            finalValue,
        })
        totalValue += finalValue
    }

    return {
        numGems,
        gems,
        totalValue,
        roll: diceRoll.output,
        bonus: config.bonus,
        valueReduction: config.valueReduction,
    }
}

function generateExpertWeapon() {
    const roll = rollDie(100)
    const weapon = (expertWeaponsTable as NumberMap<{ name: string; value: number }>)[roll]
    const valueText = weapon.value < 1 ? `${Math.round(weapon.value * 100)} prata` : `${weapon.value} ouro`
    return { name: `⚡ ${weapon.name}`, detail: `d100: ${roll} | ${valueText}` }
}

function generateJewelry() {
    const itemRoll = rollDie(100)
    const jewelry = (jewelryTable as NumberMap<{ name: string; material: string; special?: string }>)[itemRoll]

    const valueRoll = rollDie(100)
    const valueIndex = Math.ceil(valueRoll / 10) - 1
    const materialValues = (jewelryMaterialValues as Record<string, number[]>)[jewelry.material]
    const value = materialValues[valueIndex]
    const quantity = jewelry.special ? `${rollDie(3) + 1} ` : ""
    return {
        name: `💍 ${quantity}${jewelry.name} (${jewelry.material})`,
        detail: `Item: ${itemRoll}, Valor: ${valueRoll} | ${value} ouro`,
    }
}

function generateMaterialBasedItem(
    table: NumberMap<{ name: string; material?: string; value?: number }>,
    valuesByMaterial: Record<string, number[]>,
    icon = "",
) {
    const itemRoll = rollDie(100)
    const item = table[itemRoll]

    if (!item.material) {
        return {
            name: `${icon} ${item.name}`.trim(),
            detail: `Item: ${itemRoll} | ${item.value} ouro`,
        }
    }

    const valueRoll = rollDie(100)
    const valueIndex = Math.ceil(valueRoll / 10) - 1
    const value = valuesByMaterial[item.material][valueIndex]

    return {
        name: `${icon} ${item.name} (${item.material})`.trim(),
        detail: `Item: ${itemRoll}, Valor: ${valueRoll} | ${value} ouro`,
    }
}

function generateExtraordinaryItems(treasureType: number): SectionResult | null {
    const config = (extraordinaryItemsTable as NumberMap<ItemConfig>)[treasureType]
    if (!config) return null

    const chanceRoll = rollDie(100)
    if (chanceRoll > config.chance) return null

    const diceRoll = rollDice(1, config.diceSides)
    const numItems = diceRoll.total + config.bonus
    const details: DetailedItem[] = []

    for (let i = 0; i < numItems; i++) {
        const tableRoll = rollDie(20)
        const tableName = (extraordinaryItemsReference as NumberMap<string>)[tableRoll]

        if (tableName === "Tabela 3.1 Expert Armas") {
            details.push(generateExpertWeapon())
            continue
        }
        if (tableName === "Tabela 3.2 Joias") {
            details.push(generateJewelry())
            continue
        }
        if (tableName === "Tabela 3.3 Worn & Ceremonial Itens") {
            details.push(
                generateMaterialBasedItem(
                    wornCeremonialTable as NumberMap<{ name: string; material?: string; value?: number }>,
                    wornCeremonialMaterialValues as Record<string, number[]>,
                    "👑",
                ),
            )
            continue
        }
        if (tableName === "Tabela 3.4 Handcrafted Itens") {
            details.push(
                generateMaterialBasedItem(
                    handcraftedItemsTable as NumberMap<{ name: string; material?: string; value?: number }>,
                    handcraftedMaterialValues as Record<string, number[]>,
                    "🎨",
                ),
            )
            continue
        }
        if (tableName === "Tabela 3.5 Antiguidades") {
            details.push(
                generateMaterialBasedItem(
                    antiquesTable as NumberMap<{ name: string; material?: string; value?: number }>,
                    antiqueMaterialValues as Record<string, number[]>,
                    "🏺",
                ),
            )
            continue
        }

        details.push({ name: tableName, detail: `d20: ${tableRoll}` })
    }

    return {
        numItems,
        items: details,
        roll: diceRoll.output,
        bonus: config.bonus,
    }
}

function generateMagicFromTable(tableName: string): DetailedItem {
    if (tableName === "Tabela 4.1 Pocoes") {
        const roll = rollDie(100)
        const item = (potionsTable as NumberMap<{ name: string; value: number | string; xp: number | string }>)[roll]
        return { name: `🧪 ${item.name}`, detail: `d100: ${roll} | ${item.value} po | ${item.xp} XP` }
    }

    if (tableName === "Tabela 4.2 Pergaminhos") {
        const roll = rollDie(100)
        const item = (scrollsTable as NumberMap<{ name: string; value: number | string; xp: number | string }>)[roll]
        return { name: `📜 ${item.name}`, detail: `d100: ${roll} | ${item.value} po | ${item.xp} XP` }
    }

    if (tableName === "Tabela 4.3 Armas") {
        const categoryRoll = rollDie(100)
        const category = (weaponCategoriesTable as NumberMap<string>)[categoryRoll]
        const categoryCode = category.match(/4\.3[A-E]/)?.[0]

        const subtableHintsByCode: Record<string, string[]> = {
            "4.3A": ["4.3a", "43a", "sword", "espad"],
            "4.3C": ["4.3c", "43c", "special", "especial", "sword", "espad"],
            "4.3D": ["4.3d", "43d", "misc", "divers", "weapon", "arma"],
            "4.3E": ["4.3e", "43e", "special", "especial", "weapon", "arma"],
        }

        const hints = categoryCode ? subtableHintsByCode[categoryCode] : undefined
        const subtableEntry = hints
            ? Object.entries(treasureData).find(([key, value]) => {
                  if (!hints.some((hint) => key.toLowerCase().includes(hint))) return false
                  if (!value || typeof value !== "object" || Array.isArray(value)) return false

                  const table = value as Record<string, unknown>
                  const numericKeys = Object.keys(table).filter((tableKey) => /^\d+$/.test(tableKey))
                  if (numericKeys.length === 0) return false

                  const sample = table[numericKeys[0]]
                  return typeof sample === "object" && sample !== null && "name" in (sample as Record<string, unknown>)
              })
            : undefined

        if (subtableEntry) {
            const [subtableName, subtable] = subtableEntry
            const typedSubtable = subtable as NumberMap<NamedRollItem>
            const maxRoll = Math.max(...Object.keys(typedSubtable).map((key) => Number(key)))
            const itemRoll = rollDie(maxRoll)
            const item = typedSubtable[itemRoll]

            return {
                name: `⚔️ ${item.name}`,
                detail: `Categoria d100: ${categoryRoll} (${category}) | Item d${maxRoll}: ${itemRoll} [${subtableName}]`,
            }
        }

        return {
            name: `⚔️ Arma Magica: ${category}`,
            detail: `Categoria d100: ${categoryRoll} | Resultado por categoria (sem subtabela dedicada no dataset)`,
        }
    }

    if (tableName === "Tabela 4.4 Armadura & Escudos") {
        const categoryRoll = rollDie(100)
        const category = (armorCategoriesTable as NumberMap<string>)[categoryRoll]
        const categoryCode = category.match(/4\.4[A-C]/)?.[0]

        const subtableHintsByCode: Record<string, string[]> = {
            "4.4A": ["4.4a", "44a", "shield", "escud"],
            "4.4C": ["4.4c", "44c", "armor", "armadur"],
        }

        const hints = categoryCode ? subtableHintsByCode[categoryCode] : undefined
        const subtableEntry = hints
            ? Object.entries(treasureData).find(([key, value]) => {
                  if (!hints.some((hint) => key.toLowerCase().includes(hint))) return false
                  if (!value || typeof value !== "object" || Array.isArray(value)) return false

                  const table = value as Record<string, unknown>
                  const numericKeys = Object.keys(table).filter((tableKey) => /^\d+$/.test(tableKey))
                  if (numericKeys.length === 0) return false

                  const sample = table[numericKeys[0]]
                  return typeof sample === "object" && sample !== null && "name" in (sample as Record<string, unknown>)
              })
            : undefined

        if (subtableEntry) {
            const [subtableName, subtable] = subtableEntry
            const typedSubtable = subtable as NumberMap<NamedRollItem>
            const maxRoll = Math.max(...Object.keys(typedSubtable).map((key) => Number(key)))
            const itemRoll = rollDie(maxRoll)
            const item = typedSubtable[itemRoll]

            return {
                name: `🛡️ ${item.name}`,
                detail: `Categoria d100: ${categoryRoll} (${category}) | Item d${maxRoll}: ${itemRoll} [${subtableName}]`,
            }
        }

        return {
            name: `🛡️ ${category}`,
            detail: `Categoria d100: ${categoryRoll} | Resultado por categoria (sem subtabela dedicada no dataset)`,
        }
    }

    if (tableName === "Tabela 4.5 Diversos Magia Completa") {
        const roll = Math.floor(Math.random() * 125) + 1
        const item = (miscellaneousMagicTable as NumberMap<{ name: string; value: number | string; xp: number | string }>)[roll]
        return { name: `🔮 ${item.name}`, detail: `d125: ${roll} | ${item.value} po | ${item.xp} XP` }
    }

    if (tableName === "Tabela 4.6 Aneis") {
        const roll = rollDie(100)
        const item = (ringsTable as NumberMap<{ name: string; value: number | string; xp: number | string }>)[roll]
        return { name: `💍 ${item.name}`, detail: `d100: ${roll} | ${item.value} po | ${item.xp} XP` }
    }

    if (tableName === "Tabela 4.7 Bastoes, Cajados, Varinhas") {
        const roll = rollDie(100)
        const item = (rodsStavesWandsTable as NumberMap<{ name: string; value: number | string; xp: number | string }>)[roll]
        return { name: `🪄 ${item.name}`, detail: `d100: ${roll} | ${item.value} po | ${item.xp} XP` }
    }

    if (tableName === "Tabela 4.8 Amaldicoado Itens") {
        const roll = rollDie(100)
        const item = (cursedItemsTable as NumberMap<{ name: string }>)[roll]
        return { name: `💀 ${item.name}`, detail: `d100: ${roll} | Item amaldicoado` }
    }

    if (tableName === "Tabela 4.9 Artefatos") {
        const roll = rollDie(100)
        const item = (artifactsTable as NumberMap<{ name: string }>)[roll]
        return { name: `⭐ ${item.name}`, detail: `d100: ${roll} | Artefato lendario` }
    }

    return { name: tableName, detail: "Tabela nao mapeada" }
}

function generateMagicItems(treasureType: number): MagicResult | null {
    const config = (magicItemsTable as NumberMap<MagicConfig>)[treasureType]
    if (!config) return null

    const chanceRoll = rollDie(100)
    if (chanceRoll > config.chance) return null

    const diceRoll = rollDice(1, config.diceSides)
    const numItems = diceRoll.total + config.bonus
    const details: DetailedItem[] = []

    for (let i = 0; i < numItems; i++) {
        const tableRoll = rollDie(100)
        const tableName = (magicItemsReference as NumberMap<string>)[tableRoll]
        details.push(generateMagicFromTable(tableName))
    }

    return {
        numItems,
        items: details,
        roll: diceRoll.output,
        bonus: config.bonus,
        chance: config.chance,
        chanceRoll,
        maxXP: config.maxXP,
    }
}

function Tesouro() {
    const [result, setResult] = useState<TreasureResult | null>(null)

    const handleGenerate = (treasureType: number) => {
        setResult({
            treasureType,
            gold: generateGold(treasureType),
            gems: generateGems(treasureType),
            extraordinaryItems: generateExtraordinaryItems(treasureType),
            magicItems: generateMagicItems(treasureType),
        })
    }

    return (
        <div className="flex w-full flex-col gap-8 px-4 py-6 md:px-6">
            <header className="relative overflow-hidden rounded-3xl border bg-muted/20 shadow-sm">
                <div className="relative h-44 w-full sm:h-56 lg:h-64">
                    <Image
                        src="/Tesouro.jpg"
                        alt="Capa do Gerador de Tesouros"
                        fill
                        priority
                        className="object-cover brightness-[1]"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_35%),linear-gradient(120deg,rgba(30,27,24,0.5),rgba(120,53,15,0.75))]" />
                </div>

                <div className="absolute left-5 top-5 z-30">
                    <SidebarTrigger className="text-white" />
                </div>

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-start sm:p-6">
                    <div className="flex items-end gap-3">
                        <div className="space-y-1 text-white self-center w-full pointer-events-none">
                            <p className="hidden md:block text-xs uppercase tracking-[0.25em] text-white/75">Treasure Generator</p>
                            <h1 className="text-2xl font-semibold sm:text-3xl text-center sm:text-left">Gerador de Tesouros</h1>
                            <p className="text-sm text-white/80 text-center sm:text-left">Gere tesouros aleatórios por tipo para suas aventuras.</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl">
                <div className="mb-6 grid grid-cols-3 gap-2 md:grid-cols-6">
                {listButtons.map((value) => (
                    <Button
                        key={value}
                        className="h-8 cursor-pointer"
                        onClick={() => handleGenerate(value)}
                        variant={result?.treasureType === value ? "secondary" : "default"}
                    >
                        {value}
                    </Button>
                ))}
            </div>

                <div>
                    <h2 className="mb-2 text-xl font-semibold">Tesouro gerado</h2>
                    <Card className="overflow-hidden border border-slate-300">
                <CardHeader className="bg-accent-foreground p-4 flex items-center -mt-6">
                    <CardTitle className="text-base font-semibold text-accent">
                        {result ? `Treasure Type ${result.treasureType}` : "Clique em um dos botões acima para gerar um tesouro."}
                    </CardTitle>
                </CardHeader>

                {result && (
                    <CardContent className="p-0">
                        <ul className="divide-y">
                            <li className="space-y-2 bg-amber-50 px-4 py-3">
                                <h3 className="font-semibold">💰 Ouro</h3>
                                {result.gold ? (
                                    <p>
                                        {result.gold.value.toLocaleString("pt-BR")} moedas ({result.gold.roll} x {result.gold.multiplier})
                                    </p>
                                ) : (
                                    <p className="text-muted-foreground">🚫 Nenhum ouro encontrado.</p>
                                )}
                            </li>

                            <li className="space-y-2 bg-sky-50 px-4 py-3">
                                <h3 className="font-semibold">💎 Gemas</h3>
                                {result.gems ? (
                                    <>
                                        <p>
                                            {result.gems.numGems} gemas ({result.gems.totalValue.toLocaleString("pt-BR")} ouro) [{result.gems.roll} +{" "}
                                            {result.gems.bonus}]
                                        </p>
                                        <ul className="list-inside list-disc space-y-1 pl-4">
                                            {result.gems.gems.map((gem, index) => (
                                                <li key={`${gem.name}-${index}`}>
                                                    💎 {gem.name} (d100: {gem.roll}) - {gem.baseValue}
                                                    {gem.baseValue !== gem.finalValue ? ` -> ${gem.finalValue}` : ""} ouro
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground">🚫 Nenhuma gema encontrada.</p>
                                )}
                            </li>

                            <li className="space-y-2 bg-yellow-50 px-4 py-3">
                                <h3 className="font-semibold">✨ Itens Extraordinarios</h3>
                                {result.extraordinaryItems ? (
                                    <>
                                        <p>
                                            {result.extraordinaryItems.numItems} itens ({result.extraordinaryItems.roll} + {result.extraordinaryItems.bonus})
                                        </p>
                                        <ul className="list-inside list-disc space-y-1 pl-4">
                                            {result.extraordinaryItems.items.map((item, index) => (
                                                <li key={`${item.name}-${index}`}>
                                                    {item.name.startsWith("⚡") || item.name.startsWith("💍") ? item.name : `✨ ${item.name}`} - {item.detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground">🚫 Nenhum item extraordinario encontrado.</p>
                                )}
                            </li>

                            <li className="space-y-2 bg-slate-50 px-4 py-3">
                                <h3 className="font-semibold">🔮 Itens Magicos</h3>
                                {result.magicItems ? (
                                    <>
                                        <p>
                                            {result.magicItems.numItems} itens ({result.magicItems.roll} + {result.magicItems.bonus}) | chance{" "}
                                            {result.magicItems.chanceRoll}/{result.magicItems.chance}
                                            {result.magicItems.maxXP ? ` | Max XP: ${result.magicItems.maxXP}` : ""}
                                        </p>
                                        <ul className="list-inside list-disc space-y-1 pl-4">
                                            {result.magicItems.items.map((item, index) => (
                                                <li key={`${item.name}-${index}`}>
                                                    {item.name} - {item.detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground">🚫 Nenhum item magico encontrado.</p>
                                )}
                            </li>
                        </ul>
                    </CardContent>
                )}
            </Card>
                </div>
            </main>
        </div>
    )
}

export default Tesouro