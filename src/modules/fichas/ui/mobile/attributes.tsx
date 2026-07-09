'use client'

import { Input } from "@/components/ui/input"
import { formatAttributeModifier } from "@/lib/utils"
import { handleInputChange } from "@/modules/fichas/appChanges"
import { updateEncumbraceRating } from "@/modules/fichas/attributeLogic"
import { saveCharacter, useCharacterStore } from "@/modules/fichas/stores/character"
import { useState } from "react"

type AttributeType = "primary" | "secondary" | "tertiary"

type AttributeKey = "str" | "dex" | "con" | "int" | "wis" | "cha"

type AttributeProps = {
    label: string
    attributeKey: AttributeKey
    type: AttributeType
    value?: number
    isEditing: boolean
    onStartEdit: (key: AttributeKey) => void
    onFinishEdit: () => void
    onValueChange: (key: AttributeKey, value: string) => void
    onToggleType: (key: AttributeKey) => void
}

function Attribute({
    label,
    attributeKey,
    type,
    value,
    isEditing,
    onStartEdit,
    onFinishEdit,
    onValueChange,
    onToggleType,
}: AttributeProps) {
    if (type === "primary") {
        return (
            <div className='relative rounded-lg border-2 border-card-400 bg-card-400 text-sm flex flex-col items-center text-card-foreground'>
                <span>{label}</span>
                {isEditing ? (
                    <Input
                        id={`attr-${attributeKey}`}
                        type="number"
                        min={0}
                        max={20}
                        value={value}
                        autoFocus
                        className="h-8 border-none bg-transparent text-center font-bold text-xl shadow-none focus-visible:ring-0"
                        onFocus={(event) => event.target.select()}
                        onBlur={onFinishEdit}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === "Escape") {
                                onFinishEdit()
                            }
                        }}
                        onChange={(event) => onValueChange(attributeKey, event.target.value)}
                    />
                ) : (
                    <button
                        type="button"
                        className='font-bold text-xl leading-none py-1 px-2'
                        onClick={() => onStartEdit(attributeKey)}
                    >
                        {value}
                    </button>
                )}
                <button
                    type="button"
                    className='bg-amber-500 w-full text-center rounded-b-md text-white font-bold'
                    onClick={() => onToggleType(attributeKey)}
                >
                    {formatAttributeModifier(value ?? 0)}
                </button>
            </div>
        )
    }

    if (type === "secondary") {
        return (
            <div className='relative rounded-lg border-2 border-card-300 bg-card-300 text-sm flex flex-col items-center text-card-foreground'>
                <span>{label}</span>
                {isEditing ? (
                    <Input
                        id={`attr-${attributeKey}`}
                        type="number"
                        min={0}
                        max={20}
                        value={value}
                        autoFocus
                        className="h-8 border-none bg-transparent text-center font-bold text-xl shadow-none focus-visible:ring-0"
                        onFocus={(event) => event.target.select()}
                        onBlur={onFinishEdit}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === "Escape") {
                                onFinishEdit()
                            }
                        }}
                        onChange={(event) => onValueChange(attributeKey, event.target.value)}
                    />
                ) : (
                    <button
                        type="button"
                        className='font-bold text-xl leading-none py-1 px-2'
                        onClick={() => onStartEdit(attributeKey)}
                    >
                        {value}
                    </button>
                )}
                <button
                    type="button"
                    className='bg-slate-400 w-full text-center rounded-b-md text-white font-bold'
                    onClick={() => onToggleType(attributeKey)}
                >
                    {formatAttributeModifier(value ?? 0)}
                </button>
            </div>
        )
    }

    return (
        <div className='relative rounded-lg border-2 border-card-700 bg-card-700 text-sm flex flex-col items-center text-card-foreground'>
            <span>{label}</span>
            {isEditing ? (
                <Input
                    id={`attr-${attributeKey}`}
                    type="number"
                    min={0}
                    max={20}
                    value={value}
                    autoFocus
                    className="h-8 border-none bg-transparent text-center font-bold text-xl shadow-none focus-visible:ring-0"
                    onFocus={(event) => event.target.select()}
                    onBlur={onFinishEdit}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === "Escape") {
                            onFinishEdit()
                        }
                    }}
                    onChange={(event) => onValueChange(attributeKey, event.target.value)}
                />
            ) : (
                <button
                    type="button"
                    className='font-bold text-xl leading-none py-1 px-2'
                    onClick={() => onStartEdit(attributeKey)}
                >
                    {value}
                </button>
            )}
            <button
                type="button"
                className='bg-orange-900 w-full text-center rounded-b-md text-white font-bold'
                onClick={() => onToggleType(attributeKey)}
            >
                {formatAttributeModifier(value ?? 0)}
            </button>
        </div>
    )
}

function Attributes() {
    const [editingAttribute, setEditingAttribute] = useState<AttributeKey | null>(null)
    const character = useCharacterStore()
    const updateCharacter = useCharacterStore((state) => state.updateCharacter)

    const fields: Array<{ key: AttributeKey, label: string, shortLabel: string }> = [
        { key: "str", label: "Forca", shortLabel: "FOR" },
        { key: "dex", label: "Destreza", shortLabel: "DES" },
        { key: "con", label: "Constituicao", shortLabel: "CON" },
        { key: "int", label: "Inteligencia", shortLabel: "INT" },
        { key: "wis", label: "Sabedoria", shortLabel: "SAB" },
        { key: "cha", label: "Carisma", shortLabel: "CAR" },
    ]

    const updateAttribute = (key: AttributeKey, updates: { value?: number, type?: number }) => {
        const currentAttribute = character.attr[key]

        handleInputChange()
        updateCharacter({
            attr: {
                ...character.attr,
                [key]: {
                    value: updates.value ?? currentAttribute.value,
                    type: updates.type ?? currentAttribute.type,
                },
            },
        })
        updateEncumbraceRating()
        saveCharacter()
    }

    const handleValueChange = (key: AttributeKey, inputValue: string) => {
        const parsedValue = Number(inputValue)
        const safeValue = Math.min(20, Math.max(0, Number.isNaN(parsedValue) ? 0 : parsedValue))

        updateAttribute(key, { value: safeValue })
    }

    const handleToggleType = (key: AttributeKey) => {
        const currentType = character.attr[key].type
        const nextType = currentType === 1 ? 2 : currentType === 2 ? 3 : 1

        updateAttribute(key, { type: nextType })
    }

    return (
        <div className='grid grid-cols-6 gap-1'>
            {fields.map((field) => (
                <Attribute
                    key={field.key}
                    label={field.shortLabel}
                    attributeKey={field.key}
                    value={character.attr[field.key].value}
                    type={attributeTypeToLabel(character.attr[field.key].type)}
                    isEditing={editingAttribute === field.key}
                    onStartEdit={setEditingAttribute}
                    onFinishEdit={() => setEditingAttribute(null)}
                    onValueChange={handleValueChange}
                    onToggleType={handleToggleType}
                />
            ))}
        </div>
    )
}

function attributeTypeToLabel(type: number): AttributeType {
    if (type === 1) {
        return "primary"
    }

    if (type === 2) {
        return "secondary"
    }

    return "tertiary"
}
export default Attributes