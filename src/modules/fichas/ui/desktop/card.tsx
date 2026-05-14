import { Card, CardTitle } from "@/components/ui/card"

function CharCard({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <Card className='flex flex-col gap-1 overflow-hidden'>
            <CardTitle className='bg-accent p-2 -mt-6'>{title}</CardTitle>
            <div className='flex flex-col gap-1 p-2'>
                {children}
            </div>
        </Card>
    )
}

export default CharCard