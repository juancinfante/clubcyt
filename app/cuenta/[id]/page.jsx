"use client"
import CardProducto from '@/components/CardProducto'
import Navbar from '@/components/Navbar'
import Products from '@/components/Products'
import Separador from '@/components/Separador'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import qrcontainer from '@/public/assets/qrcontainer.jpeg';

const page = ({ params }) => {

    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar el modal

    const handleOpenModal = () => setIsModalOpen(true);  // Función para abrir el modal
    const handleCloseModal = () => setIsModalOpen(false);

    const [productos, setProductos] = useState([])
    const [usuario, setUsuario] = useState([])
    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchProductos = async (idUsuario) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/productos/usuario/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
                return;
            }

            const data = await response.json();
            setProductos(data.productos || []); // Si no hay productos, asegurarse de que sea un array vacío
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
        setLoading(false);
    };

    const fetchUsuario = async (idUsuario) => {
        try {
            // Realizamos la solicitud GET al endpoint que maneja la función GET en el backend
            const response = await fetch(`/api/usuarios/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Verificamos si la respuesta fue exitosa
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
                return;
            }

            // Convertimos la respuesta a JSON
            const data = await response.json();
            setUsuario(data)
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    }

    useEffect(() => {
        fetchProductos(params.id)
        fetchUsuario(params.id)
        if (!localStorage.getItem("usuario")) {
            window.location.href = "/"
        }
    }, [])


    return (
        <>
            <Navbar />
            <Separador texto={"Cuenta"} />
            <div className="container max-w-7xl mx-auto px-3">
                <div className="grid grid-cols-12 gap-6 mt-5 py-4">
                    <div className="col-span-12 md:col-span-3 h-80 p-9 rounded-lg border border-slate-200 card-user flex flex-col items-center">
                        <img src="https://th.bing.com/th/id/R.19fa7497013a87bd77f7adb96beaf768?rik=144XvMigWWj2bw&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fUser-Profile-PNG-High-Quality-Image.png&ehk=%2bat%2brmqQuJrWL609bAlrUPYgzj%2b%2f7L1ErXRTN6ZyxR0%3d&risl=&pid=ImgRaw&r=0" alt="" className='w-20' />
                        <p className='text-sm'>{usuario.nombre + " " + usuario.apellido} </p>
                        {/* <p className='text-sm'>{usuario.email}</p> */}
                        {
                            usuario.suscripto ? 
                            <button
                            onClick={handleOpenModal} 
                            className='bg-gray-200 text-gray-500 px-2 py-1 text-sm rounded-sm mt-3 hover:border-solid border-2'>Ver credencial</button>
                            :
                            <button
                            onClick={handleOpenModal} 
                            className='bg-yellow-400 text-white px-2 py-1 text-sm rounded-sm mt-3 hover:border-solid'>Suscribirse</button>
                        }
                        <Link href="/cuenta/nuevoproducto" className="bg-gray-200 text-gray-500 px-2 py-1 text-sm rounded-sm mt-3 hover:border-solid border-2">Agregar comercio</Link>
                        <button className='bg-gray-200 text-gray-500 px-2 py-1 text-sm  rounded-sm mt-3 hover:border-solid border-2'>Editar</button>
                    </div>
                    <div className="col-span-12 md:col-span-9">
                        <div className="grid grid-cols-12 w-full gap-4">
                            {loading ? (
                                // Mostrar skeletons para simular productos
                                Array(8)
                                    .fill()
                                    .map((_, i) => <CardProducto key={i} loading={true} />)
                            ) : productos.length === 0 ? (
                                // Mostrar mensaje cuando no se encuentran productos
                                <h1 className='col-span-12 text-center font-semibold mt-10'>No tienes ningun producto publicado</h1>
                            ) : (
                                // Mostrar productos cuando existan
                                productos.map((producto) => (
                                    <CardProducto key={producto._id} producto={producto} loading={false} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Componente del Modal */}
            {isModalOpen && (
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="container mx-auto flex justify-center mt-10">
                                        <div className="relative">
                                            {/* Imagen de fondo con borde redondeado */}
                                            <Image
                                                src={qrcontainer}
                                                height={500}
                                                width={300}
                                                alt="QR Container"
                                                className="rounded-lg"
                                            />
                                            
                                            {/* Nombre del usuario encima del código QR */}
                                            <h3 className="absolute top-32 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-900">
                                                {usuario.nombre} {usuario.apellido}
                                            </h3>
                                            
                                            {/* Imagen generada del QR superpuesta */}
                                            <img
                                                src={usuario.qrcode}
                                                alt="Generated QR Code"
                                                className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px]" // Centrado
                                            />
            
                                            {/* Texto debajo del código QR */}
                                            <p className="absolute bottom-28 bg-yellow-200 py-1 px-2 rounded-lg left-1/2 transform -translate-x-1/2 text-black text-lg">
                                                 Activo
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    onClick={handleCloseModal} // Cierra el modal
                                >
                                    cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            )}
        </>
    )
}

export default page