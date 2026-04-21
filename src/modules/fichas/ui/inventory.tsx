import { v4 } from 'uuid';
import { handleInputChange } from '../appChanges';
import { saveCharacter, useCharacterStore } from '../stores/character';
import { useInventoryStore } from '../stores/inventory';
import Item from './item';
import TextInput from './text-input';
import Title from './title';
import ValueInput from './value-input';

function Inventory() {
    const character = useCharacterStore();
    const updateCharacter = useCharacterStore((state) => state.updateCharacter);
    const inventory = useInventoryStore();
    const updateInventory = useInventoryStore((state) => state.updateInventory);

    function updateTreasure(id: string, value: number) {
        if (
            id === 'platinum' ||
            id === 'gold' ||
            id === 'silver' ||
            id === 'copper'
        ) {
            updateCharacter({
                ...character,
                treasure: {
                    ...character.treasure,
                    [id]: value,
                },
            });
            saveCharacter();
        }
    }

    function updateEncumbrance(id: string, value: number | string) {
        if (id === 'total' && typeof value === 'number') {
            updateCharacter({
                ...character,
                encumbrance: {
                    ...character.encumbrance,
                    [id]: Number(value),
                },
            });
            saveCharacter();
        }
    }

    function newItem() {
        const newItem = {
            id: v4(),
            name: '',
            qtd: 1,
            description: '',
            ev: 0,
        };
        updateInventory({
            ...inventory,
            items: [...inventory.items, newItem],
        });
        saveCharacter();
        handleInputChange();
    }

    return (
        <div id="Inventory" className="flex flex-col gap-4 h-full pb-12 justify-between">
            <div className="flex flex-col gap-2 flex-1">
                <Title
                    name="Itens"
                    primary={{
                        title: 'Novo Item',
                        action: newItem,
                    }}
                />
                <div className="flex flex-col gap-2 overflow-y-auto h-88 pt-1">
                    <div className="flex gap-8 text-left pl-8 pr-7 text-xs">
                        <span>Qtd</span>
                        <span className="flex-1">Nome</span>
                        <span>EV</span>
                    </div>

                    {inventory.items.map((data) => (
                        <Item key={data.id} data={data} newItem={newItem} />
                    ))}
                </div>
            </div>
            <hr />
            <div className="grid grid-cols-2 gap-4">
                <div id="treasure">
                    <Title name="Tesouro" />
                    <div className="flex flex-col gap-2">
                        <ValueInput
                            id="platinum"
                            label="Platina"
                            placeholder="Platina"
                            value={character.treasure.platinum}
                            updateValue={updateTreasure}
                        />
                        <ValueInput
                            id="gold"
                            label="Ouro"
                            placeholder="Ouro"
                            value={character.treasure.gold}
                            updateValue={updateTreasure}
                        />
                        <ValueInput
                            id="silver"
                            label="Prata"
                            placeholder="Prata"
                            value={character.treasure.silver}
                            updateValue={updateTreasure}
                        />
                        <ValueInput
                            id="copper"
                            label="Cobre"
                            placeholder="Cobre"
                            value={character.treasure.copper}
                            updateValue={updateTreasure}
                        />
                    </div>
                </div>
                <div id="encumbrance">
                    <Title name="Carga" />
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <TextInput
                            id="total"
                            name="Total"
                            isNumber
                            value={character.encumbrance.total}
                            updateInput={updateEncumbrance}
                        />
                        <TextInput
                            id="rating"
                            name="Classificação"
                            isNumber
                            disabled
                            value={character.encumbrance.rating}
                            updateInput={() => {}}
                        />
                        <TextInput
                            id="enc3x"
                            name="3x"
                            isNumber
                            disabled
                            value={character.encumbrance.enc3x}
                            updateInput={() => {}}
                        />
                    </div>
                    <div className="text-left text-xs flex flex-col gap-1">
                        <p>
                            <span className="font-bold">Sobrecarregado:</span>
                            {' '}Peso maior que 5x a força, -5 de movimento
                        </p>
                        <p>
                            <span className="font-bold">Muito Sobrecarregado:</span>
                            {' '}Peso maior que 10x a força, sem movimento
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inventory;