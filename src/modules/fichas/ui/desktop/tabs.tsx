interface Tab {
    id: string;
    name: string;
}

interface TabsProps {
    tabs: Tab[];
    selectedId: string | null;
    handleSelected: (id: string) => void;
}

function Tabs({ tabs, selectedId, handleSelected }: TabsProps) {
    return (
        <div className="flex justify-between -mt-1 -mx-3 mb-2">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    className={`flex-1 p-1 ${selectedId === tab.id ? 'tab-selected' : ''}`}
                    onMouseOver={() => handleSelected(tab.id)}
                    onFocus={() => void 0}
                >
                    {tab.name}
                </button>
            ))}
        </div>
    );
}

export default Tabs;