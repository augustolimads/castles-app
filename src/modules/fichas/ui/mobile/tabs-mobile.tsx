'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

function TabsMobile({ selectedTab, setSelectedTab }: { selectedTab: string, setSelectedTab: (tab: string) => void }) {
    return (
        <section id="tabs">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="h-auto w-full rounded-md border border-card-foreground/20 bg-card p-1 text-card-foreground">
                    <TabsTrigger value="inventario" className="flex-1 text-xs text-card-foreground/70 data-[state=active]:bg-accent data-[state=active]:text-card-foreground">
                        Inventário
                    </TabsTrigger>
                    <TabsTrigger value="habilidades" className="flex-1 text-xs text-card-foreground/70 data-[state=active]:bg-accent data-[state=active]:text-card-foreground">
                        Habilidades
                    </TabsTrigger>
                    <TabsTrigger value="magias" className="flex-1 text-xs text-card-foreground/70 data-[state=active]:bg-accent data-[state=active]:text-card-foreground">
                        Magias
                    </TabsTrigger>
                    <TabsTrigger value="notas" className="flex-1 text-xs text-card-foreground/70 data-[state=active]:bg-accent data-[state=active]:text-card-foreground">
                        Notas
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </section>
    )
}

export default TabsMobile