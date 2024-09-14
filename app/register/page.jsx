"use client"

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import logo from '@/public/assets/logo_blue_clubcyt.png'


const page = () => {
    const [error, setError] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    // Función para manejar el formulario de registro
    const handleRegister = async (e) => {
        e.preventDefault();
        if (password == password2) {
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre, apellido, email, password }),
                });
                console.log(res.status)
                const data = await res.json();

                // Verifica si el email ya está en uso
                if (data.emailExists) {
                    setError(true);
                    return;
                }

                // Guardar los datos del usuario en localStorage o manejar la sesión
                localStorage.setItem('usuario', JSON.stringify(data));

                // Redirigir a la página principal o donde desees
                window.location.href = "/welcome"; // Cambia a la ruta deseada
            } catch (error) {
                console.log(error);
            }
        } else {
            setErrorPassword(true)
        }
    };

    useEffect(() => {
        if (localStorage.getItem("usuario")) {
            window.location.href = "/"
        }
    }, [])

    return (
       
        <div className="grid grid-cols-12 justify-center items-center h-screen">
            <div className="col-span-12 md:col-span-6 flex justify-center">
                <div className="bg-white p-9 rounded-xl w-96">
                    <Image src={logo}
                        className='mb-5'
                        width={130}
                        height={50} style={{ marginTop: 5 }} priority alt='logo' />
                    <h1 className='text-3xl mb-7 font-semibold '>Crea una cuenta </h1>
                    {error ? <p className='text-xs p-0 text-red-600 mb-2'>{error}</p> : ""}
                    <form className='w-full flex flex-col gap-3' onSubmit={handleRegister}>
                        <div className="grid grid-cols-12 gap-3">
                            <div className='relative col-span-12 md:col-span-6'>
                                <label className='absolute pl-2 pt-1 text-xs text-gray-500'>Nombre</label>
                                <input type="text" required className='border border-slate-300 w-full pt-5 pb-1 pl-2 text-sm' onChange={(e) => setNombre(e.target.value)} />
                            </div>
                            <div className='relative col-span-12 md:col-span-6'>
                                <label className='absolute pl-2 pt-1 text-xs text-gray-500'>Apellido</label>
                                <input type="text" required className='border border-slate-300 w-full pt-5 pb-1 pl-2 text-sm' onChange={(e) => setApellido(e.target.value)} />
                            </div>
                        </div>
                        <div className='relative w-full'>
                            <label className='absolute pl-2 pt-1 text-xs text-gray-500'>Email</label>
                            <input type="email" required className='border border-slate-300 w-full pt-5 pb-1 pl-2 text-sm' onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        {
                                error ? 
                                <p className='text-xs pt-1 text-red-600'>Email ya esta en uso.</p>
                                : 
                                ""
                            }
                        <div className='relative w-full'>
                            <label className='absolute pl-2 pt-1 text-xs text-gray-500'>Contraseña</label>
                            <input type="password" required className='border border-slate-300 w-full pt-5 pb-1 pl-2 text-sm' onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='relative w-full'>
                            <label className='absolute pl-2 pt-1 text-xs text-gray-500'>Repita contraseña</label>
                            <input type="password" required className='border border-slate-300 w-full pt-5 pb-1 pl-2 text-sm' onChange={(e) => setPassword2(e.target.value)} />
                        </div>
                        {
                                errorPassword ? 
                                <p className='text-xs pt-1 text-red-600'>Las contraseñas no coinciden</p>
                                : 
                                ""
                            }
                        <button type='submit' className='bg-indigo-500 text-white text-sm mt-2 p-3'>Ingresar</button>
                    </form>
                    <p className='text-xs mt-5'>Ya tienes cuenta? <a href="/login" className='text-indigo-600'>Ingresar</a></p>
                </div>
            </div>
            <div className="col-span-6 h-full hidden md:block">
                <img src="https://th.bing.com/th/id/R.8489b868f5d35b9592690f39a4ed88c8?rik=p1VjMWk0l05IFQ&pid=ImgRaw&r=00"
                    alt="banner"
                    className='w-full h-full object-cover' />
            </div>
        </div>
    )
}

export default page  