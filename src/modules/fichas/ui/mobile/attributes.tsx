
type AttributeType = "primary" | "secondary" | "tertiary"

type AttributeProps = {
    type: AttributeType
}

function Attribute({ type }: AttributeProps) {
    if (type === "primary") {
        return (
            <div className='relative rounded-lg border-2 border-card-400 bg-card-400 text-sm flex flex-col items-center text-card-foreground'>
                <span>for</span>
                <span className='font-bold text-xl'>13</span>
                <span className='bg-amber-500 w-full text-center rounded-b-md text-white font-bold'>+1</span>
            </div>
        )
    }
    if (type === "secondary") {
        return (
            <div className='relative rounded-lg border-2 border-card-300 bg-card-300 text-sm flex flex-col items-center text-card-foreground'>
                <span>for</span>
                <span className='font-bold text-xl'>13</span>
                <span className='bg-slate-400 w-full text-center rounded-b-md text-white font-bold'>+1</span>
            </div>
        )
    }
    return (
        <div className='relative rounded-lg border-2 border-card-700 bg-card-700 text-sm flex flex-col items-center text-card-foreground'>
            <span>for</span>
            <span className='font-bold text-xl'>13</span>
            <span className='bg-orange-900 w-full text-center rounded-b-md text-white font-bold'>+1</span>
        </div>
    )
}

function Attributes() {
    return (
        <div className='grid grid-cols-6 gap-1'>
            <Attribute type="primary" />
            <Attribute type="primary" />
            <Attribute type="primary" />
            <Attribute type="secondary" />
            <Attribute type="secondary" />
            <Attribute type="tertiary" />
        </div>
    )
}

export default Attributes