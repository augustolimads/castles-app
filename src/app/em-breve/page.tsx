import Image from 'next/image'
import React from 'react'

function page() {
    return (
        <div className=' w-full min-h-screen border flex flex-col items-center pt-20'>
            <p className='text-center text-2xl font-bold'>
                Página em construção
            </p>
            <Image src="/under-construction.gif" alt="Under Construction" width={300} height={300} />
        </div>
    )
}

export default page