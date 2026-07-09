'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatAttributeModifier } from "@/lib/utils"
import { useState } from "react"

type AttributeType = "primary" | "secondary" | "tertiary"

type AttributeKey = "str" | "dex" | "con" | "int" | "wis" | "cha"

type CharacterAttribute = {
    value: number
    type: AttributeType
}

type CharacterAttributes = Record<AttributeKey, CharacterAttribute>

type AttributeProps = {
    label: string
    type: AttributeType
    value?: number
}

function Attribute({ label, type, value }: AttributeProps) {
    if (type === "primary") {
        return (
            <div className='relative rounded-lg border-2 border-card-400 bg-card-400 text-sm flex flex-col items-center text-card-foreground'>
                <span>{label}</span>
                <span className='font-bold text-xl'>{value}</span>
                <span className='bg-amber-500 w-full text-center rounded-b-md text-white font-bold'>{formatAttributeModifier(value ?? 0)}</span>
            </div>
        )
    }
    if (type === "secondary") {
        return (
            <div className='relative rounded-lg border-2 border-card-300 bg-card-300 text-sm flex flex-col items-center text-card-foreground'>
                <span>{label}</span>
                <span className='font-bold text-xl'>{value}</span>
                <span className='bg-slate-400 w-full text-center rounded-b-md text-white font-bold'>{formatAttributeModifier(value ?? 0)}</span>
            </div>
        )
    }
    return (
        <div className='relative rounded-lg border-2 border-card-700 bg-card-700 text-sm flex flex-col items-center text-card-foreground'>
            <span>{label}</span>
            <span className='font-bold text-xl'>{value}</span>
            <span className='bg-orange-900 w-full text-center rounded-b-md text-white font-bold'>{formatAttributeModifier(value ?? 0)}</span>
        </div>
    )
}

function Attributes() {
    const [isOpen, setIsOpen] = useState(false)
    const [attributes, setAttributes] = useState<CharacterAttributes>({
        str: { value: 10, type: "primary" },
        dex: { value: 10, type: "primary" },
        con: { value: 10, type: "primary" },
        int: { value: 10, type: "secondary" },
        wis: { value: 10, type: "secondary" },
        cha: { value: 10, type: "tertiary" },
    })
    const [draftAttributes, setDraftAttributes] = useState<CharacterAttributes>(attributes)

    const fields: Array<{ key: AttributeKey, label: string, shortLabel: string }> = [
        { key: "str", label: "Forca", shortLabel: "FOR" },
        { key: "dex", label: "Destreza", shortLabel: "DES" },
        { key: "con", label: "Constituicao", shortLabel: "CON" },
        { key: "int", label: "Inteligencia", shortLabel: "INT" },
        { key: "wis", label: "Sabedoria", shortLabel: "SAB" },
        { key: "cha", label: "Carisma", shortLabel: "CAR" },
    ]

    const handleDialogOpenChange = (open: boolean) => {
        setIsOpen(open)

        if (open) {
            setDraftAttributes(attributes)
        }
    }

    const handleSave = () => {
        setAttributes(draftAttributes)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
                <button type="button" className='grid grid-cols-6 gap-1'>
                    {fields.map((field) => (
                        <Attribute
                            key={field.key}
                            label={field.shortLabel}
                            value={attributes[field.key].value}
                            type={attributes[field.key].type}
                        />
                    ))}
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Atributos</DialogTitle>
                    <DialogDescription>
                        Altere os valores atuais de cada atributo.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    {fields.map((field) => (
                        <div key={field.key} className="grid grid-cols-[72px_1fr_88px] items-center gap-2">
                            <Label htmlFor={`attr-${field.key}`}>{field.label}</Label>
                            <Select
                                value={draftAttributes[field.key].type}
                                onValueChange={(value) => {
                                    setDraftAttributes((prev) => ({
                                        ...prev,
                                        [field.key]: {
                                            ...prev[field.key],
                                            type: value as AttributeType,
                                        },
                                    }))
                                }}
                            >
                                <SelectTrigger id={`attr-type-${field.key}`} className="w-full">
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="primary">Primário</SelectItem>
                                    <SelectItem value="secondary">Secundário</SelectItem>
                                    <SelectItem value="tertiary">Terciário</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                id={`attr-${field.key}`}
                                type="number"
                                min={0}
                                max={20}
                                value={draftAttributes[field.key].value}
                                onFocus={(event) => event.target.select()}
                                onChange={(event) => {
                                    const parsedValue = Number(event.target.value)
                                    const safeValue = Math.min(20, Math.max(0, Number.isNaN(parsedValue) ? 0 : parsedValue))

                                    setDraftAttributes((prev) => ({
                                        ...prev,
                                        [field.key]: {
                                            ...prev[field.key],
                                            value: safeValue,
                                        },
                                    }))
                                }}
                            />
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button type="button" onClick={handleSave}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default Attributes