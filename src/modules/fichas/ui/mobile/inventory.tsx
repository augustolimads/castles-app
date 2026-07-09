import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useCharacterStore } from "@/modules/fichas/stores/character"
import { useInventoryStore } from "@/modules/fichas/stores/inventory"
import { Info } from "lucide-react"
import Image from "next/image"
import { useMemo } from "react"

function inventory() {
    const character = useCharacterStore()
    useInventoryStore()

    const itemSlots = useMemo(() => Array.from({ length: 30 }, (_, slotIndex) => `slot-${slotIndex + 1}`), [])

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
                    <div className="bg-accent rounded-sm w-12 h-12 flex justify-center items-center">
                        <Image src="/icons/helmet.svg" alt="elmo" height="32" width="32" className="opacity-50" />
                    </div>
                    <div className="bg-accent rounded-sm w-12 h-12 flex justify-center items-center">
                        <Image src="/icons/ammo.svg" alt="munição" height="32" width="32" className="opacity-50" />
                    </div>
                    <div className="bg-accent rounded-sm w-12 h-12 flex justify-center items-center">
                        <Image src="/icons/armor.svg" alt="armadura" height="32" width="32" className="opacity-50" />
                </div>
                    <div className="bg-accent rounded-sm w-12 h-12 flex justify-center items-center">
                        <Image src="/icons/weapon.svg" alt="arma" height="32" width="32" className="opacity-50" />
                    </div>
                    <div className="bg-accent rounded-sm w-12 h-12 flex justify-center items-center">
                        <Image src="/icons/shield.svg" alt="escudo" height="32" width="32" className="opacity-50" />
                    </div>
                    <div className="bg-accent rounded-sm w-12 h-12 flex justify-center items-center">
                        <Image src="/icons/coins.svg" alt="moedas" height="32" width="32" className="opacity-50" />
                    </div>
                </div>
                <div id="itens" className="flex">
                    <div className="rounded-sm p-1 2xs:p-2 xs:p-3 bg-card grid grid-cols-5 auto-rows-12 gap-1 2xs:gap-2">
                        {itemSlots.map((slotId) => (
                            <div key={slotId} className="bg-accent rounded-sm w-11 2xs:w-12 h-11 2xs:h-12">
                                1
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default inventory