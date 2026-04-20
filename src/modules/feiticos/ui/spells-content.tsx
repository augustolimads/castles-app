'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import type { Spell } from '../feiticos';

interface SpellsContentProps {
    spells: Spell[];
}

const casterTypes = [
    { id: 'mago', label: 'Mago' },
    { id: 'clerigo', label: 'Clérigo' },
    { id: 'druida', label: 'Druida' },
] as const;

export function SpellsContent({ spells }: SpellsContentProps) {
    const [activeTab, setActiveTab] = useState<'mago' | 'clerigo' | 'druida'>('mago');

    const spellsByType = useMemo(() => {
        return spells.filter(spell => spell.type === activeTab);
    }, [spells, activeTab]);

    const spellsByLevel = useMemo(() => {
        const grouped: Record<number, Spell[]> = {};

        for (let i = 0; i <= 9; i++) {
            grouped[i] = [];
        }

        spellsByType.forEach(spell => {
            if (!grouped[spell.level]) {
                grouped[spell.level] = [];
            }
            grouped[spell.level].push(spell);
        });

        return grouped;
    }, [spellsByType]);

    const getLevelLabel = (level: number) => {
        if (level === 0) return 'Truques (Nível 0)';
        return `Nível ${level}`;
    };

    return (
        <div className="space-y-6">
            <div className="sticky top-2 bg-secondary py-4 px-4 border rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Grimório de Feitiços</h1>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
                    <TabsList className="grid w-full grid-cols-3 h-auto">
                        {casterTypes.map(type => (
                            <TabsTrigger
                                key={type.id}
                                value={type.id}
                                className="flex items-center gap-2 py-3"
                            >
                                <span>{type.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            <div className="space-y-6 pb-8">
                {Object.entries(spellsByLevel).map(([level, levelSpells]) => {
                    const numLevel = Number(level);

                    if (levelSpells.length === 0) return null;

                    return (
                        <div key={level} className="space-y-2">
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="text-xl font-semibold">
                                    {getLevelLabel(numLevel)}
                                </h2>
                                <Badge variant="secondary">
                                    {levelSpells.length} {levelSpells.length === 1 ? 'feitiço' : 'feitiços'}
                                </Badge>
                            </div>

                            <Accordion type="single" collapsible className="space-y-2">
                                {levelSpells.map(spell => (
                                    <AccordionItem
                                        key={spell.id}
                                        value={spell.id}
                                        className="border rounded-lg px-4 bg-card"
                                    >
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex flex-col items-start gap-1 text-left">
                                                <span className="font-semibold text-base">
                                                    {spell.name}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {spell.shortDescription}
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2 pb-4">
                                            <div className="space-y-3">
                                                <div className="flex gap-2">
                                                    <Badge variant="outline">
                                                        Nível {spell.level}
                                                    </Badge>
                                                    <Badge>
                                                        {casterTypes.find(t => t.id === spell.type)?.label}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm leading-relaxed text-foreground/90">
                                                    {spell.completeDescription}
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    );
                })}

                {spellsByType.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="text-lg">Nenhum feitiço cadastrado para este tipo de conjurador.</p>
                        <p className="text-sm mt-2">Adicione feitiços ao arquivo de dados.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
