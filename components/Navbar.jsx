"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/assets/logo_blue_clubcyt.png'
import { usePathname, useRouter } from 'next/navigation'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown'
import MenuSvg from '@/public/assets/menu.svg'

const Navbar = () => {

    const [usuario, setUsuario] = useState(null);

    const handleSalir = () => {
        localStorage.removeItem('usuario');
        window.location.href('/')
    }

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
        if(localStorage.getItem('usuario') !== null){
            const { _id } = JSON.parse(localStorage.getItem('usuario'));
            fetchUsuario(_id)
        }
        
    }, []);

    return (
        <div className="container mx-auto max-w-6xl ps-3">
            <nav className='flex justify-between items-center  py-4 '>
                <Link href="/">
                    <Image src={logo}
                        width={150}
                        height={50} style={{ marginTop: 5 }} priority alt='logo' />
                </Link>
                <ul className='flex gap-4 justify-center items-center'>
                    {
                        usuario == null ?
                            <>
                                <Link href="/suscribirse" className='hidden md:block bg-yellow-300 px-3 py-1 rounded-full'>Suscríbite</Link>
                                <li>
                                    <Link href="/login" className='hidden md:block'>Iniciar sesión</Link>
                                </li>
                            </>
                            :
                            ""
                    }
                    <Dropdown className=''>
                        <DropdownTrigger>
                            <button
                                variant="bordered"
                            >
                                {
                                    usuario == null ?
                                        <MenuSvg className="w-10 h-10 md:hidden" />
                                        :
                                        <p className='bg-gray-300 rounded-full px-3 py-2 me-2'>CC</p>
                                }
                            </button>
                        </DropdownTrigger>
                        {
                            usuario == null ?
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="new2" className='bg-yellow-300 w-full'>
                                        <Link href="/suscribirse" className='w-full'>Suscríbite</Link>
                                    </DropdownItem>
                                    <DropdownItem key="new">
                                        <Link href="/login">Iniciar sesión</Link>
                                    </DropdownItem>
                                </DropdownMenu>
                                :
                                <DropdownMenu aria-label="Static Actions">
                                    {usuario.suscripto == false ?
                                        <DropdownItem key="new2" className='bg-yellow-300'>
                                            <Link href="/pagoexitoso">SUSCRIBIRSE</Link>
                                        </DropdownItem>
                                        :
                                        ""}
                                    <DropdownItem key="copy">
                                        <Link href={`/cuenta/${usuario._id}`} >Cuenta</Link>
                                    </DropdownItem>
                                    <DropdownItem key="edit">
                                        <Link href="" onClick={handleSalir}>Salir</Link>
                                    </DropdownItem>
                                </DropdownMenu>
                        }
                    </Dropdown>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar