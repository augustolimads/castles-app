import type { Item as ItemType } from '@/modules/itens/use-items';
import { useItems } from '@/modules/itens/use-items';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { handleInputChange } from '../appChanges';
import { saveCharacter, useCharacterStore } from '../stores/character';
import { useInventoryStore } from '../stores/inventory';
import Item from './item';
import { ItemSearchModal } from './item-search-modal';
import TextInput from './text-input';
import Title from './title';
import ValueInput from './value-input';

function Inventory() {
    const character = useCharacterStore();
    const updateCharacter = useCharacterStore((state) => state.updateCharacter);
    const inventory = useInventoryStore();
    const updateInventory = useInventoryStore((state) => state.updateInventory);
    const { items } = useItems();
    const [isItemSearchOpen, setIsItemSearchOpen] = useState(false);

    function handleSelectItem(item: ItemType) {
        handleInputChange();
        const newItem = {
            id: v4(),
            name: item.name,
            qtd: 1,
            description: item.effect || item.obs || '',
            ev: item.ev ?? 0,
        };
        updateInventory({
            ...inventory,
            items: [...inventory.items, newItem],
        });
        saveCharacter();
    }

    // Calcular automaticamente o total de carga baseado nos itens e moedas
    // biome-ignore lint/correctness/useExhaustiveDependencies: Evitar loop infinito - não incluir character.encumbrance nas dependências
    useEffect(() => {
        // Verificar se o character está carregado
        if (!character.id) return;

        // Somar EV dos itens
        const itemsTotal = inventory.items.reduce((sum, item) => {
            return sum + (item.ev * item.qtd);
        }, 0);

        // Somar EV dos equipamentos
        const equipmentsTotal = inventory.equipments.reduce((sum, equipment) => {
            return sum + equipment.ev;
        }, 0);

        // Somar EV das armas
        const weaponsTotal = inventory.weapons.reduce((sum, weapon) => {
            return sum + weapon.ev;
        }, 0);

        // Calcular peso das moedas (cada 160 moedas = 1 EV)
        const coinWeight = Math.floor(character.treasure.platinum / 160) +
            Math.floor(character.treasure.gold / 160) +
            Math.floor(character.treasure.silver / 160) +
            Math.floor(character.treasure.copper / 160);

        const total = itemsTotal + equipmentsTotal + weaponsTotal + coinWeight;

        if (character.encumbrance.total !== total) {
            updateCharacter({
                encumbrance: {
                    ...character.encumbrance,
                    total,
                },
            });
        }
    }, [
        inventory.items,
        inventory.equipments,
        inventory.weapons,
        character.treasure.platinum,
        character.treasure.gold,
        character.treasure.silver,
        character.treasure.copper,
        character.id,
        updateCharacter
    ]);

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
                    search={{
                        title: 'Buscar Item',
                        action: () => setIsItemSearchOpen(true),
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
                            name="Atual"
                            isNumber
                            disabled
                            value={character.encumbrance.total}
                            updateInput={() => { }}
                        />
                        <TextInput
                            id="rating"
                            name="Pesado"
                            isNumber
                            disabled
                            value={character.encumbrance.rating}
                            updateInput={() => {}}
                        />
                        <TextInput
                            id="enc3x"
                            name="Sobrec."
                            isNumber
                            disabled
                            value={character.encumbrance.enc3x}
                            updateInput={() => {}}
                        />
                    </div>
                    <div className="text-left text-xs flex flex-col gap-1">
                        <p>
                            <span className="font-bold">Moedas:</span>
                            {' '}160 moedas = 1 EV
                        </p>
                        <p>
                            <span className="font-bold">Pesado:</span>
                            {' '}ND+2 DES, movimento -10ft (-3m)
                        </p>
                        <p>
                            <span className="font-bold">Muito Sobrecarregado:</span>
                            {' '}ND DES falha, CA perde DES
                        </p>
                    </div>
                </div>
            </div>

            <ItemSearchModal
                open={isItemSearchOpen}
                onOpenChange={setIsItemSearchOpen}
                onSelectItem={handleSelectItem}
                items={items}
                title="Buscar Item"
            />
        </div>
    );
}

export default Inventory;