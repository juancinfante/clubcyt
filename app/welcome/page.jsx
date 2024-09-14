import React from 'react'
import wlecome from '@/public/assets/welcome.jpg'
import Image from 'next/image'
import Link from 'next/link'

const page = () => {
    return (
        <>
            <div className="container mx-auto grid grid-cols-12 justify-center items-center h-screen p-3">
                <div className="col-span-12 md:col-span-6 grid gap-2">
                    <h1 className='font-bold text-3xl'>Te damos la bienvenida a la comunidad de Club CyT</h1>
                    <p className='text-sm text-slate-600 mt-4 mb-5'>Suscríbete y descubre tradiciones, destinos y actividades inolvidables que no te querrás perder. ¡Explora con nosotros!</p>
                    <div className="flex gap-3">
                        <Link href={'/productos'}
                            className='bg-indigo-500 text-white text-center flex-1 p-3 text-sm border rounded '>
                            Explorar productos
                        </Link>
                        <Link href={'/productos'}
                            className='bg-yellow-400 text-white text-center flex-1 p-3 text-sm border rounded '>
                            Suscribirse
                        </Link>
                    </div>
                </div>
                <div className="col-span-12 md:col-span-6 h-full flex flex-col md:justify-center">
                    <Image src={wlecome} width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto' }} />
                </div>
            </div>
        </>
    )
}

export default page