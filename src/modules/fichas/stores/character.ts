import { v4 } from 'uuid';
import { create } from 'zustand';
import { handleInputChange } from '../appChanges';

export interface ICharacter {
    id: string;
    name: string;
    race: string;
    charClass: string;
    level: number;
    portrait: string;
}

// LocalStorage keys
const CHARACTERS_STORAGE_KEY = 'castles-characters';
const CHARACTERS_UPDATED_EVENT = 'characters-updated';
const SHEETS_STORAGE_KEY = 'castles-character-sheets';
const SHEETS_UPDATED_EVENT = 'sheets-updated';

interface Attribute {
    value: number;
    isPrimary: boolean;
}

interface CharacterState {
    id: string;
    name: string;
    portrait: string;
    attr: {
        str: Attribute;
        dex: Attribute;
        con: Attribute;
        int: Attribute;
        wis: Attribute;
        cha: Attribute;
    };
    ac: {
        head: number;
        main: number;
    };
    hp: {
        current: number;
        max: number;
        temp: number;
    };
    stats: {
        init: number;
        speed: string;
        bth: number;
    };
    info: {
        charClass: string;
        race: string;
        disposition: string;
        level: number;
        xp: number;
        nextLevel: number;
        languages: string;
    };
    armor: {
        helm: string;
        main: string;
        shield: string;
        magicalItem: string;
    };
    treasure: {
        platinum: number;
        gold: number;
        silver: number;
        copper: number;
    };
    encumbrance: {
        total: number;
        rating: number;
        enc3x: number;
    };
    tracking: {
        water: number;
        food: number;
        arrows: number;
        torches: number;
        conditions: string;
    };
    notes: string;
}

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
        str: { value: 10, isPrimary: false },
        dex: { value: 10, isPrimary: false },
        con: { value: 10, isPrimary: false },
        int: { value: 10, isPrimary: false },
        wis: { value: 10, isPrimary: false },
        cha: { value: 10, isPrimary: false }
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
        init: 0,
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

// ===== LocalStorage Functions =====

/**
 * Salva um character completo no localStorage
 */
export function saveCharacterToStorage(character: CharacterState, spells?: unknown, inventory?: { weapons?: unknown[]; items?: unknown[] }) {
    if (typeof window === 'undefined' || !character.id) return;

    try {
        const charactersMap = getCharactersFromStorage();
        // Salvar apenas os dados do character, spells e inventory são salvos em seus próprios stores
        charactersMap[character.id] = character;
        localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(charactersMap));
        window.dispatchEvent(new Event(CHARACTERS_UPDATED_EVENT));

        // TODO: Se necessário, também salvar spells e inventory associados ao character
        if (spells || inventory) {
            console.log('Spells e inventory serão salvos em stores separados');
        }
    } catch (error) {
        console.error('Erro ao salvar character:', error);
    }
}

/**
 * Carrega um character do localStorage pelo ID
 */
export function loadCharacterFromStorage(id: string): CharacterState | null {
    if (typeof window === 'undefined') return null;

    try {
        const charactersMap = getCharactersFromStorage();
        return charactersMap[id] || null;
    } catch (error) {
        console.error('Erro ao carregar character:', error);
        return null;
    }
}

/**
 * Obtém todos os characters do localStorage
 */
function getCharactersFromStorage(): Record<string, CharacterState> {
    if (typeof window === 'undefined') return {};

    try {
        const stored = localStorage.getItem(CHARACTERS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

/**
 * Deleta um character do localStorage
 */
export function deleteCharacterFromStorage(id: string) {
    if (typeof window === 'undefined') return;

    try {
        const charactersMap = getCharactersFromStorage();
        delete charactersMap[id];
        localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(charactersMap));
        window.dispatchEvent(new Event(CHARACTERS_UPDATED_EVENT));
    } catch (error) {
        console.error('Erro ao deletar character:', error);
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

export function saveCharacter(spells?: unknown, inventory?: { weapons?: unknown[]; items?: unknown[] }) {
    const character = useCharacterStore.getState();
    if (character.id) {
        saveCharacterToStorage(character, spells, inventory);
        syncCharacterToSheet(character.id);
        handleInputChange(false);
    }
}

export function setCharacterName(event: React.ChangeEvent<HTMLInputElement>) {
    handleInputChange();
    const input = event.target;
    const character = useCharacterStore.getState();
    useCharacterStore.getState().updateCharacter({
        name: input.value,
    });
    updateTitle();

    // Sincronizar com sheet
    if (character.id) {
        syncCharacterToSheet(character.id);
    }

    const url = new URL(window.location.href);
    const charParamsId = url.searchParams.get('char');
    if (!charParamsId) {
        newCharacterId();
    }
}

export function loadCharacter(charId: string): CharacterState | null {
    if (!charId) return null;

    const characterData = loadCharacterFromStorage(charId);
    if (characterData) {
        useCharacterStore.getState().setCharacter(characterData);
        updateTitle();
        return characterData;
    }
    return null;
}

function newCharacterId() {
    const newId = v4();
    useCharacterStore.getState().updateCharacter({
        id: newId,
    });

    const searchParams = new URLSearchParams(window.location.search);
    const character = useCharacterStore.getState();

    if (character.id) {
        searchParams.set('char', character.id);
    } else {
        searchParams.delete('char');
    }
    window.history.replaceState(
        {},
        '',
        `${window.location.pathname}?${searchParams}`
    );
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
export function syncCharacterToSheet(characterId: string) {
    if (typeof window === 'undefined' || !characterId) return;

    try {
        const character = useCharacterStore.getState();
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

            localStorage.setItem(SHEETS_STORAGE_KEY, JSON.stringify(sheets));
            window.dispatchEvent(new Event(SHEETS_UPDATED_EVENT));
        }
    } catch (error) {
        console.error('Erro ao sincronizar character com sheet:', error);
    }
}