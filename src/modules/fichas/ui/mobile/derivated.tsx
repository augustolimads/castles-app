"use client"

import { handleInputChange } from "@/modules/fichas/appChanges"
import { updateEncumbraceRating } from "@/modules/fichas/attributeLogic"
import { saveCharacter, useCharacterStore } from "@/modules/fichas/stores/character"
import classNames from "classnames"

type DerivatedCardProps = {
    isHighlighted?: boolean
    label: string
    inputId: string
    value: string | number
    type?: "number" | "text"
    onChange: (value: string) => void
}

function DerivatedCard({ isHighlighted, label, inputId, value, type = "number", onChange }: DerivatedCardProps) {
    return (
        <div className={classNames("flex gap-1 rounded-md px-2 py-1 justify-center items-center flex-1 border border-card-foreground", { "bg-card-foreground text-card": isHighlighted, "bg-card text-card-foreground": !isHighlighted })}>
            <label className="text-xs" htmlFor={inputId}>{label}</label>
            <input
                id={inputId}
                className="text-xl text-center w-full bg-transparent outline-none"
                value={value}
                type={type}
                onFocus={(event) => event.currentTarget.select()}
                onChange={(event) => onChange(event.currentTarget.value)}
            />
        </div>
    )
}


function Derivated() {
    const character = useCharacterStore()
    const updateCharacter = useCharacterStore((state) => state.updateCharacter)

    function updateStat(id: "capacity" | "speed" | "bth", newValue: string) {
        handleInputChange()

        const parsedValue = id === "speed" ? newValue : Number(newValue)
        const safeValue = id === "speed" ? parsedValue : (Number.isNaN(parsedValue) ? 0 : parsedValue)

        updateCharacter({
            stats: {
                ...character.stats,
                [id]: safeValue,
            },
        })

        if (id === "capacity") {
            updateEncumbraceRating()
        }

        saveCharacter()
    }

    function updateAcMain(newValue: string) {
        handleInputChange()

        const parsedValue = Number(newValue)
        const safeValue = Number.isNaN(parsedValue) ? 0 : parsedValue

        updateCharacter({
            ac: {
                ...character.ac,
                main: safeValue,
            },
        })

        saveCharacter()
    }

    return (
        <div className="flex gap-2 justify-between">
            <DerivatedCard
                label="CA"
                inputId="mobile-ac-main"
                value={character.ac.main}
                isHighlighted={true}
                onChange={updateAcMain}
            />
            <DerivatedCard
                label="BBA"
                inputId="mobile-bth"
                value={character.stats.bth}
                onChange={(value) => updateStat("bth", value)}
            />
            <DerivatedCard
                label="Vel."
                inputId="mobile-speed"
                value={character.stats.speed}
                type="text"
                onChange={(value) => updateStat("speed", value)}
            />
            <DerivatedCard
                label="Cap."
                inputId="mobile-capacity"
                value={character.stats.capacity}
                onChange={(value) => updateStat("capacity", value)}
            />
        </div>
    )
}

export default Derivated