import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { handleInputChange } from "@/modules/fichas/appChanges"
import { useCharacterStore } from "@/modules/fichas/stores/character"
import { useInventoryStore } from "@/modules/fichas/stores/inventory"
import { ItemSearchModal } from "@/modules/fichas/ui/desktop/item-search-modal"
import { type Item, useItems } from "@/modules/itens/use-items"
import { Info, Trash2 } from "lucide-react"
import Image from "next/image"
import { useMemo, useState } from "react"
import { v4 } from "uuid"
import { saveCharacter } from "../../stores/character"

function inventory() {
    const character = useCharacterStore()
    const inventory = useInventoryStore()
    const updateInventory = useInventoryStore((state) => state.updateInventory)
    const { items } = useItems()
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isItemDetailsOpen, setIsItemDetailsOpen] = useState(false)
    const [isEditingItem, setIsEditingItem] = useState(false)
    const [editingQuantity, setEditingQuantity] = useState(1)

    const itemSlots = useMemo(() => Array.from({ length: 30 }, (_, slotIndex) => `slot-${slotIndex + 1}`), [])

    const slotItems = useMemo(() => {
        const slots: Array<(typeof inventory.items)[number] | undefined> = Array.from(
            { length: itemSlots.length },
            () => undefined
        )

        const usedIndexes = new Set<number>()

        for (const item of inventory.items) {
            if (typeof item.slot === "number" && item.slot >= 0 && item.slot < slots.length) {
                slots[item.slot] = item
                usedIndexes.add(item.slot)
            }
        }

        const unslottedItems = inventory.items.filter((item) => item.slot === undefined)
        let nextFreeSlot = 0

        for (const item of unslottedItems) {
            while (usedIndexes.has(nextFreeSlot) && nextFreeSlot < slots.length) {
                nextFreeSlot += 1
            }

            if (nextFreeSlot < slots.length) {
                slots[nextFreeSlot] = item
                usedIndexes.add(nextFreeSlot)
            }
        }

        return slots
    }, [inventory.items, itemSlots.length])

    const selectedSlotItem = useMemo(() => {
        if (selectedSlot === null) {
            return null
        }

        return slotItems[selectedSlot] ?? null
    }, [selectedSlot, slotItems])

    const selectedCatalogItem = useMemo(() => {
        if (!selectedSlotItem) {
            return null
        }

        return items.find((item) => item.name === selectedSlotItem.name) ?? null
    }, [items, selectedSlotItem])

    const selectedItemIcon = selectedSlotItem?.icon || selectedCatalogItem?.icon || "/icons/weapon.svg"

    function normalizeItemIcon(icon: string) {
        if (!icon) {
            return "/icons/weapon.svg"
        }

        if (icon.startsWith("http://") || icon.startsWith("https://") || icon.startsWith("/")) {
            return icon
        }

        if (icon.includes(".")) {
            return `/icons/${icon}`
        }

        return `/icons/${icon}.webp`
    }

    function openSlot(slotIndex: number) {
        const slotItem = slotItems[slotIndex]
        setSelectedSlot(slotIndex)

        if (slotItem) {
            setEditingQuantity(Math.max(1, slotItem.qtd))
            setIsEditingItem(false)
            setIsItemDetailsOpen(true)
            return
        }

        setIsSearchOpen(true)
    }

    function handleSelectItem(item: Item) {
        if (selectedSlot === null) {
            return
        }

        handleInputChange()

        const existingItemInSlot = slotItems[selectedSlot]
        const newItem = {
            id: existingItemInSlot?.id || v4(),
            name: item.name,
            qtd: 1,
            description: item.effect || item.obs || '',
            ev: item.ev ?? 0,
            icon: item.icon,
            slot: selectedSlot,
        }

        const nextItems = existingItemInSlot
            ? inventory.items.map((inventoryItem) =>
                inventoryItem.id === existingItemInSlot.id ? newItem : inventoryItem
            )
            : [...inventory.items, newItem]

        updateInventory({
            ...inventory,
            items: nextItems,
        })
        saveCharacter()

        setIsSearchOpen(false)
        setSelectedSlot(null)
    }

    function handleSaveItemEdit() {
        if (!selectedSlotItem) {
            return
        }

        handleInputChange()
        updateInventory({
            ...inventory,
            items: inventory.items.map((item) =>
                item.id === selectedSlotItem.id
                    ? {
                        ...item,
                        qtd: Math.max(1, editingQuantity),
                    }
                    : item
            ),
        })
        saveCharacter()
        setIsEditingItem(false)
    }

    function handleDeleteItem() {
        if (!selectedSlotItem) {
            return
        }

        handleInputChange()
        updateInventory({
            ...inventory,
            items: inventory.items.filter((item) => item.id !== selectedSlotItem.id),
        })
        saveCharacter()

        setIsItemDetailsOpen(false)
        setIsEditingItem(false)
        setSelectedSlot(null)
    }

    return (
        <div>
            <div id="carga" className="flex justify-between gap-2">
                <div id="current-ev" className="flex-1 flex gap-2 items-center bg-card border rounded-sm p-2 text-center">
                    <span className="block text-xs text-muted-foreground">Atual</span>
                    <span className="block text-lg font-semibold">{character.encumbrance.total}</span>
                </div>
                <div id="weighted" className="flex-1 flex gap-2 items-center bg-card border rounded-sm p-2 text-center">
                    <span className="block text-xs text-muted-foreground">Pesado</span>
                    <span className="block text-lg font-semibold">{character.encumbrance.rating}</span>
                </div>
                <div id="overloaded" className="flex-1 flex gap-2 items-center bg-card border rounded-sm p-2 text-center">
                    <span className="block text-xs text-muted-foreground">Sobrec.</span>
                    <span className="block text-lg font-semibold">{character.encumbrance.enc3x}</span>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-auto min-h-8 px-4"
                            aria-label="Regras de carga"
                        >
                            <Info size={16} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Regras de Carga</DialogTitle>
                            <DialogDescription>
                                Referencia rapida para EV e penalidades.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="text-sm text-muted-foreground flex flex-col gap-2">
                            <p>Cap. é Capacidade de Carga de mochila ou algo do tipo</p>
                            <p>Moedas: 160 moedas = 1 EV</p>
                            <p>Pesado: ND+2 DES, movimento -10ft (-3m)</p>
                            <p>Muito Sobrecarregado: ND DES falha, CA perde DES</p>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex justify-around gap-1 2xs:gap-2 xs:gap-3 mt-2">
                <div id="equipamento" className="bg-card rounded-sm p-1 2xs:p-2 xs:p-3 flex flex-col gap-1 2xs:gap-2">
                    <div id="elmo" className="bg-accent rounded-sm w-12 h-12 flex justify-center items-center">
                        <Image src="/icons/helmet.svg" alt="elmo" height="32" width="32" className="opacity-50" />
                    </div>
                    <div id="municao" className="bg-accent rounded-sm w-12 h-12 flex justify-center items-center">
                        <Image src="/icons/ammo.svg" alt="munição" height="32" width="32" className="opacity-50" />
                    </div>
                    <div id="armadura" className="bg-accent rounded-sm w-12 h-12 flex justify-center items-center">
                        <Image src="/icons/armor.svg" alt="armadura" height="32" width="32" className="opacity-50" />
                    </div>
                    <div id="arma" className="bg-accent rounded-sm w-12 h-12 flex justify-center items-center">
                        <Image src="/icons/weapon.svg" alt="arma" height="32" width="32" className="opacity-50" />
                    </div>
                    <div id="escudo" className="bg-accent rounded-sm w-12 h-12 flex justify-center items-center">
                        <Image src="/icons/shield.svg" alt="escudo" height="32" width="32" className="opacity-50" />
                    </div>
                    <div id="moedas" className="bg-accent rounded-sm w-12 h-12 flex justify-center items-center">
                        <Image src="/icons/coins.svg" alt="moedas" height="32" width="32" className="opacity-50" />
                    </div>
                </div>
                <div id="itens" className="flex">
                    <div className="rounded-sm p-1 2xs:p-2 xs:p-3 bg-card grid grid-cols-5 auto-rows-12 gap-1 2xs:gap-2">
                        {itemSlots.map((slotId, slotIndex) => {
                            const slotItem = slotItems[slotIndex]
                            const itemIcon = slotItem
                                ? normalizeItemIcon(
                                    slotItem.icon ||
                                    items.find((item) => item.name === slotItem.name)?.icon ||
                                    "/icons/weapon.svg"
                                )
                                : null

                            return (
                                <button
                                    type="button"
                                    key={slotId}
                                    className="relative bg-accent rounded-sm w-11 2xs:w-12 h-11 2xs:h-12 flex items-center justify-center overflow-hidden"
                                    onClick={() => openSlot(slotIndex)}
                                >
                                    {slotItem && itemIcon ? (
                                        <Image
                                            src={itemIcon}
                                            alt={slotItem.name}
                                            height="44"
                                            width="44"
                                            className=" rounded-md opacity-85"
                                        />
                                    ) : null}
                                    {slotItem && slotItem.qtd > 1 ? (
                                        <span className="absolute -top-1 -right-1 bg-card-foreground text-card text-[10px] leading-none px-1 py-0.5 rounded-full min-w-4 text-center">
                                            {slotItem.qtd}
                                        </span>
                                    ) : null}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            <ItemSearchModal
                open={isSearchOpen}
                onOpenChange={(open) => {
                    setIsSearchOpen(open)
                    if (!open) {
                        setSelectedSlot(null)
                    }
                }}
                onSelectItem={handleSelectItem}
                items={items}
                title="Buscar Item para Slot"
            />

            <Dialog
                open={isItemDetailsOpen}
                onOpenChange={(open) => {
                    setIsItemDetailsOpen(open)

                    if (!open) {
                        setIsEditingItem(false)
                        setSelectedSlot(null)
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedSlotItem?.name || "Item do Slot"}</DialogTitle>
                        <DialogDescription>
                            {selectedSlotItem
                                ? `Slot ${selectedSlot !== null ? selectedSlot + 1 : ""}`
                                : "Item não encontrado"}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSlotItem ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 rounded-md border p-3">
                                <Image
                                    src={normalizeItemIcon(selectedItemIcon)}
                                    alt={selectedSlotItem.name}
                                    height={36}
                                    width={36}
                                    className="opacity-90"
                                />
                                <div className="flex flex-col text-sm">
                                    <span className="font-semibold">{selectedSlotItem.name}</span>
                                    <span className="text-muted-foreground">EV: {selectedSlotItem.ev}</span>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <p>
                                    <span className="font-semibold">Descrição:</span>{" "}
                                    {selectedSlotItem.description || "Sem descrição"}
                                </p>
                            </div>

                            {isEditingItem ? (
                                <div className="space-y-2">
                                    <label htmlFor="slot-item-quantity" className="text-sm font-medium">
                                        Quantidade
                                    </label>
                                    <Input
                                        id="slot-item-quantity"
                                        type="number"
                                        min={1}
                                        value={editingQuantity}
                                        onFocus={(event) => event.target.select()}
                                        onChange={(event) => {
                                            const parsedValue = Number(event.target.value)
                                            setEditingQuantity(
                                                Math.max(1, Number.isNaN(parsedValue) ? 1 : parsedValue)
                                            )
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="text-sm">
                                    <span className="font-semibold">Quantidade:</span> {selectedSlotItem.qtd}
                                </div>
                            )}

                            <DialogFooter className="flex gap-2">
                                {isEditingItem ? (
                                    <Button type="button" onClick={handleSaveItemEdit}>
                                        Salvar
                                    </Button>
                                ) : (
                                    <Button type="button" variant="outline" onClick={() => setIsEditingItem(true)}>
                                        Editar
                                    </Button>
                                )}
                                <Button type="button" variant="destructive" onClick={handleDeleteItem}>
                                    <Trash2 size={14} />
                                    Apagar
                                </Button>
                            </DialogFooter>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default inventory