import React from 'react'
import wlecome from '@/public/assets/welcome.jpg'
import Image from 'next/image'
import Link from 'next/link'

const page = () => {
    return (
        <>
            <div className="container mx-auto grid grid-cols-12 justify-center items-center h-screen p-3">
                <div className="col-span-12 md:col-span-6 grid gap-2">
                    <h1 className='font-bold text-3xl'>Ya casi estamos! Confirma tu direccion de correo electronico.</h1>
                    <p className='text-sm text-slate-600 mt-4 mb-5'>Hemos enviado un enlace de verificacion a tu correo. 📩 </p>
                </div>
                <div className="col-span-12 md:col-span-6 h-full flex flex-col md:justify-center">
                    <Image src={wlecome} width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto' }}
                        priority
                        alt='Verificar correo' />
                </div>
            </div>
        </>
    )
}

export default page