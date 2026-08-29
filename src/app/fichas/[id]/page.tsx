'use client';

import { handleBeforeUnload } from "@/modules/fichas/appChanges";
import { loadCharacter, saveCharacter, useCharacterStore } from "@/modules/fichas/stores/character";
import SheetMobile from "@/modules/fichas/ui/mobile/sheetMobile";
import { use, useEffect } from 'react';

export default function SheetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    useEffect(() => {
        // Carregar o character pelo ID da URL
        if (id) {
            loadCharacter(id);
        }

        // Salvamento automático a cada 5 minutos
        const saveInterval = setInterval(() => {
            const currentCharacter = useCharacterStore.getState();
            if (currentCharacter.id) {
                const { useSpellsStore } = require('@/modules/fichas/stores/spell');
                const { useInventoryStore } = require('@/modules/fichas/stores/inventory');
                const currentSpells = useSpellsStore.getState();
                const currentInventory = useInventoryStore.getState();
                saveCharacter(currentSpells, currentInventory);
            }
        }, 5 * 60 * 1000); // 5 minutos

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(saveInterval);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // Salvar ao desmontar
            const currentCharacter = useCharacterStore.getState();
            if (currentCharacter.id) {
                const { useSpellsStore } = require('@/modules/fichas/stores/spell');
                const { useInventoryStore } = require('@/modules/fichas/stores/inventory');
                const currentSpells = useSpellsStore.getState();
                const currentInventory = useInventoryStore.getState();
                saveCharacter(currentSpells, currentInventory);
            }
        };
    }, [id]); // Apenas 'id' como dependência - spells e inventory são carregados dentro do efeito

    return (
        <>
            <SheetMobile currentSheetId={id} />
        </>
    )
}
