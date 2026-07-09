import classNames from "classnames"

type DerivatedCardProps = {
    isHighlighted?: boolean
    label: string
    value: string | number
}

function DerivatedCard({ isHighlighted, label, value }: DerivatedCardProps) {
    return (
        <div className={classNames("flex gap-1 rounded-md p-1 justify-center items-center flex-1 border border-card-foreground", { "bg-card-foreground text-card": isHighlighted, "bg-card text-card-foreground": !isHighlighted })}>
            <span className="text-xs">{label}</span>
            <span className="text-xl">{value}</span>
        </div>
    )
}


function Derivated() {
    return (
        <div className="flex gap-2 justify-between">
            <DerivatedCard label="CA" value={19} isHighlighted={true} />
            <DerivatedCard label="BBA" value={'+1'} />
            <DerivatedCard label="Vel." value={'30ft'} />
            <DerivatedCard label="Cap." value={0} />
        </div>
    )
}

export default Derivated