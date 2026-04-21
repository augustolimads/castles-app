'use client';

import { v4 } from 'uuid';
import { handleInputChange } from '../appChanges';
import { saveCharacter, useCharacterStore } from '../stores/character';
import { setDeleteWeapons, useInventoryStore, useWeaponsStore } from '../stores/inventory';
import TextInput from './text-input';
import Title from './title';
import Weapon from './weapon';

function Combat() {
    const character = useCharacterStore();
    const inventory = useInventoryStore();
    const weapons = useWeaponsStore();

    function updateEquipments(id: string, newValue: string | number) {
        handleInputChange();
        if (
            id === 'helm' ||
            id === 'main' ||
            id === 'shield' ||
            (id === 'magicalItem' && typeof newValue === 'string')
        ) {
            useCharacterStore.getState().updateCharacter({
                armor: {
                    ...character.armor,
                    [id]: String(newValue),
                },
            });
            saveCharacter();
        }
    }

    function newWeapon() {
        handleInputChange();
        useInventoryStore.getState().updateInventory({
            weapons: [
                ...(inventory.weapons || []),
                {
                    id: v4(),
                    name: '',
                    bth: '',
                    dmg: '',
                },
            ],
        });
        saveCharacter();
    }

    function deleteWeapon(id: string) {
        handleInputChange();
        const newWeapons = inventory.weapons.filter((w) => w.id !== id);
        useInventoryStore.getState().updateInventory({
            weapons: newWeapons,
        });
        saveCharacter();
    }

    function modeToggleDeleteWeapon() {
        setDeleteWeapons(!weapons.isDeleteMode);
    }

    return (
        <div className="overflow-hidden flex flex-col gap-2">
            <Title name="Equipamentos" />
            <div className="grid grid-cols-2 gap-x-1">
                <TextInput
                    id="helm"
                    name="Elmo"
                    value={character.armor.helm}
                    updateInput={updateEquipments}
                />
                <TextInput
                    id="shield"
                    name="Escudo"
                    value={character.armor.shield}
                    updateInput={updateEquipments}
                />
                <div className="col-span-2">
                    <TextInput
                        id="main"
                        name="Armadura"
                        value={character.armor.main}
                        updateInput={updateEquipments}
                    />
                </div>
                <div className="col-span-2">
                    <TextInput
                        id="magicalItem"
                        name="Item Mágico"
                        value={character.armor.magicalItem}
                        updateInput={updateEquipments}
                    />
                </div>
            </div>
            <hr />
            <Title
                name="Armas"
                primary={{
                    title: 'Nova Arma',
                    action: newWeapon,
                }}
                secondary={{
                    title: weapons.isDeleteMode ? 'rolar' : 'deletar',
                    action: modeToggleDeleteWeapon,
                }}
            />
            <div className="overflow-y-auto h-64 pt-1 flex flex-col gap-2">
                <div className="flex gap-10 text-left pl-8 pr-7 text-xs">
                    <span className="flex-1">Nome</span>
                    <span>BBA</span>
                    <span>Dano</span>
                </div>
                {inventory.weapons.map((data) => (
                    <Weapon key={data.id} newWeapon={newWeapon} deleteWeapon={deleteWeapon} data={data} />
                ))}
            </div>
        </div>
    );
}

export default Combat;