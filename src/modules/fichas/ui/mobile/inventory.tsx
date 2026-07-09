import { Badge } from "@/components/ui/badge"
import Image from "next/image"

function inventory() {
    return (
        <div className="flex justify-around gap-1 2xs:gap-2 xs:gap-3 mt-2">
            <div id="equipamento" className="bg-card text-card-foreground border border-border rounded-sm p-1 2xs:p-2 xs:p-3 flex flex-col gap-1 2xs:gap-2">
                <div className="relative bg-muted rounded-sm border border-border w-12 h-12 flex justify-center items-center">
                    <Image src="/icons/helmet.svg" alt="elmo" height="32" width="32" className="opacity-50" />
                </div>
                <div className="bg-muted rounded-sm border border-border w-12 h-12 flex justify-center items-center">
                    <Image src="/icons/ammo.svg" alt="munição" height="32" width="32" className="opacity-50" />
                </div>
                <div className="bg-muted rounded-sm border border-border w-12 h-12 flex justify-center items-center">
                    <Image src="/icons/armor.svg" alt="armadura" height="32" width="32" className="opacity-50" />
                </div>
                <div className="bg-muted rounded-sm border border-border w-12 h-12 flex justify-center items-center">
                    <Image src="/icons/weapon.svg" alt="arma" height="32" width="32" className="opacity-50" />
                </div>
                <div className="bg-muted rounded-sm border border-border w-12 h-12 flex justify-center items-center">
                    <Image src="/icons/shield.svg" alt="escudo" height="32" width="32" className="opacity-50" />
                </div>
                <div className="bg-muted rounded-sm border border-border w-12 h-12 flex justify-center items-center">
                    <Image src="/icons/coins.svg" alt="moedas" height="32" width="32" className="opacity-50" />
                </div>
            </div>
            <div id="itens" className="flex">
                <div className="rounded-sm p-1 2xs:p-2 xs:p-3 bg-card text-card-foreground border border-border grid grid-cols-5 auto-rows-12 gap-1 2xs:gap-2">
                    {Array.from({ length: 30 }, (_, index) => index + 1).map((slotId) => (
                        <div key={`slot-${slotId}`} className="bg-muted border border-border rounded-sm w-11 2xs:w-12 h-11 2xs:h-12">
                            oi
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default inventory