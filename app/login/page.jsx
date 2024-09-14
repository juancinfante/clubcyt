"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import logo from '@/public/assets/logo_blue_clubcyt.png'

const page = () => {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Función para manejar el formulario de login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error desconocido');
        return;
      }

      // Guardar el token en localStorage o manejar la sesión como prefieras
      localStorage.setItem('usuario', JSON.stringify(data));

      // Redirigir a la página principal o donde desees
      window.location.href = "/" // Cambia a la ruta donde quieras redirigir al usuario después de hacer login
    } catch (error) {
      setError('Error de red');
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
          <h1 className='text-3xl mb-7 font-semibold '>Ingresar</h1>
          {error ? <p className='text-xs p-0 text-red-600 mb-2'>{error}</p> : ""}
          <form className='w-full flex flex-col gap-3' onSubmit={handleSubmit}>
            <div className='relative w-full'>
              <label className='absolute pl-2 pt-1 text-xs text-gray-500'>Email</label>
              <input type="email" className='border border-slate-300 w-full pt-5 pb-1 pl-2 text-sm' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='relative w-full'>
              <label className='absolute pl-2 pt-1 text-xs text-gray-500'>Contraseña</label>
              <input type="password" className='border border-slate-300 w-full pt-5 pb-1 pl-2 text-sm' onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type='submit' className='bg-indigo-500 text-white text-sm mt-2 p-3'>Ingresar</button>
          </form>
          <p className='text-xs mt-5'>No tienes cuenta? <a href="/register" className='text-indigo-600'>Registrate</a></p>
        </div>
      </div>
      <div className="col-span-6 h-full">
        <img src="https://th.bing.com/th/id/R.8489b868f5d35b9592690f39a4ed88c8?rik=p1VjMWk0l05IFQ&pid=ImgRaw&r=00"
          alt="banner"
          className='w-full h-full object-cover hidden md:block' />
      </div>
    </div>
  )
}

export default page  