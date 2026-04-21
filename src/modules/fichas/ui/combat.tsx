'use client';

import type { Item } from '@/modules/itens/use-items';
import { useItems } from '@/modules/itens/use-items';
import { useState } from 'react';
import { v4 } from 'uuid';
import { handleInputChange } from '../appChanges';
import { saveCharacter } from '../stores/character';
import { setDeleteEquipments, setDeleteWeapons, useEquipmentsStore, useInventoryStore, useWeaponsStore } from '../stores/inventory';
import Equipment from './equipment';
import { ItemSearchModal } from './item-search-modal';
import Title from './title';
import Weapon from './weapon';

function Combat() {
    const inventory = useInventoryStore();
    const weapons = useWeaponsStore();
    const equipments = useEquipmentsStore();
    const { items } = useItems();

    const [isEquipmentSearchOpen, setIsEquipmentSearchOpen] = useState(false);
    const [isWeaponSearchOpen, setIsWeaponSearchOpen] = useState(false);

    // Extrai número de CA do campo effect (ex: "CA +1" -> 1, "CA+8" -> 8)
    function extractAC(effect: string): number {
        const match = effect.match(/CA\s*\+?\s*(\d+)/i);
        return match ? Number.parseInt(match[1], 10) : 0;
    }

    // Extrai dano do campo effect (ex: "dano 1d4 /6m" -> "1d4")
    function extractDamage(effect: string): string {
        const match = effect.match(/dano\s+(\d+d\d+)/i);
        return match ? match[1] : '';
    }

    function handleSelectEquipment(item: Item) {
        handleInputChange();
        useInventoryStore.getState().updateInventory({
            equipments: [
                ...(inventory.equipments || []),
                {
                    id: v4(),
                    name: item.name,
                    ac: extractAC(item.effect),
                    ev: item.ev ?? 0,
                },
            ],
        });
        saveCharacter();
    }

    function handleSelectWeapon(item: Item) {
        handleInputChange();
        useInventoryStore.getState().updateInventory({
            weapons: [
                ...(inventory.weapons || []),
                {
                    id: v4(),
                    name: item.name,
                    bth: '',
                    dmg: extractDamage(item.effect),
                    ev: item.ev ?? 0,
                },
            ],
        });
        saveCharacter();
    }

    function newEquipment() {
        handleInputChange();
        useInventoryStore.getState().updateInventory({
            equipments: [
                ...(inventory.equipments || []),
                {
                    id: v4(),
                    name: '',
                    ac: 0,
                    ev: 0,
                },
            ],
        });
        saveCharacter();
    }

    function deleteEquipment(id: string) {
        handleInputChange();
        const newEquipments = inventory.equipments.filter((e) => e.id !== id);
        useInventoryStore.getState().updateInventory({
            equipments: newEquipments,
        });
        saveCharacter();
    }

    function modeToggleDeleteEquipment() {
        setDeleteEquipments(!equipments.isDeleteMode);
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
                    ev: 0,
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
            <Title
                name="Equipamentos"
                primary={{
                    title: 'Novo Equipamento',
                    action: newEquipment,
                }}
                secondary={{
                    title: equipments.isDeleteMode ? 'voltar' : 'deletar',
                    action: modeToggleDeleteEquipment,
                }}
                search={{
                    title: 'Buscar Equipamento',
                    action: () => setIsEquipmentSearchOpen(true),
                }}
            />
            <div className="overflow-y-auto h-48 pt-1 flex flex-col gap-2">
                <div className="flex gap-10 text-left pl-8 pr-7 text-xs">
                    <span className="flex-1">Nome</span>
                    <span>CA</span>
                    <span>EV</span>
                </div>
                {inventory.equipments.map((data) => (
                    <Equipment key={data.id} newEquipment={newEquipment} deleteEquipment={deleteEquipment} data={data} />
                ))}
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
                search={{
                    title: 'Buscar Arma',
                    action: () => setIsWeaponSearchOpen(true),
                }}
            />
            <div className="overflow-y-auto h-48 pt-1 flex flex-col gap-2">
                <div className="flex justify-end text-left pl-5 pr-4 gap-6 text-xs">
                    <span className="flex-1">Nome</span>
                    <span>BA</span>
                    <span>Dano</span>
                    <span>EV</span>
                </div>
                {inventory.weapons.map((data) => (
                    <Weapon key={data.id} newWeapon={newWeapon} deleteWeapon={deleteWeapon} data={data} />
                ))}
            </div>

            <ItemSearchModal
                open={isEquipmentSearchOpen}
                onOpenChange={setIsEquipmentSearchOpen}
                onSelectItem={handleSelectEquipment}
                items={items}
                typeFilter={['armadura', 'elmo', 'escudo']}
                title="Buscar Equipamento"
            />

            <ItemSearchModal
                open={isWeaponSearchOpen}
                onOpenChange={setIsWeaponSearchOpen}
                onSelectItem={handleSelectWeapon}
                items={items}
                typeFilter={['arma', 'distancia']}
                title="Buscar Arma"
            />
        </div>
    );
}

export default Combat;