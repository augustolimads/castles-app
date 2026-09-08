"use client";

import {
    loadCharacterData,
    saveCharacterToStorage,
} from "@/modules/fichas/stores/character";
import type { IEquipment, IItem, IWeapon } from "@/modules/fichas/types";
import type { CartItem } from "@/modules/itens/use-cart";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type LinkedCharacter = {
  id: string;
  name: string;
  availableGold: number;
};

function buildEntryId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function extractAC(effect: string): number {
  const match = effect.match(/CA\s*\+?\s*(\d+)/i);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function extractDamage(effect: string): string {
  const match = effect.match(/dano\s+(\d+d\d+)/i);
  return match ? match[1] : "";
}

function asEquipment(item: CartItem): IEquipment[] {
  return Array.from({ length: item.quantity }, () => ({
    id: buildEntryId(),
    name: item.name,
    ac: extractAC(item.effect || ""),
    ev: item.ev ?? 0,
  }));
}

function asWeapon(item: CartItem): IWeapon[] {
  return Array.from({ length: item.quantity }, () => ({
    id: buildEntryId(),
    name: item.name,
    bth: "",
    dmg: extractDamage(item.effect || ""),
    ev: item.ev ?? 0,
  }));
}

function asInventoryItem(item: CartItem): IItem {
  return {
    id: buildEntryId(),
    qtd: item.quantity,
    name: item.name,
    description: item.effect || item.obs || "",
    ev: item.ev ?? 0,
    itemType: item.type,
  };
}

type PurchaseResult =
  | { success: true; characterName: string; remainingGold: number }
  | { success: false; message: string };

function purchaseForCharacter(
  characterId: string,
  items: CartItem[],
  totalGold: number,
): PurchaseResult {
  const data = loadCharacterData(characterId);
  if (!data) {
    return {
      success: false,
      message: "Não foi possível carregar a ficha vinculada.",
    };
  }

  const availableGold = Number(data.character.treasure.gold || 0);
  if (totalGold > availableGold) {
    return {
      success: false,
      message: `O personagem não possui ouro suficiente. Disponível: ${availableGold.toFixed(2)} PO.`,
    };
  }

  const nextCharacter = {
    ...data.character,
    treasure: {
      ...data.character.treasure,
      gold: Number((availableGold - totalGold).toFixed(2)),
    },
  };

  const nextWeapons = [...(data.inventory.weapons || [])];
  const nextEquipments = [...(data.inventory.equipments || [])];
  const nextItems = [...(data.inventory.items || [])];

  for (const item of items) {
    if (
      item.type === "armadura" ||
      item.type === "elmo" ||
      item.type === "escudo"
    ) {
      nextEquipments.push(...asEquipment(item));
      continue;
    }

    if (item.type === "arma" || item.type === "distancia") {
      nextWeapons.push(...asWeapon(item));
      continue;
    }

    nextItems.push(asInventoryItem(item));
  }

  saveCharacterToStorage(nextCharacter, data.spells, {
    weapons: nextWeapons,
    equipments: nextEquipments,
    items: nextItems,
  });

  return {
    success: true,
    characterName: data.character.name || "Personagem",
    remainingGold: nextCharacter.treasure.gold,
  };
}

export function useCharacterCartCheckout() {
  const searchParams = useSearchParams();
  const characterId = searchParams.get("characterId")?.trim() || "";
  const [linkedCharacter, setLinkedCharacter] =
    useState<LinkedCharacter | null>(null);

  const refreshLinkedCharacter = useCallback(() => {
    if (!characterId) {
      setLinkedCharacter(null);
      return;
    }

    const data = loadCharacterData(characterId);
    if (!data) {
      setLinkedCharacter(null);
      return;
    }

    setLinkedCharacter({
      id: data.character.id,
      name: data.character.name || "Personagem sem nome",
      availableGold: Number(data.character.treasure.gold || 0),
    });
  }, [characterId]);

  useEffect(() => {
    refreshLinkedCharacter();
  }, [refreshLinkedCharacter]);

  useEffect(() => {
    const handleStorageChange = () => refreshLinkedCharacter();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("characters-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("characters-updated", handleStorageChange);
    };
  }, [refreshLinkedCharacter]);

  const purchaseForLinkedCharacter = useCallback(
    (items: CartItem[], totalGold: number) => {
      if (!linkedCharacter) {
        toast.error(
          "Abra o mercado a partir de uma ficha para comprar para um personagem.",
        );
        return false;
      }

      if (items.length === 0) {
        toast.error("Seu carrinho está vazio.");
        return false;
      }

      const result = purchaseForCharacter(linkedCharacter.id, items, totalGold);
      if (!result.success) {
        toast.error(result.message);
        return false;
      }

      toast.success(
        `Compra aplicada em ${result.characterName}. Saldo: ${result.remainingGold.toFixed(2)} PO.`,
      );
      refreshLinkedCharacter();
      return true;
    },
    [linkedCharacter, refreshLinkedCharacter],
  );

  return {
    linkedCharacter,
    purchaseForLinkedCharacter,
  };
}
