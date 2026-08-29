import { Backpack, NotebookText, Sprout, Swords, Wand } from 'lucide-react';

interface Tab {
    id: string;
    name: string;
}

interface TabsProps {
    tabs: Tab[];
    selectedId: string | null;
    handleSelected: (id: string) => void;
}

const tabIcons: Record<string, typeof Backpack> = {
    combat: Swords,
    abilities: Sprout,
    inventory: Backpack,
    spells: Wand,
    notes: NotebookText,
};

function Tabs({ tabs, selectedId, handleSelected }: TabsProps) {
    return (
        <div className="flex justify-between -mt-1 -mx-3 mb-2">
            {tabs.map((tab) => {
                const Icon = tabIcons[tab.id] ?? Backpack;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        className={`flex flex-1 items-center justify-center gap-1 p-1 ${selectedId === tab.id ? 'tab-selected' : ''}`}
                        onMouseOver={() => handleSelected(tab.id)}
                        onFocus={() => void 0}
                        aria-label={tab.name}
                    >
                        <Icon className="h-4 w-4 md:hidden" />
                        <span className="hidden md:inline">{tab.name}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default Tabs;