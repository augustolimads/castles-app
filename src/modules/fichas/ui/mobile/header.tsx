'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useState } from 'react'

function Header() {
    const [characterName, setCharacterName] = useState('Falkor')
    const [race, setRace] = useState('Humano')
    const [characterClass, setCharacterClass] = useState('Guerreiro')
    const [level, setLevel] = useState(1)
    const [currentXP, setCurrentXP] = useState(0)
    const [maxXP, setMaxXP] = useState(2000)

    return (
        <div className="border bg-card p-2 mt-2 rounded-lg flex justify-between items-center gap-4">
            <SidebarTrigger size="lg" />
            <Dialog>
                <DialogTrigger asChild>
                    <button className="flex min-w-0 items-center gap-4" type="button">
                        <Avatar size="lg">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h1 className="truncate">{characterName} - O matador de batatas aereas</h1>
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Informacoes do personagem</DialogTitle>
                        <DialogDescription>
                            Ajuste os dados basicos da ficha.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="character-name">Nome do personagem</Label>
                            <Input
                                id="character-name"
                                value={characterName}
                                onChange={(event) => setCharacterName(event.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="character-race">Raca</Label>
                                <Input
                                    id="character-race"
                                    value={race}
                                    onChange={(event) => setRace(event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="character-class">Classe</Label>
                                <Input
                                    id="character-class"
                                    value={characterClass}
                                    onChange={(event) => setCharacterClass(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="character-level">Nivel</Label>
                                <Input
                                    id="character-level"
                                    type="number"
                                    min={1}
                                    value={level}
                                    onChange={(event) => setLevel(Math.max(1, Number(event.target.value) || 1))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="character-current-xp">XP atual</Label>
                                <Input
                                    id="character-current-xp"
                                    type="number"
                                    min={0}
                                    value={currentXP}
                                    onChange={(event) => {
                                        const value = Math.max(0, Number(event.target.value) || 0)
                                        setCurrentXP(Math.min(value, maxXP))
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="character-max-xp">XP maximo</Label>
                                <Input
                                    id="character-max-xp"
                                    type="number"
                                    min={0}
                                    value={maxXP}
                                    onChange={(event) => {
                                        const value = Math.max(0, Number(event.target.value) || 0)
                                        setMaxXP(value)
                                        setCurrentXP((previous) => Math.min(previous, value))
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button">Salvar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Header