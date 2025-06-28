import Navbar from '@/components/Navbar'
import Slider from '@/components/Slider';
import { getProdBySlug, getPromociones } from '@/lib/actions/page'
import React, { Suspense } from 'react'
import Wp from '@/public/assets/whatsapp.svg'
import Fb from '@/public/assets/facebook.svg'
import Ig from '@/public/assets/instagram.svg'
import Web from '@/public/assets/web-link.svg'
import Pin from '@/public/assets/pin.svg'
import Image from 'next/image';
import SliderPromo from '@/components/SliderPromo';
import DescripcionProducto from '@/components/DescripcionProducto';
import BotonCompartirFacebook from '@/components/BotonCompartirFacebook';
import BotonCompartirX from '@/components/BotonCompartirX';

export async function generateMetadata({ params }) {
    try {
        const { slug } = params;
        const producto = await getProdBySlug(slug);

        if (!producto) {
            return {
                title: 'Producto no encontrado',
                description: 'No pudimos encontrar el producto solicitado.',
            };
        }

        // Función rápida para quitar etiquetas HTML
        const stripHtml = (html) => html.replace(/<[^>]*>?/gm, '').trim();

        const descripcionLimpia = stripHtml(producto.descripcion);

        return {
            title: `${producto.nombre} - ${producto.categoria}`,
            description: descripcionLimpia,
            openGraph: {
                title: `${producto.nombre} - ${producto.categoria}`,
                description: descripcionLimpia,
                images: [
                    {
                        url: producto.portada,
                        width: 1200,
                        height: 630,
                        alt: `Imagen de ${producto.nombre}`,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${producto.nombre} - ${producto.categoria}`,
                description: descripcionLimpia,
                images: [producto.portada],
            },
        };
    } catch (error) {
        return {
            title: 'Error al cargar producto',
            description: 'Hubo un problema al obtener los datos del producto.',
        };
    }
}



export default async function page({ params }) {
    const producto = await getProdBySlug(params.slug);

    const urlProducto = `https://clubcyt.com/comercio/${producto.slug}`;

    if (!producto || producto.error) {
        // Manejo de producto no encontrado (puedes personalizar esta página)
        return (
            <div className="container mx-auto text-center mt-20">
                <h1 className="text-2xl font-bold text-red-600">Producto no encontrado</h1>
                <p className="text-gray-600 mt-4">El producto que estás buscando no existe o fue eliminado.</p>
            </div>
        );
    }

    const { nombre, descripcion, precio, promociones } = producto;

    const getSelectedServices = () => {
        const selected = {
            banio: [],
            habitacion: [],
            internet: [],
            general: [],
            aparcamiento: [],
            equipamiento: [],
            seguridad: [],
            idiomas: [],
            servicios: [],
            bienestar: [],
            comidaybebida: [],
            limpieza: [],
        };

        if (producto?.categoria === "Hotel" && producto?.services) {
            const serviceKeys = Object.keys(producto.services);

            for (const key of serviceKeys) {
                if (selected.hasOwnProperty(key)) {
                    Object.keys(producto.services[key]).forEach(service => {
                        if (producto.services[key][service]) {
                            selected[key].push(service);
                        }
                    });
                }
            }
        }

        return selected;
    };


    const selectedServices = getSelectedServices();

    const formatServiceName = (service) => {
        return service.replace(/([A-Z])/g, ' $1') // Agregar espacio antes de mayúsculas
            .replace(/^./, str => str.toUpperCase()); // Capitalizar la primera letra
    };


    return (
        <>
            <Navbar />
            <div className="container mx-auto max-w-6xl">
                <div className='relative flex justify-center h-56 md:h-80 lg:h-96'>
                    <img src={producto.portada} alt="" className='w-full h-full object-cover' />
                    <img src={producto.logo}
                        className='absolute -bottom-20 rounded-full w-40 h-40 md:w-52 md:h-52 md:-bottom-24 lg:-bottom-28 object-cover bg-white p-2' />
                </div>
                <div className="grid grid-cols-12 mt-32 gap-8 px-4 md:p-0">
                    <div className="col-span-12">
                        <div className="w-full flex flex-col justify-center items-center">
                            <h1 className='text-2xl font-semibold'>
                                {producto.nombre}
                            </h1>
                            <div className="flex items-center gap-2">
                                <Pin className="w-4 h-4" />
                                <p>{producto.ubicacion}</p>
                            </div>
                            <div className="flex gap-1">
                            <BotonCompartirFacebook url={urlProducto}/>
                            <BotonCompartirX url={urlProducto}/>
                            </div>
                        </div>

                        <Suspense fallback={<div>Cargando descripción...</div>}>
                            <DescripcionProducto descripcion={descripcion} />
                        </Suspense>
                        {
                            producto.categoria == "Hotel" ?
                                <div className="col-span-12 border border-gray-200 rounded-xl p-4 mt-5">
                                    <h1 className='font-semibold text-lg mb-5'>Servicios mas populares </h1>
                                    <ul className='flex gap-6'>
                                        {producto.popularServices.map((service, index) => (
                                            <li key={index} className='flex gap-2 items-center'>
                                                <Image src={service.icon} alt="" width={20} height={20} />
                                                <span className='text-sm'>{service.service}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                :
                                ""
                        }
                        {producto.services ?
                            <div className="col-span-12 border border-gray-200 rounded-xl p-4 mt-5">
                                <h1 className='font-semibold text-lg mb-5'>Servicios de {producto.nombre} </h1>
                                <div className="w-full grid grid-cols-12 gap-y-7">
                                    {selectedServices.banio.length > 0 && (
                                        <div className='col-span-12 md:col-span-3'>
                                            <span className='flex gap-2 items-center'>
                                                <Image src='/hotel/banio.svg' alt="" width={20} height={20} />
                                                <h4 className='font-semibold'>Baño</h4>
                                            </span>
                                            <ul className='mt-3 flex flex-col gap-1'>
                                                {selectedServices.banio.map(service => (
                                                    <li key={service} className='flex text-sm gap-2'>
                                                        <Image src='/hotel/tick.svg' alt="" width={15} height={15} />
                                                        {formatServiceName(service)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {selectedServices.habitacion.length > 0 && (
                                        <div className='col-span-12 md:col-span-3'>
                                            <span className='flex gap-2 items-center'>
                                                <Image src='/hotel/bed.svg' alt="" width={20} height={20} />
                                                <h4 className='font-semibold'>Habitacion</h4>
                                            </span>
                                            <ul className='mt-3 flex flex-col gap-1'>
                                                {selectedServices.habitacion.map(service => (
                                                    <li key={service} className='flex text-sm gap-2'>
                                                        <Image src='/hotel/tick.svg' alt="" width={15} height={15} />
                                                        {formatServiceName(service)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {selectedServices.equipamiento.length > 0 && (
                                        <div className='col-span-12 md:col-span-3'>
                                            <span className='flex gap-2 items-center'>
                                                <Image src='/hotel/tv.svg' alt="" width={20} height={20} />
                                                <h4 className='font-semibold'>Equipamiento</h4>
                                            </span>
                                            <ul className='mt-3 flex flex-col gap-1'>
                                                {selectedServices.equipamiento.map(service => (
                                                    <li key={service} className='flex text-sm gap-2'>
                                                        <Image src='/hotel/tick.svg' alt="" width={15} height={15} />
                                                        {formatServiceName(service)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {selectedServices.seguridad.length > 0 && (
                                        <div className='col-span-12 md:col-span-3'>
                                            <span className='flex gap-2 items-center'>
                                                <Image src='/hotel/lock.svg' alt="" width={20} height={20} />
                                                <h4 className='font-semibold'>Seguridad</h4>
                                            </span>
                                            <ul className='mt-3 flex flex-col gap-1'>
                                                {selectedServices.seguridad.map(service => (
                                                    <li key={service} className='flex text-sm gap-2'>
                                                        <Image src='/hotel/tick.svg' alt="" width={15} height={15} />
                                                        {formatServiceName(service)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {selectedServices.general.length > 0 && (
                                        <div className='col-span-12 md:col-span-3'>
                                            <span className='flex gap-2 items-center'>
                                                <Image src='/hotel/warning.svg' alt="" width={20} height={20} />
                                                <h4 className='font-semibold'>General</h4>
                                            </span>
                                            <ul className='mt-3 flex flex-col gap-1'>
                                                {selectedServices.general.map(service => (
                                                    <li key={service} className='flex text-sm gap-2'>
                                                        <Image src='/hotel/tick.svg' alt="" width={15} height={15} />
                                                        {formatServiceName(service)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {selectedServices.servicios.length > 0 && (
                                        <div className='col-span-12 md:col-span-3'>
                                            <span className='flex gap-2 items-center'>
                                                <Image src='/hotel/services.svg' alt="" width={20} height={20} />
                                                <h4 className='font-semibold'>Servicios</h4>
                                            </span>
                                            <ul className='mt-3 flex flex-col gap-1'>
                                                {selectedServices.servicios.map(service => (
                                                    <li key={service} className='flex text-sm gap-2'>
                                                        <Image src='/hotel/tick.svg' alt="" width={15} height={15} />
                                                        {formatServiceName(service)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {selectedServices.limpieza.length > 0 && (
                                        <div className='col-span-12 md:col-span-3'>
                                            <span className='flex gap-2 items-center'>
                                                <Image src='/hotel/cleaner.svg' alt="" width={20} height={20} />
                                                <h4 className='font-semibold'>Limpieza</h4>
                                            </span>
                                            <ul className='mt-3 flex flex-col gap-1'>
                                                {selectedServices.limpieza.map(service => (
                                                    <li key={service} className='flex text-sm gap-2'>
                                                        <Image src='/hotel/tick.svg' alt="" width={15} height={15} />
                                                        {formatServiceName(service)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {selectedServices.idiomas.length > 0 && (
                                        <div className='col-span-12 md:col-span-3'>
                                            <span className='flex gap-2 items-center'>
                                                <Image src='/hotel/chat.svg' alt="" width={20} height={20} />
                                                <h4 className='font-semibold'>Idiomas</h4>
                                            </span>
                                            <ul className='mt-3 flex flex-col gap-1'>
                                                {selectedServices.idiomas.map(service => (
                                                    <li key={service} className='flex text-sm gap-2'>
                                                        <Image src='/hotel/tick.svg' alt="" width={15} height={15} />
                                                        {formatServiceName(service)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {selectedServices.comidaybebida.length > 0 && (
                                        <div className='col-span-12 md:col-span-3'>
                                            <span className='flex gap-2 items-center'>
                                                <Image src='/hotel/food.svg' alt="" width={20} height={20} />
                                                <h4 className='font-semibold'>Comida y Bebida</h4>
                                            </span>
                                            <ul className='mt-3 flex flex-col gap-1'>
                                                {selectedServices.comidaybebida.map(service => (
                                                    <li key={service} className='flex text-sm gap-2'>
                                                        <Image src='/hotel/tick.svg' alt="" width={15} height={15} />
                                                        {formatServiceName(service)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {selectedServices.bienestar.length > 0 && (
                                        <div className='col-span-12 md:col-span-3'>
                                            <span className='flex gap-2 items-center'>
                                                <Image src='/hotel/bienestar.svg' alt="" width={20} height={20} />
                                                <h4 className='font-semibold'>Bienestar</h4>
                                            </span>
                                            <ul className='mt-3 flex flex-col gap-1'>
                                                {selectedServices.bienestar.map(service => (
                                                    <li key={service} className='flex text-sm gap-2'>
                                                        <Image src='/hotel/tick.svg' alt="" width={15} height={15} />
                                                        {formatServiceName(service)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {selectedServices.aparcamiento.length > 0 && (
                                        <div className='col-span-12 md:col-span-3'>
                                            <span className='flex gap-2 items-center'>
                                                <Image src='/hotel/parking.svg' alt="" width={20} height={20} />
                                                <h4 className='font-semibold'>Aparcamiento</h4>
                                            </span>
                                            <ul className='mt-3 flex flex-col gap-1'>
                                                {selectedServices.aparcamiento.map(service => (
                                                    <li key={service} className='flex text-sm gap-2'>
                                                        <Image src='/hotel/tick.svg' alt="" width={15} height={15} />
                                                        {formatServiceName(service)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {selectedServices.internet.length > 0 && (
                                        <div className='col-span-12 md:col-span-3'>
                                            <span className='flex gap-2 items-center'>
                                                <Image src='/hotel/wifi.svg' alt="" width={20} height={20} />
                                                <h4 className='font-semibold'>Internet</h4>
                                            </span>
                                            <ul className='mt-3 flex flex-col gap-1'>
                                                {selectedServices.internet.map(service => (
                                                    <li key={service} className='flex text-sm gap-2'>
                                                        <Image src='/hotel/tick.svg' alt="" width={15} height={15} />
                                                        {formatServiceName(service)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                            :
                            " "}


                        <div className="col-span-12">
                            <div className="grid grid-cols-6 mt-5 gap-5">
                                {
                                    producto.telefono != "" ?
                                        <a href={`tel:${producto.telefono}`} className='col-span-6 md:col-span-2 flex items-center justify-between border border-gray-200 rounded-xl p-4'>
                                            <h1 className='font-semibold text-md'>
                                                <span className='pe-2'>📞</span>
                                                Llamar
                                            </h1>
                                            <p className='text-md underline'>{producto.telefono}</p>
                                        </a>
                                        :
                                        ""
                                }
                                {producto.descuento != "Ninguno" ?
                                    <div className='col-span-6 md:col-span-2 flex items-center justify-between border border-gray-200 rounded-xl p-4'>
                                        <h1 className='font-semibold text-md'>Descuento</h1>
                                        <p className='text-green-700 bg-green-100 px-2 py-1 text-sm font-semibold rounded-full w-12 text-center'>{producto.descuento}</p>
                                    </div>
                                    :
                                    ""}
                                <div className="col-span-6 md:col-span-2 flex items-center justify-between border border-gray-200 rounded-xl p-4">
                                    <h1 className='font-semibold text-md'>
                                        <span className='pe-2'>👥</span>
                                        Redes
                                    </h1>
                                    <div className="flex gap-3">
                                        <a href={`https://api.whatsapp.com/send?phone=54${producto.celular}`}>
                                            <Wp className="w-8 h-8" />
                                        </a>
                                        {producto.fb != "" ?
                                            <a href={producto.fb}>
                                                <Fb className="w-8 h-8" />
                                            </a>
                                            :
                                            ""}
                                        {producto.ig != "" ?
                                            <a href={producto.ig}>
                                                <Ig className="w-8 h-8" />
                                            </a>
                                            :
                                            ""}
                                    </div>
                                </div>
                                {producto.web != '' ?
                                    <div className="col-span-6 md:col-span-2 border border-gray-200 rounded-xl p-4">
                                        <a href={`https://${producto.web}`} className='flex items-center justify-between' target="_blank">
                                            <h1 className='font-semibold text-md mb-2'>
                                                <span className='pe-2'>🌐</span>
                                                Web
                                            </h1>
                                            <div className="flex">
                                                <Web className="w-6 h-6" />
                                                <p>{producto.web}</p>
                                            </div>
                                        </a>
                                    </div>
                                    : ""
                                }
                            </div>
                        </div>
                        <div className="w-full mt-4">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2 md:col-span-1 border border-gray-200 rounded-xl p-4">
                                    <h1 className='font-semibold text-md mb-2'>Galeria:</h1>
                                    <Slider fotos={producto.fotos} />
                                </div>
                                <div className="col-span-2 md:col-span-1 md:ps-4 border border-gray-200 rounded-xl p-4">
                                    <h1 className='font-semibold text-md mb-2'>Ubicacion:</h1>
                                    {/* <p>{producto.ubicacion}</p> */}
                                    <iframe
                                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_EMBED_API_KEY}&q=${encodeURI(producto.ubicacion)}`}
                                        style={{ height: "400px", width: "100%" }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade">
                                    </iframe>
                                </div>
                            </div>
                        </div>


                        <div className="col-span-6 mt-5">
                            {producto.video_youtube != "" ?
                                <div className="w-full border rounded-xl p-4">
                                    <iframe className='w-full h-[250px] md:h-[500px]' src={`https://www.youtube.com/embed/${producto.video_youtube}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                </div>
                                :
                                ""}

                        </div>
                        {producto.promociones.length != 0 ?
                            <SliderPromo promociones={producto.promociones} producto={producto} />
                            :
                            ""}

                    </div>
                </div>
            </div >
        </>
    )
}
