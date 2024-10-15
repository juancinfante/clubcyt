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
        if (localStorage.getItem('usuario') !== null) {
            const { _id } = JSON.parse(localStorage.getItem('usuario'));
            fetchUsuario(_id)
        }

    }, []);

    const obtenerFechaFormateada = () => {
        const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
        const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

        const hoy = new Date();
        const diaSemana = dias[hoy.getDay()];
        const diaMes = hoy.getDate();
        const mes = meses[hoy.getMonth()];

        return `${diaSemana} ${diaMes} DE ${mes}`;
    };

    return (
        <>
        <div className="container mx-auto max-w-6xl ps-3 lg:p-0">
            <div className="py-1">
                {obtenerFechaFormateada()}
            </div>
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
                                <Link href="/suscribirse" className='hidden md:block bg-yellow-200 px-3 py-1 rounded-full'>SUSCRIBITE</Link>
                                <li>
                                    <Link href="/login" className='hidden md:block'>INICIAR SESION</Link>
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
                                        <p className='bg-gray-300 rounded-full px-3 py-3 me-2'>
                                            <svg width="18px" height="18px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#808080"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#808080"></path> <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#808080"></path> </g></svg>
                                        </p>
                                }
                            </button>
                        </DropdownTrigger>
                        {
                            usuario == null ?
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="new2" className='bg-yellow-200 w-full' textValue='a'>
                                        <Link href="/suscribirse" className='w-full'>SUSCRIBITE</Link>
                                    </DropdownItem>
                                    <DropdownItem key="new" textValue='a'>
                                        <Link href="/login">INICIAR SESION</Link>
                                    </DropdownItem>
                                </DropdownMenu>
                                :
                                <DropdownMenu aria-label="Static Actions">
                                    {usuario.suscripto == false ?
                                        <DropdownItem key="new2" className='bg-yellow-200' textValue='a'>
                                            <Link href="/suscribirse">SUSCRIBIRSE</Link>
                                        </DropdownItem>
                                        :
                                        ""}
                                    <DropdownItem key="copy" textValue='a'>
                                        <Link href={`/cuenta/${usuario._id}`} >CUENTA</Link>
                                    </DropdownItem>
                                    <DropdownItem key="edit" textValue='a'>
                                        <Link href="" onClick={handleSalir}>SALIR</Link>
                                    </DropdownItem>
                                </DropdownMenu>
                        }
                    </Dropdown>
                </ul>
            </nav>
        </div>
            {usuario == null ? 
            <div className="w-full bg-gray-100 py-3 flex justify-center items-center gap-2 md:hidden">
                <Link href={"/suscribirse"} className='px-3 py-2 text-xs font-semibold bg-yellow-200 rounded-full'>SUSCRIBITE POR $1.500</Link>
                <Link href={"/login"} className='px-3 py-2 text-xs font-semibold'>INICIAR SESIÓN</Link>
            </div>
            : 
            ""}
            </>
    )
}

export default Navbar