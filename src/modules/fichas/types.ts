export type SheetType = 'personagem' | 'npc' | 'monstro';

export interface CharacterSheet {
  id: string;
  type: SheetType;
  portrait: string;
  name: string;
  race: string;
  class: string;
  level: number;
  createdAt: number;
}
