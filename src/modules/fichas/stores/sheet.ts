import { create } from 'zustand';
import { useCharacterStore } from './character';

interface SheetState {
    isEditMode: boolean;
    setIsEditMode: (value: boolean) => void;
}

export const useSheetStore = create<SheetState>((set) => ({
    isEditMode: true,
    setIsEditMode: (value) => set({ isEditMode: value }),
}));

const discordDefault = {
    webhook: '',
    title: '',
    isWeaponRoll: false,
    weaponAttackMod: '',
};

interface DiscordState {
    webhook: string;
    title: string;
    isWeaponRoll: boolean;
    weaponAttackMod: string;
    setWebhook: (value: string) => void;
    setTitle: (value: string) => void;
    setIsWeaponRoll: (value: boolean) => void;
    setWeaponAttackMod: (value: string) => void;
    reset: () => void;
}

export const useDiscordStore = create<DiscordState>((set) => ({
    ...discordDefault,
    setWebhook: (value) => set({ webhook: value }),
    setTitle: (value) => set({ title: value }),
    setIsWeaponRoll: (value) => set({ isWeaponRoll: value }),
    setWeaponAttackMod: (value) => set({ weaponAttackMod: value }),
    reset: () => set({
        title: '',
        isWeaponRoll: false,
        weaponAttackMod: '',
    }),
}));

export function resetDiscord() {
    useDiscordStore.getState().reset();
}

export function setIsEditMode(value: boolean) {
    useSheetStore.getState().setIsEditMode(value);
}

export function setDiscordWebhook(value: string) {
    useDiscordStore.getState().setWebhook(value);
}

export function setDiscordTitle(value: string) {
    useDiscordStore.getState().setTitle(value);
}

export function setIsWeaponRoll(value: boolean) {
    useDiscordStore.getState().setIsWeaponRoll(value);
}

export async function goDiscord(title: string, description: string) {
    const character = useCharacterStore.getState();
    if (character.name === '') return;
    
    const discord = useDiscordStore.getState();
    const hasHttpPortrait = character.portrait.includes('http') ? character.portrait : '';
    
    await fetch(discord.webhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: null,
            embeds: [
                {
                    title,
                    description: `🎲 ${description}`,
                    color: 5814783,
                    author: {
                        name: character.name,
                        icon_url: hasHttpPortrait,
                    },
                    thumbnail: {
                        url: hasHttpPortrait,
                    },
                },
            ],
            username: character.name,
            avatar_url: hasHttpPortrait,
            attachments: [],
        }),
    });
}