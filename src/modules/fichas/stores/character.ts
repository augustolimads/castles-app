import { syncedLocalStorage } from '@/lib/sync';
import { create } from 'zustand';
import { handleInputChange } from '../appChanges';
import { updateEncumbraceRating } from '../attributeLogic';
import type { CharacterData, CharacterState, InventoryData, SpellsData } from '../types';

export interface ICharacter {
    id: string;
    name: string;
    race: string;
    charClass: string;
    level: number;
    portrait: string;
}

// LocalStorage keys - NEW UNIFIED FORMAT
const CHARACTER_DATA_KEY_PREFIX = 'castles-character-data-';
const CHARACTERS_UPDATED_EVENT = 'characters-updated';
const SHEETS_STORAGE_KEY = 'castles-character-sheets';
const SHEETS_UPDATED_EVENT = 'sheets-updated';

interface CharacterStore extends CharacterState {
    updateCharacter: (updates: Partial<CharacterState>) => void;
    setCharacter: (character: CharacterState) => void;
    resetCharacter: () => void;
}

const initialState: CharacterState = {
    id: '',
    name: '',
    portrait: 'https://i.pinimg.com/736x/29/f9/96/29f996b8d38b9e6d2b3e7cc70df54bcb.jpg',
    attr: {
        str: { value: 10, type: 3 },
        dex: { value: 10, type: 3 },
        con: { value: 10, type: 3 },
        int: { value: 10, type: 3 },
        wis: { value: 10, type: 3 },
        cha: { value: 10, type: 3 }
    },
    ac: {
        head: 0,
        main: 10
    },
    hp: {
        current: 1,
        max: 1,
        temp: 0
    },
    stats: {
        capacity: 0,
        speed: '30ft',
        bth: 0,
    },
    info: {
        charClass: '',
        race: '',
        disposition: '',
        level: 1,
        xp: 0,
        nextLevel: 0,
        languages: 'Comum',
    },
    armor: {
        helm: '',
        main: '',
        shield: '',
        magicalItem: '',
    },
    treasure: {
        platinum: 0,
        gold: 0,
        silver: 0,
        copper: 0,
    },
    encumbrance: {
        total: 0,
        rating: 0,
        enc3x: 0,
    },
    tracking: {
        water: 0,
        food: 0,
        arrows: 0,
        torches: 0,
        conditions: ''
    },
    abilities: [],
    notes: ''
};

export const useCharacterStore = create<CharacterStore>((set) => ({
    ...initialState,
    updateCharacter: (updates) => set((state) => ({ ...state, ...updates })),
    setCharacter: (character) => set(character),
    resetCharacter: () => set(initialState),
}));

interface CharacterListStore {
    characters: ICharacter[];
    setCharacters: (characters: ICharacter[]) => void;
}

export const useCharacterListStore = create<CharacterListStore>((set) => ({
    characters: [],
    setCharacters: (characters) => set({ characters }),
}));

// ===== LocalStorage Functions (UNIFIED FORMAT) =====

/**
 * Salva um character completo no localStorage (formato unificado)
 * Agora salva character + spells + inventory em uma única entrada
 */
export function saveCharacterToStorage(
    character: CharacterState,
    spells?: SpellsData | unknown,
    inventory?: InventoryData | { weapons?: unknown[]; equipments?: unknown[]; items?: unknown[] }
) {
    if (typeof window === 'undefined' || !character.id) return;

    try {
        // Preparar spells data (com fallback para formato vazio)
        const spellsData: SpellsData = spells ? (spells as SpellsData) : {
            level: { lv0: 0, lv1: 0, lv2: 0, lv3: 0, lv4: 0, lv5: 0, lv6: 0, lv7: 0, lv8: 0, lv9: 0 },
            known: []
        };

        // Preparar inventory data (com fallback para formato vazio)
        const inventoryData: InventoryData = inventory ? {
            weapons: (inventory as InventoryData).weapons || [],
            equipments: (inventory as InventoryData).equipments || [],
            items: (inventory as InventoryData).items || []
        } : {
            weapons: [],
            equipments: [],
            items: []
        };

        // Criar estrutura unificada
        const unifiedData: CharacterData = {
            character,
            spells: spellsData,
            inventory: inventoryData,
            lastModified: Date.now()
        };

        // Salvar em uma única entrada (com sincronização)
        const storageKey = `${CHARACTER_DATA_KEY_PREFIX}${character.id}`;

        // Usar syncedLocalStorage para salvar E sincronizar automaticamente
        syncedLocalStorage.setItem(storageKey, JSON.stringify(unifiedData));

        // Manter o índice de fichas (castles-character-sheets) sincronizado
        // sempre que um character for salvo, independentemente do fluxo.
        syncCharacterToSheet(character.id, character);

        window.dispatchEvent(new Event(CHARACTERS_UPDATED_EVENT));
    } catch (error) {
        console.error('Erro ao salvar character:', error);
    }
}

/**
 * Carrega um character do localStorage pelo ID (formato unificado)
 * Retorna apenas o CharacterState, spells e inventory são carregados separadamente
 */
export function loadCharacterFromStorage(id: string): CharacterState | null {
    if (typeof window === 'undefined') return null;

    try {
        const storageKey = `${CHARACTER_DATA_KEY_PREFIX}${id}`;
        const stored = localStorage.getItem(storageKey);

        if (!stored) return null;

        const data: CharacterData = JSON.parse(stored);
        return data.character;
    } catch (error) {
        console.error('Erro ao carregar character:', error);
        return null;
    }
}

/**
 * Carrega dados completos de um character (character + spells + inventory)
 */
export function loadCharacterData(id: string): CharacterData | null {
    if (typeof window === 'undefined') return null;

    try {
        const storageKey = `${CHARACTER_DATA_KEY_PREFIX}${id}`;
        const stored = localStorage.getItem(storageKey);

        if (!stored) return null;

        return JSON.parse(stored);
    } catch (error) {
        console.error('Erro ao carregar character data:', error);
        return null;
    }
}

/**
 * Deleta um character do localStorage (formato unificado)
 * Agora só precisa deletar uma entrada (com sincronização)
 */
export function deleteCharacterFromStorage(id: string) {
    if (typeof window === 'undefined') return;

    try {
        const storageKey = `${CHARACTER_DATA_KEY_PREFIX}${id}`;

        // Usar syncedLocalStorage para deletar E sincronizar automaticamente
        syncedLocalStorage.removeItem(storageKey);

        window.dispatchEvent(new Event(CHARACTERS_UPDATED_EVENT));
    } catch (error) {
        console.error('Erro ao deletar character:', error);
    }
}

/**
 * Obtém o timestamp da última modificação de um character
 */
export function getCharacterTimestamp(id: string): number | null {
    if (typeof window === 'undefined') return null;

    try {
        const storageKey = `${CHARACTER_DATA_KEY_PREFIX}${id}`;
        const stored = localStorage.getItem(storageKey);

        if (!stored) return null;

        const data: CharacterData = JSON.parse(stored);
        return data.lastModified;
    } catch (error) {
        console.error('Erro ao obter timestamp:', error);
        return null;
    }
}

/**
 * Cria um novo character com dados iniciais
 */
export function createNewCharacter(data: {
    id: string;
    name: string;
    race?: string;
    charClass?: string;
    level?: number;
    portrait?: string;
}): CharacterState {
    return {
        ...initialState,
        id: data.id,
        name: data.name,
        portrait: data.portrait || initialState.portrait,
        info: {
            ...initialState.info,
            race: data.race || '',
            charClass: data.charClass || '',
            level: data.level || 1,
        },
    };
}

// ===== Store Actions =====

export function loadAllCharacters() {
    // TODO: Implementar se necessário listar todos os characters
    console.log('loadAllCharacters chamado');
}

export function saveCharacter(spells?: unknown, inventory?: { weapons?: unknown[]; equipments?: unknown[]; items?: unknown[] }) {
    const character = useCharacterStore.getState();
    if (character.id) {
        // Se spells não foi fornecido, buscar do store
        let spellsData = spells;
        if (!spellsData) {
            try {
                const { useSpellsStore } = require('./spell');
                spellsData = useSpellsStore.getState();
            } catch (error) {
                console.error('Erro ao buscar spells:', error);
            }
        }

        // Se inventory não foi fornecido, buscar do store
        let inventoryData = inventory;
        if (!inventoryData) {
            try {
                const { useInventoryStore } = require('./inventory');
                inventoryData = useInventoryStore.getState();
            } catch (error) {
                console.error('Erro ao buscar inventory:', error);
            }
        }

        saveCharacterToStorage(character, spellsData, inventoryData);
        handleInputChange(false);
    }
}

export function setCharacterName(event: React.ChangeEvent<HTMLInputElement>) {
    handleInputChange();
    const input = event.target;
    useCharacterStore.getState().updateCharacter({
        name: input.value,
    });
    updateTitle();

    // Salvar character completo e sincronizar com sheet
    const character = useCharacterStore.getState();
    if (character.id) {
        // Buscar spells e inventory do store
        try {
            const { useSpellsStore } = require('./spell');
            const { useInventoryStore } = require('./inventory');
            const spells = useSpellsStore.getState();
            const inventory = useInventoryStore.getState();

            // Salvar o character completo no localStorage
            saveCharacterToStorage(character, spells, inventory);
        } catch (error) {
            console.error('Erro ao salvar character:', error);
            // Mesmo com erro, tenta salvar sem spells/inventory
            saveCharacterToStorage(character);
        }
    }
}

export function loadCharacter(charId: string): CharacterState | null {
    if (!charId) return null;

    // Carregar dados completos do formato unificado
    const fullData = loadCharacterData(charId);

    if (fullData) {
        const characterData = fullData.character;

        // Fazer merge com initialState para garantir que todos os campos existam
        const mergedData: CharacterState = {
            ...initialState,
            ...characterData,
            attr: {
                str: { ...initialState.attr.str, ...characterData.attr?.str },
                dex: { ...initialState.attr.dex, ...characterData.attr?.dex },
                con: { ...initialState.attr.con, ...characterData.attr?.con },
                int: { ...initialState.attr.int, ...characterData.attr?.int },
                wis: { ...initialState.attr.wis, ...characterData.attr?.wis },
                cha: { ...initialState.attr.cha, ...characterData.attr?.cha },
            },
            ac: { ...initialState.ac, ...characterData.ac },
            hp: { ...initialState.hp, ...characterData.hp },
            stats: { ...initialState.stats, ...characterData.stats },
            info: { ...initialState.info, ...characterData.info },
            armor: { ...initialState.armor, ...characterData.armor },
            treasure: { ...initialState.treasure, ...characterData.treasure },
            encumbrance: { ...initialState.encumbrance, ...characterData.encumbrance },
            tracking: { ...initialState.tracking, ...characterData.tracking },
            abilities: Array.isArray(characterData.abilities) ? characterData.abilities : [],
        };
        useCharacterStore.getState().setCharacter(mergedData);
        updateTitle();

        // Carregar spells do formato unificado
        try {
            const { useSpellsStore } = require('./spell');
            useSpellsStore.getState().setSpells(fullData.spells);
        } catch (error) {
            console.error('Erro ao carregar spells:', error);
        }

        // Carregar inventory do formato unificado
        try {
            const { useInventoryStore } = require('./inventory');
            const inventory = fullData.inventory;

            // Garantir que todos os arrays existam
            const completeInventory = {
                weapons: inventory.weapons || [],
                equipments: inventory.equipments || [],
                items: inventory.items || []
            };

            // Adicionar ev em weapons se não existir (migração de versões antigas)
            if (completeInventory.weapons.length > 0) {
                completeInventory.weapons = completeInventory.weapons.map((weapon: { id: string; name: string; bth: string; dmg: string; ev?: number }) => ({
                    ...weapon,
                    ev: weapon.ev ?? 0
                }));
            }

            useInventoryStore.getState().setInventory(completeInventory);
        } catch (error) {
            console.error('Erro ao carregar inventory:', error);
        }

        // Recalcular encumbrance rating após carregar o personagem
        updateEncumbraceRating();
        return characterData;
    }
    return null;
}

function updateTitle() {
    const character = useCharacterStore.getState();
    document.title = character.name
        ? `C&C: ${character.name}`
        : 'Castles & Crusades';
}

// ===== Sincronização com Sheets =====

/**
 * Atualiza o sheet correspondente quando o character é modificado
 */
export function syncCharacterToSheet(characterId: string, characterState?: CharacterState) {
    if (typeof window === 'undefined' || !characterId) return;

    try {
        const character = characterState ?? useCharacterStore.getState();
        const sheetsStored = localStorage.getItem(SHEETS_STORAGE_KEY);
        if (!sheetsStored) return;

        const sheets = JSON.parse(sheetsStored);
        const sheetIndex = sheets.findIndex((s: { id: string }) => s.id === characterId);

        if (sheetIndex !== -1) {
            sheets[sheetIndex] = {
                ...sheets[sheetIndex],
                name: character.name,
                portrait: character.portrait,
                race: character.info.race,
                class: character.info.charClass,
                level: character.info.level,
            };

            syncedLocalStorage.setItem(SHEETS_STORAGE_KEY, JSON.stringify(sheets));
            window.dispatchEvent(new Event(SHEETS_UPDATED_EVENT));
            window.dispatchEvent(new Event('storage'));
        }
    } catch (error) {
        console.error('Erro ao sincronizar character com sheet:', error);
    }
}