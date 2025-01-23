import React from 'react'
import Food from '../public/assets/food.svg'
import Comercio from '../public/assets/comercio.svg'
import Turismo from '../public/assets/turismo.svg'
import Eventos from '../public/assets/eventos.svg'
import Hotel from '../public/assets/hotel.svg'
import Tourism from '../public/assets/tourism.svg'
import Discount from '../public/assets/discount.svg'
import Museum from '../public/assets/museum.svg'
import { Dropdown, DropdownItem, DropdownTrigger, DropdownMenu } from '@nextui-org/dropdown'

const Categorias = ({ setCategoria }) => {
    return (
        <>
            <div className="container mx-auto max-w-7xl mb-4">
                <div className="flex justify-between gap-7 overflow-scroll md:overflow-hidden custom-scrollbar">
                    <div onClick={() => setCategoria("")} className='flex flex-col items-center mb-3'>
                        <div className="w-16 h-16 p-4 border flex justify-center items-center rounded-full hover:bg-indigo-100 hover:cursor-pointer">
                            🔵
                        </div>
                        <p className='text-xs mt-2'>Todos</p>
                    </div>
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
                        <p className='text-xs mt-2 text-center'>Area Comercial</p>
                    </div>
                    <div onClick={() => setCategoria("Area Turistica")} className='flex flex-col items-center mb-3'>
                        <div className="w-16 h-16 p-4 border flex justify-center items-center rounded-full hover:bg-indigo-100 hover:cursor-pointer">
                            <Turismo className="w-full h-full" />
                        </div>
                        <p className='text-xs mt-2 text-center'>Area Turistica</p>
                    </div>
                    <Dropdown>
                        <DropdownTrigger>
                            <div className='flex flex-col items-center mb-3'>
                                <div className="w-16 h-16 p-4 border flex justify-center items-center rounded-full hover:bg-indigo-100 hover:cursor-pointer">
                                    <Eventos className="w-full h-full" />
                                </div>
                                <p className='text-xs mt-2'>Eventos</p>
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                            <DropdownItem href="https://terraviva.com.ar/agenda/Santiago%20del%20Estero/12/1" target='_blank'>
                                    Santiago del Estero
                            </DropdownItem>
                            <DropdownItem href="https://terraviva.com.ar/agenda/Tucuman/12/1" target='_blank'>Tucuman</DropdownItem>
                            <DropdownItem href="https://terraviva.com.ar/agenda/Catamarca/12/1" target='_blank'>Catamarca</DropdownItem>
                            <DropdownItem href="https://terraviva.com.ar/agenda/Salta/12/1" target='_blank'>Salta</DropdownItem>
                            <DropdownItem href="https://terraviva.com.ar/agenda/Jujuy/12/1" target='_blank'>Jujuy</DropdownItem>
                            <DropdownItem href="https://terraviva.com.ar/agenda/La%20Rioja/12/1" target='_blank'>La Rioja</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <div onClick={() => setCategoria("Turismo")} className='flex flex-col items-center mb-3'>

                        <div className="w-16 h-16 p-4 border flex justify-center items-center rounded-full hover:bg-indigo-100 hover:cursor-pointer">
                            <Tourism className="w-full h-full" />
                        </div>
                        <p className='text-xs mt-2'>Turismo</p>
                    </div>
                    <div onClick={() => setCategoria("Museo")} className='flex flex-col items-center mb-3'>

                        <div className="w-16 h-16 p-4 border flex justify-center items-center rounded-full hover:bg-indigo-100 hover:cursor-pointer">
                            <Museum className="w-full h-full" />
                        </div>
                        <p className='text-xs mt-2'>Museos</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Categorias