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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { handleInputChange } from "@/modules/fichas/appChanges"
import { useCharacterStore } from "@/modules/fichas/stores/character"
import { useInventoryStore } from "@/modules/fichas/stores/inventory"
import { ItemSearchModal } from "@/modules/fichas/ui/desktop/item-search-modal"
import { type Item, useItems } from "@/modules/itens/use-items"
import { Info, Trash2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { v4 } from "uuid"
import { saveCharacter } from "../../stores/character"

interface DragPayload {
    itemId: string
    fromSlotIndex: number
}

type EquipmentSlotKey = 'helm' | 'ammo' | 'armor' | 'weapon' | 'shield' | `magic-${number}`
type ItemClassification = 'expert' | 'greater expert' | 'magica' | 'prateada'

const MAGIC_SLOT_ICON = '/icons/ring.svg'
const itemClassificationOptions: Array<{ value: ItemClassification; label: string }> = [
    { value: 'expert', label: 'Expert' },
    { value: 'greater expert', label: 'Greater Expert' },
    { value: 'magica', label: 'Magica' },
    { value: 'prateada', label: 'Prateada' },
]

const equipmentSlotConfig: Array<{
    key: EquipmentSlotKey
    id: string
    icon: string
    alt: string
    slotIndex: number
    typeFilter: string[]
    excludedTypeFilter?: string[]
    searchTitle: string
}> = [
        {
            key: 'helm',
            id: 'elmo',
            icon: '/icons/helmet.svg',
            alt: 'elmo',
            slotIndex: -1,
            typeFilter: ['elmo'],
            searchTitle: 'Selecionar Elmo',
        },
        {
            key: 'ammo',
            id: 'municao',
            icon: '/icons/ammo.svg',
            alt: 'munição',
            slotIndex: -2,
            typeFilter: ['municao'],
            searchTitle: 'Selecionar Munição',
        },
        {
            key: 'armor',
            id: 'armadura',
            icon: '/icons/armor.svg',
            alt: 'armadura',
            slotIndex: -3,
            typeFilter: ['armadura'],
            searchTitle: 'Selecionar Armadura',
        },
        {
            key: 'weapon',
            id: 'arma',
            icon: '/icons/weapon.svg',
            alt: 'arma',
            slotIndex: -4,
            typeFilter: ['arma', 'distancia'],
            searchTitle: 'Selecionar Arma',
        },
        {
            key: 'shield',
            id: 'escudo',
            icon: '/icons/shield.svg',
            alt: 'escudo',
            slotIndex: -5,
            typeFilter: ['escudo', 'arma'],
            searchTitle: 'Selecionar Escudo ou Arma',
        },
        {
            key: 'magic-1',
            id: 'item-magico-1',
            icon: MAGIC_SLOT_ICON,
            alt: 'item magico',
            slotIndex: -6,
            typeFilter: [],
            excludedTypeFilter: ['arma', 'distancia', 'armadura', 'escudo', 'municao', 'elmo'],
            searchTitle: 'Selecionar Item Magico',
        },
        {
            key: 'magic-2',
            id: 'item-magico-2',
            icon: MAGIC_SLOT_ICON,
            alt: 'item magico',
            slotIndex: -7,
            typeFilter: [],
            excludedTypeFilter: ['arma', 'distancia', 'armadura', 'escudo', 'municao', 'elmo'],
            searchTitle: 'Selecionar Item Magico',
        },
        {
            key: 'magic-3',
            id: 'item-magico-3',
            icon: MAGIC_SLOT_ICON,
            alt: 'item magico',
            slotIndex: -8,
            typeFilter: [],
            excludedTypeFilter: ['arma', 'distancia', 'armadura', 'escudo', 'municao', 'elmo'],
            searchTitle: 'Selecionar Item Magico',
        },
        {
            key: 'magic-4',
            id: 'item-magico-4',
            icon: MAGIC_SLOT_ICON,
            alt: 'item magico',
            slotIndex: -9,
            typeFilter: [],
            excludedTypeFilter: ['arma', 'distancia', 'armadura', 'escudo', 'municao', 'elmo'],
            searchTitle: 'Selecionar Item Magico',
        },
        {
            key: 'magic-5',
            id: 'item-magico-5',
            icon: MAGIC_SLOT_ICON,
            alt: 'item magico',
            slotIndex: -10,
            typeFilter: [],
            excludedTypeFilter: ['arma', 'distancia', 'armadura', 'escudo', 'municao', 'elmo'],
            searchTitle: 'Selecionar Item Magico',
        },
        {
            key: 'magic-6',
            id: 'item-magico-6',
            icon: MAGIC_SLOT_ICON,
            alt: 'item magico',
            slotIndex: -11,
            typeFilter: [],
            excludedTypeFilter: ['arma', 'distancia', 'armadura', 'escudo', 'municao', 'elmo'],
            searchTitle: 'Selecionar Item Magico',
        }
    ]

function inventory() {
    const character = useCharacterStore()
    const updateCharacter = useCharacterStore((state) => state.updateCharacter)
    const inventory = useInventoryStore()
    const updateInventory = useInventoryStore((state) => state.updateInventory)
    const { items } = useItems()
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isCoinsDialogOpen, setIsCoinsDialogOpen] = useState(false)
    const [isItemDetailsOpen, setIsItemDetailsOpen] = useState(false)
    const [isEditingItem, setIsEditingItem] = useState(false)
    const [editingQuantity, setEditingQuantity] = useState(1)
    const [editingDescription, setEditingDescription] = useState('')
    const [editingAttackBonus, setEditingAttackBonus] = useState(0)
    const [editingCustomDamage, setEditingCustomDamage] = useState('')
    const [editingCustomArmorClass, setEditingCustomArmorClass] = useState(0)
    const [editingClassification, setEditingClassification] = useState<ItemClassification | undefined>(undefined)
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
    const [draggedFromSlotIndex, setDraggedFromSlotIndex] = useState<number | null>(null)

    // Recalcula automaticamente a carga total (EV) para incluir itens da grid,
    // slots de equipamento e moedas, mantendo compatibilidade com dados legados.
    // biome-ignore lint/correctness/useExhaustiveDependencies: Evitar loop de atualização do character
    useEffect(() => {
        if (!character.id) return

        const itemsTotal = inventory.items.reduce((sum, item) => {
            const quantity = Number.isFinite(item.qtd) ? item.qtd : 1
            const ev = Number.isFinite(item.ev) ? item.ev : 0
            return sum + (ev * quantity)
        }, 0)

        const equipmentsTotal = inventory.equipments.reduce((sum, equipment) => {
            const ev = Number.isFinite(equipment.ev) ? equipment.ev : 0
            return sum + ev
        }, 0)

        const weaponsTotal = inventory.weapons.reduce((sum, weapon) => {
            const ev = Number.isFinite(weapon.ev) ? weapon.ev : 0
            return sum + ev
        }, 0)

        const coinWeight = Math.floor(character.treasure.platinum / 160)
            + Math.floor(character.treasure.gold / 160)
            + Math.floor(character.treasure.silver / 160)
            + Math.floor(character.treasure.copper / 160)

        const total = itemsTotal + equipmentsTotal + weaponsTotal + coinWeight

        if (character.encumbrance.total !== total) {
            updateCharacter({
                ...character,
                encumbrance: {
                    ...character.encumbrance,
                    total,
                },
            })
        }
    }, [
        inventory.items,
        inventory.equipments,
        inventory.weapons,
        character.treasure.platinum,
        character.treasure.gold,
        character.treasure.silver,
        character.treasure.copper,
        character.encumbrance.total,
        character.id,
        updateCharacter,
    ])

    const itemSlots = useMemo(() => Array.from({ length: 32 }, (_, slotIndex) => `slot-${slotIndex + 1}`), [])

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

        if (selectedSlot < 0) {
            return inventory.items.find((item) => item.slot === selectedSlot) ?? null
        }

        return slotItems[selectedSlot] ?? null
    }, [selectedSlot, slotItems, inventory.items])

    const selectedCatalogItem = useMemo(() => {
        if (!selectedSlotItem) {
            return null
        }

        return items.find((item) => item.name === selectedSlotItem.name) ?? null
    }, [items, selectedSlotItem])

    const selectedItemIcon = selectedSlotItem?.icon || selectedCatalogItem?.icon || "/icons/weapon.svg"
    const selectedItemType = (
        (selectedSlotItem as { itemType?: string } | null)?.itemType
        || selectedCatalogItem?.type
        || ''
    ).toLowerCase()
    const isSelectedWeapon = selectedItemType === 'arma' || selectedItemType === 'distancia'
    const isSelectedDefensiveGear = ['armadura', 'elmo', 'escudo'].includes(selectedItemType)
    const selectedItemClassification = normalizeItemClassification(
        (selectedSlotItem as { classification?: string } | null)?.classification
    )

    const equippedItems = useMemo(() => {
        return equipmentSlotConfig.reduce((acc, slotConfig) => {
            const item = inventory.items.find((inventoryItem) => inventoryItem.slot === slotConfig.slotIndex) || null
            acc[slotConfig.key] = item
            return acc
        }, {} as Record<EquipmentSlotKey, (typeof inventory.items)[number] | null>)
    }, [inventory.items])

    const selectedEquipmentConfig = useMemo(() => {
        if (selectedSlot === null || selectedSlot >= 0) return null
        return equipmentSlotConfig.find((slotConfig) => slotConfig.slotIndex === selectedSlot) || null
    }, [selectedSlot])

    const regularEquipmentSlots = useMemo(
        () => equipmentSlotConfig.filter((slotConfig) => !slotConfig.key.startsWith('magic-')),
        []
    )

    const magicEquipmentSlots = useMemo(
        () => equipmentSlotConfig.filter((slotConfig) => slotConfig.key.startsWith('magic-')),
        []
    )

    const selectedSearchTypeFilter = useMemo(() => {
        if (!selectedEquipmentConfig) return undefined

        if (selectedEquipmentConfig.excludedTypeFilter && selectedEquipmentConfig.excludedTypeFilter.length > 0) {
            const blocked = new Set(selectedEquipmentConfig.excludedTypeFilter)
            return Array.from(new Set(items.map((item) => item.type.toLowerCase()))).filter(
                (type) => !blocked.has(type)
            )
        }

        return selectedEquipmentConfig.typeFilter.length > 0
            ? selectedEquipmentConfig.typeFilter
            : undefined
    }, [selectedEquipmentConfig, items])

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

    function normalizeItemClassification(value?: string): ItemClassification | undefined {
        if (!value) return undefined

        const normalized = value.toLowerCase().trim().normalize('NFD').replace(/[^\w\s-]/g, '')

        if (normalized === 'expert' || normalized === 'greater expert' || normalized === 'magica' || normalized === 'prateada') {
            return normalized as ItemClassification
        }

        return undefined
    }

    function getItemBorderClass(classification?: string) {
        const normalized = normalizeItemClassification(classification)

        if (normalized === 'expert') return 'border-amber-400'
        if (normalized === 'greater expert') return 'border-blue-500'
        if (normalized === 'magica') return 'border-violet-500'
        if (normalized === 'prateada') return 'border-zinc-300'

        return 'border-transparent'
    }

    function getItemTypeFromInventory(itemId: string) {
        const inventoryItem = inventory.items.find((item) => item.id === itemId)
        if (!inventoryItem) return ''

        const storedType = (inventoryItem as { itemType?: string }).itemType
        if (storedType) {
            return storedType.toLowerCase()
        }

        const catalogItem = items.find((item) => item.name === inventoryItem.name)
        return (catalogItem?.type || '').toLowerCase()
    }

    function canDropInEquipmentSlot(slotIndex: number, itemId: string) {
        const targetSlot = equipmentSlotConfig.find((slot) => slot.slotIndex === slotIndex)
        if (!targetSlot) return true

        const itemType = getItemTypeFromInventory(itemId)
        if (!itemType) return false

        if (targetSlot.excludedTypeFilter && targetSlot.excludedTypeFilter.length > 0) {
            return !targetSlot.excludedTypeFilter.includes(itemType)
        }

        return targetSlot.typeFilter.includes(itemType)
    }

    function moveItemToSlot(payload: DragPayload, targetSlotIndex: number) {
        const { itemId, fromSlotIndex } = payload
        if (fromSlotIndex === targetSlotIndex) return

        const draggedItem = inventory.items.find((item) => item.id === itemId)
        if (!draggedItem) return

        if (targetSlotIndex < 0 && !canDropInEquipmentSlot(targetSlotIndex, itemId)) {
            return
        }

        const targetItem = inventory.items.find((item) => item.slot === targetSlotIndex)

        handleInputChange()
        const nextItems = inventory.items.map((item) => {
            if (item.id === draggedItem.id) {
                return { ...item, slot: targetSlotIndex }
            }

            if (targetItem && item.id === targetItem.id) {
                return { ...item, slot: fromSlotIndex }
            }

            return item
        })

        updateInventory({
            ...inventory,
            items: nextItems,
        })
        saveCharacter()
    }

    function handleDragStart(event: React.DragEvent, itemId: string, fromSlotIndex: number) {
        const payload: DragPayload = {
            itemId,
            fromSlotIndex,
        }

        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('application/json', JSON.stringify(payload))
        event.dataTransfer.setData('text/plain', JSON.stringify(payload))
        setDraggedItemId(itemId)
        setDraggedFromSlotIndex(fromSlotIndex)
    }

    function readDragPayload(event: React.DragEvent): DragPayload | null {
        const rawJson = event.dataTransfer.getData('application/json') || event.dataTransfer.getData('text/plain')

        if (rawJson) {
            try {
                const parsed = JSON.parse(rawJson) as Partial<DragPayload>
                if (parsed && typeof parsed.itemId === 'string') {
                    return {
                        itemId: parsed.itemId,
                        fromSlotIndex: typeof parsed.fromSlotIndex === 'number' ? parsed.fromSlotIndex : draggedFromSlotIndex ?? -1,
                    }
                }
            } catch {
                // fallback below
            }
        }

        if (draggedItemId && draggedFromSlotIndex !== null) {
            return {
                itemId: draggedItemId,
                fromSlotIndex: draggedFromSlotIndex,
            }
        }

        return null
    }

    function handleDragEnd() {
        setDraggedItemId(null)
        setDraggedFromSlotIndex(null)
    }

    function handleDragOver(event: React.DragEvent, targetSlotIndex: number) {
        if (targetSlotIndex >= 0) {
            event.preventDefault()
            event.dataTransfer.dropEffect = 'move'
            return
        }

        const payload = readDragPayload(event)
        if (!payload) {
            return
        }

        if (!canDropInEquipmentSlot(targetSlotIndex, payload.itemId)) {
            return
        }

        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }

    function handleDrop(event: React.DragEvent, targetSlotIndex: number) {
        event.preventDefault()

        try {
            const payload = readDragPayload(event)
            if (!payload) return
            moveItemToSlot(payload, targetSlotIndex)
        } catch {
            return
        } finally {
            setDraggedItemId(null)
            setDraggedFromSlotIndex(null)
        }
    }

    function openSlot(slotIndex: number) {
        const slotItem =
            slotIndex < 0
                ? inventory.items.find((item) => item.slot === slotIndex)
                : slotItems[slotIndex]

        setSelectedSlot(slotIndex)

        if (slotItem) {
            setEditingQuantity(Math.max(1, slotItem.qtd))
            setEditingDescription(String(slotItem.description || ''))
            setEditingAttackBonus(Math.max(-99, Number((slotItem as { attackBonus?: number }).attackBonus ?? 0) || 0))
            setEditingCustomDamage(String((slotItem as { customDamage?: string }).customDamage ?? ''))
            setEditingCustomArmorClass(Number((slotItem as { customArmorClass?: number }).customArmorClass ?? 0) || 0)
            setEditingClassification(normalizeItemClassification((slotItem as { classification?: string }).classification))
            setIsEditingItem(false)
            setIsItemDetailsOpen(true)
            return
        }

        setIsSearchOpen(true)
    }

    function openEquipmentSlot(slotKey: EquipmentSlotKey) {
        const slotConfig = equipmentSlotConfig.find((config) => config.key === slotKey)
        if (!slotConfig) return
        openSlot(slotConfig.slotIndex)
    }

    function handleSelectItem(item: Item) {
        if (selectedSlot === null) {
            return
        }

        handleInputChange()

        const existingItemInSlot = inventory.items.find((inventoryItem) => inventoryItem.slot === selectedSlot)
        const newItem = {
            id: existingItemInSlot?.id || v4(),
            name: item.name,
            qtd: 1,
            description: item.effect || item.obs || '',
            ev: item.ev ?? 0,
            icon: item.icon,
            itemType: item.type.toLowerCase(),
            attackBonus: ['arma', 'distancia'].includes(item.type.toLowerCase())
                ? Number((existingItemInSlot as { attackBonus?: number } | undefined)?.attackBonus ?? 0)
                : undefined,
            customDamage: ['arma', 'distancia'].includes(item.type.toLowerCase())
                ? String((existingItemInSlot as { customDamage?: string } | undefined)?.customDamage ?? '')
                : undefined,
            customArmorClass: ['armadura', 'elmo', 'escudo'].includes(item.type.toLowerCase())
                ? Number((existingItemInSlot as { customArmorClass?: number } | undefined)?.customArmorClass ?? 0)
                : undefined,
            classification: normalizeItemClassification(
                (existingItemInSlot as { classification?: string } | undefined)?.classification
            ),
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

    function updateCoin(type: 'platinum' | 'gold' | 'silver' | 'copper', value: number) {
        const safeValue = Number.isNaN(value) ? 0 : Math.max(0, value)

        handleInputChange()
        updateCharacter({
            ...character,
            treasure: {
                ...character.treasure,
                [type]: safeValue,
            },
        })
        saveCharacter()
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
                        description: editingDescription,
                        attackBonus: isSelectedWeapon
                            ? Math.max(-99, Number.isNaN(editingAttackBonus) ? 0 : editingAttackBonus)
                            : undefined,
                        customDamage: isSelectedWeapon ? editingCustomDamage.trim() : undefined,
                        customArmorClass: isSelectedDefensiveGear
                            ? (Number.isNaN(editingCustomArmorClass) ? 0 : editingCustomArmorClass)
                            : undefined,
                        classification: editingClassification,
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
                <div id="current-ev" className="flex-1 flex gap-2 items-center bg-card border rounded-md p-2 text-center">
                    <span className="block text-xs text-muted-foreground">Atual</span>
                    <span className="block text-lg font-semibold">{character.encumbrance.total}</span>
                </div>
                <div id="weighted" className="flex-1 flex gap-2 items-center bg-card border rounded-md p-2 text-center">
                    <span className="block text-xs text-muted-foreground">Pesado</span>
                    <span className="block text-lg font-semibold">{character.encumbrance.rating}</span>
                </div>
                <div id="overloaded" className="flex-1 flex gap-2 items-center bg-card border rounded-md p-2 text-center">
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
                <div id="equipamento" className="bg-card rounded-md p-1 2xs:p-2 xs:p-3 flex gap-1 2xs:gap-2 items-start">
                    <div className="flex flex-col gap-1 2xs:gap-2">
                        {regularEquipmentSlots.map((slotConfig) => {
                        const equippedItem = equippedItems[slotConfig.key]
                        const equippedIcon = equippedItem
                            ? normalizeItemIcon(
                                equippedItem.icon ||
                                items.find((item) => item.name === equippedItem.name)?.icon ||
                                slotConfig.icon
                            )
                            : slotConfig.icon

                        return (
                            <div key={slotConfig.key} className="relative w-12 h-12">
                                <button
                                    type="button"
                                    id={slotConfig.id}
                                    onClick={() => openEquipmentSlot(slotConfig.key)}
                                    draggable={Boolean(equippedItem)}
                                    onDragStart={(event) => {
                                        if (!equippedItem) return
                                        handleDragStart(event, equippedItem.id, slotConfig.slotIndex)
                                    }}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(event) => handleDragOver(event, slotConfig.slotIndex)}
                                    onDrop={(event) => handleDrop(event, slotConfig.slotIndex)}
                                    className={cn(
                                        "bg-accent rounded-md w-12 h-12 flex justify-center items-center overflow-hidden border-2",
                                        equippedItem ? getItemBorderClass((equippedItem as { classification?: string }).classification) : "border-transparent"
                                    )}
                                    title={equippedItem ? `${equippedItem.name} (trocar)` : slotConfig.searchTitle}
                                >
                                    <Image
                                        src={equippedIcon}
                                        alt={slotConfig.alt}
                                        height={equippedItem ? 44 : 32}
                                        width={equippedItem ? 44 : 32}
                                        className={equippedItem ? "rounded-md opacity-85" : "opacity-50"}
                                        draggable={false}
                                    />

                                    {equippedItem && equippedItem.qtd > 1 ? (
                                        <span className="absolute -top-1 -right-1 bg-card-foreground text-card text-[10px] leading-none px-1 py-0.5 rounded-full min-w-4 text-center">
                                            {equippedItem.qtd}
                                        </span>
                                    ) : null}

                                    {equippedItem && draggedItemId === equippedItem.id ? (
                                        <span className="absolute inset-0 bg-background/40" />
                                    ) : null}
                                </button>
                            </div>
                        )
                    })}

                    <button
                        type="button"
                        id="moedas"
                        onClick={() => setIsCoinsDialogOpen(true)}
                        className="relative bg-accent rounded-md w-12 h-12 flex justify-center items-center overflow-hidden"
                        title="Adicionar moedas"
                    >
                        <Image src="/icons/coins.svg" alt="moedas" height={44} width={44} className="rounded-md opacity-85" />
                        <span className="absolute -bottom-0.5 text-[9px] font-semibold text-card-foreground bg-card px-1 rounded-md">
                            {character.treasure.gold} PO
                        </span>
                    </button>
                    </div>

                    <div className="flex flex-col gap-1 2xs:gap-2">
                        {magicEquipmentSlots.map((slotConfig) => {
                            const equippedItem = equippedItems[slotConfig.key]
                            const equippedIcon = equippedItem
                                ? normalizeItemIcon(
                                    equippedItem.icon ||
                                    items.find((item) => item.name === equippedItem.name)?.icon ||
                                    slotConfig.icon
                                )
                                : slotConfig.icon

                            return (
                                <div key={slotConfig.key} className="relative w-12 h-12">
                                    <button
                                        type="button"
                                        id={slotConfig.id}
                                        onClick={() => openEquipmentSlot(slotConfig.key)}
                                        draggable={Boolean(equippedItem)}
                                        onDragStart={(event) => {
                                            if (!equippedItem) return
                                            handleDragStart(event, equippedItem.id, slotConfig.slotIndex)
                                        }}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={(event) => handleDragOver(event, slotConfig.slotIndex)}
                                        onDrop={(event) => handleDrop(event, slotConfig.slotIndex)}
                                        className={cn(
                                            "bg-accent rounded-md w-12 h-12 flex justify-center items-center overflow-hidden border-2",
                                            equippedItem ? getItemBorderClass((equippedItem as { classification?: string }).classification) : "border-transparent"
                                        )}
                                        title={equippedItem ? `${equippedItem.name} (trocar)` : slotConfig.searchTitle}
                                    >
                                        <Image
                                            src={equippedIcon}
                                            alt={slotConfig.alt}
                                            height={equippedItem ? 44 : 32}
                                            width={equippedItem ? 44 : 32}
                                            className={equippedItem ? "rounded-md opacity-85" : "opacity-50"}
                                            draggable={false}
                                        />

                                        {equippedItem && equippedItem.qtd > 1 ? (
                                            <span className="absolute -top-1 -right-1 bg-card-foreground text-card text-[10px] leading-none px-1 py-0.5 rounded-full min-w-4 text-center">
                                                {equippedItem.qtd}
                                            </span>
                                        ) : null}

                                        {equippedItem && draggedItemId === equippedItem.id ? (
                                            <span className="absolute inset-0 bg-background/40" />
                                        ) : null}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div id="itens" className="flex">
                    <div className="rounded-md p-1 2xs:p-2 xs:p-3 bg-card grid grid-cols-4 auto-rows-12 gap-1 2xs:gap-2">
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
                                    className={cn(
                                        "relative bg-accent rounded-md w-11 2xs:w-12 h-11 2xs:h-12 flex items-center justify-center overflow-hidden border-2",
                                        slotItem ? getItemBorderClass((slotItem as { classification?: string }).classification) : "border-transparent"
                                    )}
                                    onClick={() => openSlot(slotIndex)}
                                    draggable={Boolean(slotItem)}
                                    onDragStart={(event) => {
                                        if (!slotItem) return
                                        handleDragStart(event, slotItem.id, slotIndex)
                                    }}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(event) => handleDragOver(event, slotIndex)}
                                    onDrop={(event) => handleDrop(event, slotIndex)}
                                >
                                    {slotItem && itemIcon ? (
                                        <Image
                                            src={itemIcon}
                                            alt={slotItem.name}
                                            height="44"
                                            width="44"
                                            className=" rounded-md opacity-85"
                                            draggable={false}
                                        />
                                    ) : null}
                                    {slotItem && slotItem.qtd > 1 ? (
                                        <span className="absolute -top-1 -right-1 bg-card-foreground text-card text-[10px] leading-none px-1 py-0.5 rounded-full min-w-4 text-center">
                                            {slotItem.qtd}
                                        </span>
                                    ) : null}

                                    {slotItem && draggedItemId === slotItem.id ? (
                                        <span className="absolute inset-0 bg-background/40" />
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
                typeFilter={selectedSearchTypeFilter}
                title={selectedEquipmentConfig?.searchTitle || "Buscar Item para Slot"}
            />

            <Dialog open={isCoinsDialogOpen} onOpenChange={setIsCoinsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Moedas</DialogTitle>
                        <DialogDescription>Defina as quantidades no saco de dinheiro.</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label htmlFor="coins-platinum" className="text-sm">Platina</label>
                            <Input
                                id="coins-platinum"
                                type="number"
                                min={0}
                                value={character.treasure.platinum}
                                onChange={(event) => updateCoin('platinum', Number(event.target.value))}
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="coins-gold" className="text-sm">Ouro</label>
                            <Input
                                id="coins-gold"
                                type="number"
                                min={0}
                                value={character.treasure.gold}
                                onChange={(event) => updateCoin('gold', Number(event.target.value))}
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="coins-silver" className="text-sm">Prata</label>
                            <Input
                                id="coins-silver"
                                type="number"
                                min={0}
                                value={character.treasure.silver}
                                onChange={(event) => updateCoin('silver', Number(event.target.value))}
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="coins-copper" className="text-sm">Cobre</label>
                            <Input
                                id="coins-copper"
                                type="number"
                                min={0}
                                value={character.treasure.copper}
                                onChange={(event) => updateCoin('copper', Number(event.target.value))}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" onClick={() => setIsCoinsDialogOpen(false)}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isItemDetailsOpen}
                onOpenChange={(open) => {
                    setIsItemDetailsOpen(open)

                    if (!open) {
                        setIsEditingItem(false)
                        setSelectedSlot(null)
                        setEditingDescription('')
                        setEditingAttackBonus(0)
                        setEditingCustomDamage('')
                        setEditingCustomArmorClass(0)
                        setEditingClassification(undefined)
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedSlotItem?.name || "Item do Slot"}</DialogTitle>
                        <DialogDescription>
                            {selectedSlotItem
                                ? selectedEquipmentConfig
                                    ? `Equipamento: ${selectedEquipmentConfig.alt}`
                                    : `Slot ${selectedSlot !== null ? selectedSlot + 1 : ""}`
                                : "Item não encontrado"}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSlotItem ? (
                        <div className="space-y-4">
                            <div className={cn("flex items-center gap-3 rounded-md border-2 p-3", getItemBorderClass(selectedItemClassification))}>
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

                                    <label htmlFor="slot-item-description" className="text-sm font-medium">
                                        Descricao
                                    </label>
                                    <Textarea
                                        id="slot-item-description"
                                        value={editingDescription}
                                        onChange={(event) => setEditingDescription(event.target.value)}
                                        className="min-h-20"
                                        placeholder="Adicione uma descricao para este item"
                                    />

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Classificacao</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {itemClassificationOptions.map((option) => (
                                                <Button
                                                    key={option.value}
                                                    type="button"
                                                    variant={editingClassification === option.value ? "default" : "outline"}
                                                    className={cn(
                                                        "h-9 justify-center border-2",
                                                        getItemBorderClass(option.value)
                                                    )}
                                                    onClick={() => setEditingClassification(option.value)}
                                                >
                                                    {option.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {isSelectedWeapon ? (
                                        <>
                                            <label htmlFor="slot-item-attack-bonus" className="text-sm font-medium">
                                                Bonus de Ataque
                                            </label>
                                            <Input
                                                id="slot-item-attack-bonus"
                                                type="number"
                                                value={editingAttackBonus}
                                                onFocus={(event) => event.target.select()}
                                                onChange={(event) => {
                                                    const parsedValue = Number(event.target.value)
                                                    setEditingAttackBonus(Number.isNaN(parsedValue) ? 0 : parsedValue)
                                                }}
                                            />

                                            <label htmlFor="slot-item-custom-damage" className="text-sm font-medium">
                                                Dano Personalizado
                                            </label>
                                            <Input
                                                id="slot-item-custom-damage"
                                                placeholder="Ex: 1d8+2"
                                                value={editingCustomDamage}
                                                onFocus={(event) => event.target.select()}
                                                onChange={(event) => setEditingCustomDamage(event.target.value)}
                                            />
                                        </>
                                    ) : null}

                                    {isSelectedDefensiveGear ? (
                                        <>
                                            <label htmlFor="slot-item-custom-ac" className="text-sm font-medium">
                                                CA Personalizada
                                            </label>
                                            <Input
                                                id="slot-item-custom-ac"
                                                type="number"
                                                value={editingCustomArmorClass}
                                                onFocus={(event) => event.target.select()}
                                                onChange={(event) => {
                                                    const parsedValue = Number(event.target.value)
                                                    setEditingCustomArmorClass(Number.isNaN(parsedValue) ? 0 : parsedValue)
                                                }}
                                            />
                                        </>
                                    ) : null}
                                </div>
                            ) : (
                                    <div className="text-sm space-y-1">
                                        <p>
                                            <span className="font-semibold">Quantidade:</span> {selectedSlotItem.qtd}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Classificacao:</span>{' '}
                                            {selectedItemClassification
                                                ? itemClassificationOptions.find((option) => option.value === selectedItemClassification)?.label
                                                : '-'}
                                        </p>
                                        {isSelectedWeapon ? (
                                            <p>
                                                <span className="font-semibold">Bonus de Ataque:</span>{' '}
                                                {Number((selectedSlotItem as { attackBonus?: number }).attackBonus ?? 0) >= 0 ? '+' : ''}
                                                {Number((selectedSlotItem as { attackBonus?: number }).attackBonus ?? 0)}
                                            </p>
                                        ) : null}
                                        {isSelectedWeapon ? (
                                            <p>
                                                <span className="font-semibold">Dano Personalizado:</span>{' '}
                                                {(selectedSlotItem as { customDamage?: string }).customDamage || '-'}
                                            </p>
                                        ) : null}
                                        {isSelectedDefensiveGear ? (
                                            <p>
                                                <span className="font-semibold">CA Personalizada:</span>{' '}
                                                {Number((selectedSlotItem as { customArmorClass?: number }).customArmorClass ?? 0)}
                                            </p>
                                        ) : null}
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