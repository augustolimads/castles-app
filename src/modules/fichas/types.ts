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

// Unified character data structure (character + spells + inventory)
// This replaces the fragmented storage of character/spells/inventory in separate keys

export interface ISpell {
  id: string;
  name: string;
  level: number;
  slots: number;
  description: string;
}

export interface SpellsData {
  level: {
    lv0: number;
    lv1: number;
    lv2: number;
    lv3: number;
    lv4: number;
    lv5: number;
    lv6: number;
    lv7: number;
    lv8: number;
    lv9: number;
  };
  known: ISpell[];
}

export interface IWeapon {
  id: string;
  name: string;
  bth: string;
  dmg: string;
  ev: number;
}

export interface IEquipment {
  id: string;
  name: string;
  ac: number;
  ev: number;
}

export type ItemClassification = 'expert' | 'greater expert' | 'magica' | 'prateada';

export interface IItem {
  id: string;
  qtd: number;
  name: string;
  description: string;
  ev: number;
  itemType?: string;
  attackBonus?: number;
  customDamage?: string;
  customArmorClass?: number;
  classification?: ItemClassification;
}

export interface InventoryData {
  weapons: IWeapon[];
  equipments: IEquipment[];
  items: IItem[];
}

export interface CharacterAbility {
  id: string;
  title: string;
  description: string;
  origin: string;
}

export interface Attribute {
  value: number;
  type: number; // 1 = primário, 2 = secundário, 3 = terciário (padrão)
}

export interface CharacterState {
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
    capacity: number;
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
  abilities: CharacterAbility[];
  notes: string;
}

// Unified storage format - all character data in one localStorage entry
export interface CharacterData {
  character: CharacterState;
  spells: SpellsData;
  inventory: InventoryData;
  lastModified: number; // timestamp for sync tracking
}
