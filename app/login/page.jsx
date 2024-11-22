"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import logo from '@/public/assets/logo_blue_clubcyt.png'
import { Input } from '@nextui-org/input';
import { Spinner } from '@nextui-org/spinner';
import { signIn } from 'next-auth/react';
import GoogleSignInButton from '@/components/GoogleSignInButton';

const page = () => {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para manejar el formulario de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false
      })

      if (res?.error) {
        setError(res.error);
        setLoading(false)
      }

      if (res?.ok) return router.push("/")

    } catch (error) {
      console.log(error)
    }
  };

  // useEffect(() => {
  //   if (localStorage.getItem("usuario")) {
  //     window.location.href = "/"
  //   }
  // }, [])

  return (
    <div className="grid grid-cols-12 justify-center items-center h-screen">
  <div className="col-span-12 md:col-span-6 flex justify-center">
    <div className="bg-white p-9 rounded-xl w-96">
      <Image
        src={logo}
        className="mb-5"
        width={130}
        height={50}
        style={{ marginTop: 5 }}
        priority
        alt="logo"
      />
      <h1 className="text-3xl mb-7 font-semibold">Ingresar</h1>
      
      {error ? <p className="text-xs p-0 text-red-600 mb-2">{error}</p> : ""}
      <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="relative w-full">
          <Input
            type="email"
            label="Email"
            isClearable
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative w-full">
          <Input
            type="password"
            label="Contraseña"
            isClearable
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-500 text-white text-sm mt-2 p-4 rounded-md"
        >
          {loading ? <Spinner color="default" size="sm" /> : "Ingresar"}
        </button>
      </form>
      {/* Botón de inicio de sesión con Google */}
      <div className="mt-5">
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center justify-center w-full border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google Logo"
            className="w-5 h-5 mr-3"
          />
          <span className="text-gray-600 font-medium text-sm">
            Inicia sesión con Google
          </span>
        </button>
      </div>
      <p className="text-sm mt-5">
        No tienes cuenta?{" "}
        <a href="/register" className="text-indigo-600 text-sm">
          Registrate
        </a>
      </p>
      <a href="/passwordrecovery" className="text-gray-600 text-xs">
        Olvide mi contraseña
      </a>
    </div>
  </div>
  <div className="col-span-6 h-full">
    <img
      src="https://th.bing.com/th/id/R.8489b868f5d35b9592690f39a4ed88c8?rik=p1VjMWk0l05IFQ&pid=ImgRaw&r=00"
      alt="banner"
      className="w-full h-full object-cover hidden md:block"
    />
  </div>
</div>

  )
}

export default page  