"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import logo from '@/public/assets/logo_blue_clubcyt.png';
import { Input } from '@nextui-org/input';
import { Spinner } from '@nextui-org/spinner';

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1 = Formulario de email, 2 = Formulario de código, 3 = Formulario de nueva contraseña, 4 = Éxito

  // Función para manejar el formulario de recuperación de contraseña (enviar el email)
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/passwordrecovery/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.status === 200) {
        setStep(2);  // Cambiar al formulario para ingresar el código
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.log(error);
      setError('Hubo un error al enviar el email.');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el formulario de verificación de código
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/passwordrecovery/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (res.status === 200) {
        setStep(3);  // Cambiar al formulario de nueva contraseña
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Hubo un error al verificar el código.');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el formulario de actualización de contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/passwordrecovery/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (res.status === 200) {
        setStep(4);  // Mostrar el mensaje de éxito
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Hubo un error al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToLogin = () => {
    router.push('/login'); // Redirigir al login
  };

  return (
    <div className="grid grid-cols-12 justify-center items-center h-screen">
      <div className="col-span-12 md:col-span-6 flex justify-center">
        <div className="bg-white p-9 rounded-xl w-96">
          <Image src={logo} className="mb-5" width={130} height={50} priority alt="logo" />
            {step === 1 && (
              <>
                <h1 className="text-3xl mb-2 font-semibold">¿Olvidaste tu contraseña?</h1>
                <p className="text-xs mb-5 font-normal">No te preocupes, es posible recuperarla</p>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="text-3xl mb-2 font-semibold">Verifica tu correo</h1>
                <p className="text-sm mb-5 font-normal">Te enviamos un codigo de verificacion</p>
              </>
            )}
          <h1 className="text-3xl mb-2 font-semibold">
            {step === 3 && "Cambia tu contraseña"}
            {step === 4 && "¡Cambiaste tu contraseña con exito!"}
          </h1>
          {error && <p className="text-xs p-0 text-red-600 mb-2">{error}</p>}
          {step === 1 && (
            <form className="w-full flex flex-col gap-3" onSubmit={handleEmailSubmit}>
              <div className="relative w-full">
                <Input type="email" label="Ingresa email" isClearable required onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="bg-indigo-500 text-white text-sm mt-2 p-3 rounded-md">
                {loading ? <Spinner color="default" size="sm" /> : "Recuperar contraseña"}
              </button>
            </form>
          )}
          {step === 2 && (
            <form className="w-full flex flex-col gap-3" onSubmit={handleCodeSubmit}>
              <div className="relative w-full">
                <Input type="text" label="Código de verificación" required onChange={(e) => setCode(e.target.value)} />
              </div>
              <button type="submit" className="bg-indigo-500 text-white text-sm mt-2 p-3 rounded-md">
                {loading ? <Spinner color="default" size="sm" /> : "Verificar código"}
              </button>
            </form>
          )}
          {step === 3 && (
            <form className="w-full flex flex-col gap-3" onSubmit={handlePasswordSubmit}>
              <div className="relative w-full">
                <Input type="password" label="Nueva contraseña" required onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="relative w-full">
                <Input type="password" label="Confirmar nueva contraseña" required onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <button type="submit" className="bg-indigo-500 text-white text-sm mt-2 p-3 rounded-md">
                {loading ? <Spinner color="default" size="sm" /> : "Actualizar contraseña"}
              </button>
            </form>
          )}
          {step === 4 && (
            <div className="text-center mt-5">
              <button
                onClick={handleRedirectToLogin}
                className="bg-indigo-500 text-white text-sm mt-2 p-3 rounded-md"
              >
                Ir al Login
              </button>
            </div>
          )}
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
  );
};

export default page;
