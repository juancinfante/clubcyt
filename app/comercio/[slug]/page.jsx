import Navbar from '@/components/Navbar'
import Slider from '@/components/Slider';
import { getProdByID, getProdBySlug } from '@/lib/actions/page'
import React from 'react'
import Wp from '@/public/assets/whatsapp.svg'
import Fb from '@/public/assets/facebook.svg'
import Ig from '@/public/assets/instagram.svg'
import Web from '@/public/assets/web-link.svg'
import Image from 'next/image';
import LeafletMap from "@/components/Map";

export default async function page({ params }) {

    // const producto = await getProdByID(params.id);
    const producto = await getProdBySlug(params.slug);
    const { lat, lng } = producto.ubicacion;
    function insertarHTML(html) {
        return { __html: html };
    }


    return (
        <>
            <Navbar />
            <div className="container mx-auto max-w-6xl">
                <div className='relative flex justify-center h-56 md:h-80 lg:h-96'>
                    <img src={producto.portada} alt="" className='w-full h-full object-cover' />
                    <img src={producto.logo}
                        className='absolute -bottom-20 rounded-full w-40 h-40 md:w-52 md:h-52 md:-bottom-24 lg:-bottom-28 object-cover bg-white p-2' />
                </div>
                <div className="grid grid-cols-12 mt-32 gap-8">
                    <div className="col-span-12 md:col-span-6 px-3 md:p-0">
                        <div className="w-full">
                            <p className='text-md mt-2 text-gray-600 w-full' dangerouslySetInnerHTML={insertarHTML(producto.descripcion)}></p>
                        </div>

                        {producto.video_youtube != "" ?
                            <div className="w-full my-6">
                                <iframe style={{ width: "100%", height: "300px" }} src={`https://www.youtube.com/embed/${producto.video_youtube}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                            </div>
                            :
                            ""}
                        <div className="w-full">
                            <Slider fotos={producto.fotos} />
                        </div>

                    </div>
                    <div className="col-span-12 md:col-span-6 flex flex-col gap-8 px-3 md:p-0 ">
                        <div className="flex">

                        <div className="w-full">
                            <h1 className='font-semibold text-2xl'>Descuento:</h1>
                            <p className='text-green-700 bg-green-100 px-2 py-1 text-sm font-semibold rounded-full w-12 text-center mt-2'>{producto.descuento}</p>
                        </div>
                            {
                                producto.telefono != "" ?
                                <div className="w-full">
                                            <h1 className='font-semibold text-2xl'>Llamar:</h1>
                                            <a href={`tel:${producto.telefono}`} className='text-md mt-2 text-gray-600 underline'>→ {producto.telefono}</a>
                                        </div>
                                    :
                                    ""
                                }
                                </div>
                        <div className="w-full h-[300px] mb-10">
                            <div className="w-full flex items-center justify-between">
                                <h1 className='font-semibold text-2xl'>📍Ubicacion:</h1>
                                <a href={`https://www.google.com/maps?q=${lat},${lng}`} target='_blank'>Abrir mapa</a>
                            </div>
                            <LeafletMap position={producto.ubicacion} />
                        </div>
                        <div className="w-full">
                            <h1 className='font-semibold text-2xl mb-2'>Redes:</h1>
                            <div className="flex gap-3">
                                <a href={`https://api.whatsapp.com/send?phone=54${producto.celular}`}>
                                    <Wp className="w-10 h-10" />
                                </a>
                                {producto.fb != "" ?
                                    <a href={producto.fb}>
                                        <Fb className="w-10 h-10" />
                                    </a>
                                    :
                                    ""}
                                {producto.ig != "" ?
                                    <a href={producto.ig}>
                                        <Ig className="w-10 h-10" />
                                    </a>
                                    :
                                    ""}
                            </div>
                        </div>
                        {producto.web != "" ?
                            <div className="w-full">
                                <h1 className='font-semibold text-2xl mb-2'>Pagina web:</h1>
                                <div className="flex">
                                    <Web className="w-6 h-6" />
                                    <a href={`https://${producto.web}`} target="_blank">
                                        <p>{producto.web}</p>
                                    </a>
                                </div>
                            </div>
                            :
                            ""}
                    </div>
                </div>
            </div >
        </>
    )
}
