"use client"
import CardProducto from '@/components/CardProducto'
import Navbar from '@/components/Navbar'
import Products from '@/components/Products'
import Separador from '@/components/Separador'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const page = ({ params }) => {


    const [productos, setProductos] = useState([])
    const [usuario, setUsuario] = useState([])
    const [loading, setLoading] = useState(false);


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
            <Navbar/>
            <Separador texto={"Cuenta"} />
            <div className="container max-w-7xl mx-auto">
                <div className="grid grid-cols-12 gap-6 mt-5 py-4">
                    <div className="col-span-12 md:col-span-3 h-80 p-9 rounded-lg border border-slate-200 card-user flex flex-col items-center">
                        <img src="https://th.bing.com/th/id/R.19fa7497013a87bd77f7adb96beaf768?rik=144XvMigWWj2bw&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fUser-Profile-PNG-High-Quality-Image.png&ehk=%2bat%2brmqQuJrWL609bAlrUPYgzj%2b%2f7L1ErXRTN6ZyxR0%3d&risl=&pid=ImgRaw&r=0" alt="" className='w-20' />
                        <p className='text-sm'>{usuario.nombre}</p>
                        <p className='text-sm'>{usuario.email}</p>
                        <button className='bg-gray-200 text-gray-500  px-2 py-1 text-sm font-semibold rounded-sm mt-3 hover:border-solid border-2'>Ver credencial</button>
                        <Link href="/cuenta/nuevoproducto" className="bg-gray-200 text-gray-500 px-2 py-1 text-sm font-semibold rounded-sm mt-3 hover:border-solid border-2">Nuevo producto</Link>
                        <button className='bg-gray-200 text-gray-500 px-2 py-1 text-sm font-semibold rounded-sm mt-3 hover:border-solid border-2'>Editar</button>
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
        </>
    )
}

export default page