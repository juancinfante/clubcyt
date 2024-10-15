"use client"

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import logo from '@/public/assets/logo_blue_clubcyt.png'
import { Input } from '@nextui-org/input';
import { Spinner } from '@nextui-org/spinner';

const page = () => {
    const [error, setError] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorDNI, setErrorDNI] = useState(false);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [dni, setDNI] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [loading, setLoading] = useState(false);

    async function sendEmail({ email, nombre, id }) {
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: email,
                subject: 'Club Cyt - Verificar email',
                html: `<!DOCTYPE html>
<html>

<head>
    <style>
        .main {
            padding: 20px;
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #f9f9f9;
            padding: 20px;
        }

        .logo {
            display: block;
            margin: 0 auto 10px;
        }

        .paragraph {
            color: #333;
            font-size: 16px;
            line-height: 1.5;
        }

        .btn-container {
            text-align: center;
            margin-top: 20px;
        }

        a {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>

<body class="main">
    <div class="container">
        <img src="https://clubcyt.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_blue_clubcyt.d8834c86.png&w=256&q=75"
            width="170" height="50" alt="Club C&T" class="logo" />
        <p class="paragraph">Hola ${nombre},</p>
        <p class="paragraph">Bienvenid@ a Club C&T, haz click en el botón de abajo para verificar tu correo.</p>
        <div class="btn-container">
            <a href="https://clubcyt.vercel.app/welcome/${id}">Verificar correo</a>
        </div>
    </div>
</body>

</html>`
            }),
        });

        const data = await response.json();
        if (response.ok) {
            setLoading(false)
            window.location.href = "/verificar-correo"
        } else {
            alert('Error al enviar el correo');
            setLoading(false)
        }
    }

    // Función para manejar el formulario de registro
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (dni.toString().length == 8) {
            if (password !== password2) {
                setErrorPassword(true);
                setLoading(false);
            }else{
                try {
                    const res = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ nombre, apellido, email, password }),
                    });

                    console.log(res.status);
                    const data = await res.json();

                    // Verifica si el email ya está en uso
                    if (data.emailExists) {
                        setError(true);
                        setLoading(false);
                        return;
                    }

                    const id = data._id;
                    sendEmail({ email, nombre, id })

                } catch (error) {
                    setLoading(false);
                    console.log(error);
                }
            }
        }
        else {
            setErrorDNI(true)
            setLoading(false);

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
                                <Input type="text" label="Nombre" isClearable required onChange={(e) => setNombre(e.target.value)} />
                            </div>
                            <div className='relative col-span-12 md:col-span-6'>
                                <Input type="text" label="Apellido" isClearable onChange={(e) => setApellido(e.target.value)} />
                            </div>
                        </div>
                        <div className='relative w-full'>
                            <Input type="email" label="Email"
                                isInvalid={error ? "true" : "false"}
                                errorMessage={error ? "Email ya esta en uso." : ""}
                                color={error ? "danger" : ""}
                                isClearable required onChange={(e) => {
                                    setError(false)
                                    setEmail(e.target.value)}} />
                        </div>
                        <div className='relative w-full'>
                            <Input type="number" label="Numero de DNI"
                                isInvalid={errorDNI ? "true" : "false"}
                                errorMessage={errorDNI ? "Coloque un DNI valido." : ""}
                                color={errorDNI ? "danger" : ""}
                                isClearable required onChange={(e) => {
                                    setDNI(e.target.value)
                                    setErrorDNI(false)
                                }} />
                        </div>
                        {/* {
                            errorDNI ?
                                <p className='text-xs pt-1 ps-2 text-red-600'>Coloque un dni valido.</p>
                                :
                                ""
                        } */}
                        <div className='relative w-full'>
                            <Input type="password" label="Contraseña"
                                isInvalid={errorPassword ? "true" : "false"}
                                isClearable required onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='relative w-full'>
                            <Input type="password" label="Repite contraseña"
                                isInvalid={errorPassword ? "true" : "false"}
                                isClearable required onChange={(e) => setPassword2(e.target.value)} />
                        </div>
                        {
                            errorPassword ?
                                <p className='text-xs pt-1 ps-2 text-red-600'>Las contraseñas no coinciden</p>
                                :
                                ""
                        }

                        <button type='submit' className='bg-indigo-500 text-white text-sm mt-2 p-3 rounded-md'>
                            {
                                loading ?
                                    <Spinner color='default' size='sm' />
                                    : "Ingresar"
                            }
                        </button>

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