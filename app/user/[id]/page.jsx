"use client"
import React, { useEffect, useState } from 'react'
import qrcontainer from '@/public/assets/qrcontainer.jpeg';
import Image from 'next/image';

const page = ({ params }) => {
    console.log(params.id)
    const [usuario, setUsuario] = useState([])

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
        fetchUsuario(params.id)
    }, [])

  return (
    <>
         <div className="container mx-auto flex justify-center mt-10 mb-24">
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
                                            {usuario.suscripto ? 
                                            <p className="absolute bottom-28 bg-yellow-200 py-1 px-2 rounded-lg left-1/2 transform -translate-x-1/2 text-black text-lg">
                                                 Activo
                                            </p>                                          
                                            : 
                                            <p className="absolute bottom-28 bg-red-400 py-1 px-2 rounded-lg left-1/2 transform -translate-x-1/2 text-black text-lg">
                                                 Inactivo
                                            </p>
                                            }
                                        </div>
                                    </div>
    </>
  )
}

export default page