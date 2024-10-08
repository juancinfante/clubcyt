"use client"
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useEffect, useState } from 'react';


const page = () => {

    const [user, setUser] = useState(null);

    const actualizarComercio = async (id) => {
        // Suponiendo que solo quieres actualizar el campo 'activado'
        const updatedField = {
            activado: true // O el valor que quieras enviar
        };

        // Actualizar el producto en la base de datos
        try {
            const res = await fetch(`/api/productos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedField), // Solo se envía el campo 'activado'
            });
            const data = await res.json();
        } catch (error) {
            console.log('Error al actualizar el producto:', error);
        }
    }
    useEffect(() => {
        // Asegurarse de que el código se ejecute solo en el cliente
        const storedUser = localStorage.getItem("usuario");
        const storedProduct = localStorage.getItem("id_producto");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        actualizarComercio(storedProduct)
    }, []);


    return (
        <>
            <Navbar />
            <div className='container mx-auto max-w-6xl'>
                <section className="flex flex-col items-center">
                    <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                        <div className="mx-auto max-w-lg text-center">
                            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                                Comercio activado ✅ !
                            </h2>

                            <p className="hidden text-gray-500 sm:mt-4 sm:block">
                                Tu comercio ahora es visible para todo el mundo.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link href={user ? `/cuenta/${user._id}` : ""}>← Ir a perfil</Link>
                        <Link href='/'>Explorar comercios →</Link>
                    </div>
                </section>
            </div>
        </>
    )
}

export default page