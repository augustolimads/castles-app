'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Backpack, NotebookText, Sprout, Swords, Wand } from 'lucide-react';

const tabConfig = [
    { id: 'combat', label: 'Combate', Icon: Swords },
    { id: 'inventory', label: 'Inventário', Icon: Backpack },
    { id: 'abilities', label: 'Habilidades', Icon: Sprout },
    { id: 'spells', label: 'Feitiços', Icon: Wand },
    { id: 'notes', label: 'Notas', Icon: NotebookText },
] as const;

function TabsMobile({ selectedTab, setSelectedTab }: { selectedTab: string, setSelectedTab: (tab: string) => void }) {
    return (
        <section id="tabs">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="h-auto w-full rounded-md border border-card-foreground/20 bg-card p-1 text-card-foreground">
                    {tabConfig.map(({ id, label, Icon }) => (
                        <TabsTrigger
                            key={id}
                            value={id}
                            className="flex-1 text-xs text-card-foreground/70 data-[state=active]:bg-accent data-[state=active]:text-card-foreground"
                            aria-label={label}
                        >
                            <Icon className="h-4 w-4 md:hidden" />
                            <span className="hidden md:inline">{label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </section>
    )
}

export default TabsMobile