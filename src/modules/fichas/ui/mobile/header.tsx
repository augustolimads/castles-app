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
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { charClasses } from '@/modules/compendium/charClasses'
import { saveCharacter, useCharacterStore } from '@/modules/fichas/stores/character'
import { useEffect } from 'react'

const raceOptions = [
    { label: 'Anão', value: 'anao' },
    { label: 'Elfo', value: 'elfo' },
    { label: 'Gnomo', value: 'gnomo' },
    { label: 'Halfling', value: 'halfling' },
    { label: 'Humano', value: 'humano' },
    { label: 'Meio-Elfo', value: 'meio-elfo' },
    { label: 'Meio-Orc', value: 'meio-orc' },
]

const classOptions = [
    { label: 'Assassino', value: 'assassino' },
    { label: 'Barbaro', value: 'barbaro' },
    { label: 'Bardo', value: 'bardo' },
    { label: 'Clerigo', value: 'clerigo' },
    { label: 'Druida', value: 'druida' },
    { label: 'Combatente', value: 'combatente' },
    { label: 'Ilusionista', value: 'ilusionista' },
    { label: 'Cavaleiro', value: 'cavaleiro' },
    { label: 'Monge', value: 'monge' },
    { label: 'Paladino', value: 'paladino' },
    { label: 'Explorador', value: 'explorador' },
    { label: 'Trapaceiro', value: 'trapaceiro' },
    { label: 'Mago', value: 'mago' },
]

function Header() {
    const character = useCharacterStore()
    const updateCharacter = useCharacterStore((state) => state.updateCharacter)

    useEffect(() => {
        const { charClass, level, nextLevel } = character.info

        if (!charClass || !level) {
            return
        }

        const characterClass = charClasses.find(
            (data) => data.name.toLowerCase() === charClass.toLowerCase()
        )

        if (!characterClass) {
            return
        }

        const nextLevelData = characterClass.levels.find((data) => data.level === level + 1)

        if (nextLevelData && nextLevelData.experience !== nextLevel) {
            updateCharacter({
                info: {
                    ...character.info,
                    nextLevel: nextLevelData.experience,
                },
            })
        }
    }, [character.info, updateCharacter])

    function updateInfoField(id: 'name' | 'portrait' | 'race' | 'charClass' | 'level' | 'xp' | 'nextLevel', value: string | number) {
        if (id === 'name') {
            updateCharacter({ name: String(value) })
            saveCharacter()
            return
        }

        if (id === 'portrait') {
            updateCharacter({ portrait: String(value) })
            saveCharacter()
            return
        }

        updateCharacter({
            info: {
                ...character.info,
                [id]: value,
            },
        })
        saveCharacter()
    }

    const characterTitle = character.name || 'Ficha sem nome'
    const characterSubtitle = [character.info.charClass, character.info.race, `NV ${character.info.level}`]
        .filter(Boolean)
        .join(' · ') || 'Dados básicos não configurados'
    const characterXPProgress = character.info.xp / character.info.nextLevel * 100

    return (
        <div className="border bg-card p-2 mt-2 rounded-lg flex justify-between items-center gap-4">
            <SidebarTrigger size="lg" />
            <Dialog>
                <DialogTrigger asChild>
                    <button className="flex min-w-0 items-center gap-4 flex-1" type="button">
                        <Avatar size="lg">
                            <AvatarImage src={character.portrait} />
                            <AvatarFallback>{characterTitle.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex flex-col gap-2 min-w-0 items-start">
                            <div className="flex-1 min-w-0 text-left w-full">
                                <h1 className="truncate font-semibold">{characterTitle}</h1>
                                <div className="flex-1 flex gap-2 w-full items-center">
                                    <span className="text-xs text-muted-foreground w-2/3">{characterSubtitle}</span>
                                    <Progress className="w-1/3" value={characterXPProgress} />
                                </div>
                            </div>
                        </div>
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Informações do personagem</DialogTitle>
                        <DialogDescription>
                            Ajuste os dados básicos da ficha.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="character-name">Nome do personagem</Label>
                            <Input
                                id="character-name"
                                value={character.name}
                                onFocus={(event) => event.target.select()}
                                onChange={(event) => updateInfoField('name', event.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="character-portrait">URL da imagem do avatar</Label>
                            <Input
                                id="character-portrait"
                                type="url"
                                value={character.portrait}
                                placeholder="https://..."
                                onFocus={(event) => event.target.select()}
                                onChange={(event) => updateInfoField('portrait', event.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="character-race">Raça</Label>
                                <Select
                                    value={character.info.race}
                                    onValueChange={(value) => updateInfoField('race', value)}
                                >
                                    <SelectTrigger id="character-race" className="w-full">
                                        <SelectValue placeholder="Selecione uma raça" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {raceOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="character-class">Classe</Label>
                                <Select
                                    value={character.info.charClass}
                                    onValueChange={(value) => updateInfoField('charClass', value)}
                                >
                                    <SelectTrigger id="character-class" className="w-full">
                                        <SelectValue placeholder="Selecione uma classe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="character-level">Nível</Label>
                                <Input
                                    id="character-level"
                                    type="number"
                                    min={1}
                                    max={24}
                                    value={character.info.level}
                                    onFocus={(event) => event.target.select()}
                                    onChange={(event) => updateInfoField('level', Math.max(1, Number(event.target.value) || 1))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="character-current-xp">XP atual</Label>
                                <Input
                                    id="character-current-xp"
                                    type="number"
                                    min={0}
                                    value={character.info.xp}
                                    onFocus={(event) => event.target.select()}
                                    onChange={(event) => updateInfoField('xp', Math.max(0, Number(event.target.value) || 0))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="character-max-xp">XP máximo</Label>
                                <Input
                                    id="character-max-xp"
                                    type="number"
                                    min={0}
                                    value={character.info.nextLevel}
                                    onFocus={(event) => event.target.select()}
                                    disabled
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