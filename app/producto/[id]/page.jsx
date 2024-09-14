import Navbar from '@/components/Navbar'
import Slider from '@/components/Slider';
import { getProdByID } from '@/lib/actions/page'
import React from 'react'
import Wp from '@/public/assets/whatsapp.svg'
import Fb from '@/public/assets/facebook.svg'
import Tw from '@/public/assets/twitter.svg'
import Image from 'next/image';

export default async function page({ params }) {

    const producto = await getProdByID(params.id);

    return (
        <>
            <Navbar />
            <div className="container mx-auto max-w-6xl">
                <div className='relative flex justify-center h-56 md:h-80 lg:h-96'>
                    <img src={producto.portada} alt="" className='w-full h-full object-cover' />
                    <img src={producto.logo}
                        className='absolute -bottom-20 rounded-full w-40 h-40 md:w-52 md:h-52 md:-bottom-24 lg:-bottom-28 object-cover bg-white p-2' />
                </div>
                <div className="mt-28 grid grid-cols-12 justify-center w-full">
                    <div className="col-span-12 text-center">
                        <h1 className='text-4xl font-semibold'>{producto.nombre}</h1>
                        <p className='text-gray-600 text-md'>{producto.categoria}</p>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-10 mt-8 p-3">
                    <div className="col-span-12 lg:col-span-6">
                        <h1 className='font-semibold text-2xl'>Descripcion:</h1>
                        <p className='text-md mt-2 text-gray-600 w-full'>{producto.descripcion}</p>
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                        <div className="grid grid-cols-12 gap-10">
                            <div className="col-span-6">
                                <h1 className='font-semibold text-2xl'>📍Ubicacion:</h1>
                                <p className='text-md mt-2 text-gray-600'>{producto.ubicacion}</p>
                            </div>
                            <div className="col-span-6">
                                <h1 className='font-semibold text-2xl'>Descuento:</h1>
                                <p className='text-green-700 bg-green-100 px-2 py-1 text-sm font-semibold rounded-full w-12 text-center mt-2'>{producto.descuento}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-6 overflow-hidden">
                        <h1 className='font-semibold text-2xl mb-2'>Galeria:</h1>
                        <Slider fotos={producto.fotos} />
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                        <h1 className='font-semibold text-2xl mb-2'>Redes:</h1>
                        <div className="flex gap-3">
                            <Wp className="w-10 h-10" />
                            <Fb className="w-10 h-10" />
                            <Tw className="w-10 h-10" />
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                    <h1 className='font-semibold text-2xl mb-2'>Presentacion:</h1>
                        <iframe
                            className='w-full h-80'
                            src="https://www.youtube.com/embed/VIDEO_ID"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </>
    )
}
