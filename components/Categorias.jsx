import React from 'react'
import Food from '../public/assets/food.svg'
import Comercio from '../public/assets/comercio.svg'
import Obrasocial from '../public/assets/obrasocial.svg'
import Turismo from '../public/assets/turismo.svg'
import Eventos from '../public/assets/eventos.svg'
import Hotel from '../public/assets/hotel.svg'
import Tourism from '../public/assets/tourism.svg'
import Discount from '../public/assets/discount.svg'
import Museum from '../public/assets/museum.svg'

const Categorias = ({ setCategoria }) => {
    return (
        <>
            <div className="container mx-auto max-w-6xl px-2 mb-4">
                <div className="flex justify-between gap-7 overflow-scroll md:overflow-hidden custom-scrollbar">
                        <div onClick={() => setCategoria("Hotel")} className='flex flex-col items-center mb-3'>
                            <div className="w-16 h-16 p-4 border flex justify-center items-center rounded-full hover:bg-indigo-100 hover:cursor-pointer">
                                <Hotel className="w-full h-full" />
                            </div>
                            <p className='text-xs mt-2'>Hoteles</p>
                        </div>
                        <div onClick={() => setCategoria("Gastronomia")} className='flex flex-col items-center mb-3'>
                            <div className="w-16 h-16 p-4 border flex justify-center items-center rounded-full hover:bg-indigo-100 hover:cursor-pointer">
                                <Food className="w-full h-full" />
                            </div>
                            <p className='text-xs mt-2'>Gastronomia</p>
                        </div>
                        <div onClick={() => setCategoria("Area Comercial")} className='flex flex-col items-center mb-3'>
                            <div className="w-16 h-16 p-4 border flex justify-center items-center rounded-full hover:bg-indigo-100 hover:cursor-pointer">
                                <Comercio className="w-full h-full" />
                            </div>
                            <p className='text-xs mt-2'>Area Comercial</p>
                        </div>
                        <div onClick={() => setCategoria("Area Turistica")} className='flex flex-col items-center mb-3'>
                            <div className="w-16 h-16 p-4 border flex justify-center items-center rounded-full hover:bg-indigo-100 hover:cursor-pointer">
                                <Turismo className="w-full h-full" />
                            </div>
                            <p className='text-xs mt-2'>Area Turistica</p>
                        </div>
                        <div onClick={() => setCategoria("Eventos")} className='flex flex-col items-center mb-3'>
                            <div className="w-16 h-16 p-4 border flex justify-center items-center rounded-full hover:bg-indigo-100 hover:cursor-pointer">
                                <Eventos className="w-full h-full" />
                            </div>
                            <p className='text-xs mt-2'>Eventos</p>
                        </div>
                        <div onClick={() => setCategoria("Obra social")} className='flex flex-col items-center mb-3'>

                            <div className="w-16 h-16 p-4 border flex justify-center items-center rounded-full hover:bg-indigo-100 hover:cursor-pointer">
                                <Tourism className="w-full h-full" />
                            </div>
                            <p className='text-xs mt-2'>Turismo</p>
                        </div>
                        <div onClick={() => setCategoria("Obra social")} className='flex flex-col items-center mb-3'>

                            <div className="w-16 h-16 p-4 border flex justify-center items-center rounded-full hover:bg-indigo-100 hover:cursor-pointer">
                                <Museum className="w-full h-full" />
                            </div>
                            <p className='text-xs mt-2'>Museos</p>
                        </div>
                        <div onClick={() => setCategoria("Obra social")} className='flex flex-col items-center mb-3'>

                            <div className="w-16 h-16 p-4 border flex justify-center items-center rounded-full hover:bg-indigo-100 hover:cursor-pointer">
                                <Discount className="w-full h-full" />
                            </div>
                            <p className='text-xs mt-2'>Promociones</p>
                        </div>
                </div>
            </div>
        </>
    )
}

export default Categorias