import Image from 'next/image'
import React from 'react'
import Food from '../public/assets/food.svg'
import Peluqueria from '../public/assets/barber-shop.svg'
import Comercio from '../public/assets/comercio.svg'
import Obrasocial from '../public/assets/obrasocial.svg'
import Turismo from '../public/assets/turismo.svg'
import Eventos from '../public/assets/eventos.svg'
import Optica from '../public/assets/optica.svg'
import Hotel from '../public/assets/hotel.svg'
import Link from 'next/link'


const Categorias = ({ setCategoria }) => {
    return (
        <>
            <div className="container mx-auto max-w-7xl p-4 m-4">
                <div className="flex justify-between gap-7 overflow-scroll md:overflow-hidden custom-scrollbar">
                        <div onClick={() => setCategoria("Gastronomia")} className='flex flex-col items-center mb-3'>
                            <div className="w-24 h-24 border flex justify-center items-center rounded-full p-6 hover:bg-indigo-100 hover:cursor-pointer">
                                <Food className="w-full h-full" />
                            </div>
                            <p className='text-sm mt-2'>Gastronomia</p>
                        </div>
                        <div onClick={() => setCategoria("Hotel")} className='flex flex-col items-center mb-3'>
                            <div className="w-24 h-24 border flex justify-center items-center rounded-full p-6 hover:bg-indigo-100 hover:cursor-pointer">
                                <Hotel className="w-full h-full" />
                            </div>
                            <p className='text-sm mt-2'>Hotel</p>
                        </div>
                        <div onClick={() => setCategoria("Peluqueria")} className='flex flex-col items-center mb-3'>
                            <div className="w-24 h-24 border flex justify-center items-center rounded-full p-6 hover:bg-indigo-100 hover:cursor-pointer">
                                <Peluqueria className="w-full h-full" />
                            </div>
                            <p className='text-sm mt-2'>Peluqueria</p>
                        </div>
                        <div onClick={() => setCategoria("Area Turistica")} className='flex flex-col items-center mb-3'>
                            <div className="w-24 h-24 border flex justify-center items-center rounded-full p-6 hover:bg-indigo-100 hover:cursor-pointer">
                                <Turismo className="w-full h-full" />
                            </div>
                            <p className='text-sm mt-2'>Area Turistica</p>
                        </div>
                        <div onClick={() => setCategoria("Eventos")} className='flex flex-col items-center mb-3'>
                            <div className="w-24 h-24 border flex justify-center items-center rounded-full p-6 hover:bg-indigo-100 hover:cursor-pointer">
                                <Eventos className="w-full h-full" />
                            </div>
                            <p className='text-sm mt-2'>Eventos</p>
                        </div>
                        <div onClick={() => setCategoria("Area Comercial")} className='flex flex-col items-center mb-3'>
                            <div className="w-24 h-24 border flex justify-center items-center rounded-full p-6 hover:bg-indigo-100 hover:cursor-pointer">
                                <Comercio className="w-full h-full" />
                            </div>
                            <p className='text-sm mt-2'>Area Comercial</p>
                        </div>
                        <div onClick={() => setCategoria("Optica")} className='flex flex-col items-center mb-3'>

                            <div className="w-24 h-24 border flex justify-center items-center rounded-full p-6 hover:bg-indigo-100 hover:cursor-pointer">
                                <Optica className="w-full h-full" />
                            </div>
                            <p className='text-sm mt-2'>Optica</p>
                        </div>
                        <div onClick={() => setCategoria("Obra social")} className='flex flex-col items-center mb-3'>

                            <div className="w-24 h-24 border flex justify-center items-center rounded-full p-6 hover:bg-indigo-100 hover:cursor-pointer">
                                <Obrasocial className="w-full h-full" />
                            </div>
                            <p className='text-sm mt-2'>Obra social</p>
                        </div>
                </div>
            </div>
        </>
    )
}

export default Categorias