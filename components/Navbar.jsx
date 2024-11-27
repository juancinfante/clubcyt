"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/assets/logo_blue_clubcyt.png'
import { usePathname, useRouter } from 'next/navigation'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown'
import MenuSvg from '@/public/assets/menu.svg'
import { signOut, useSession } from 'next-auth/react'

const Navbar = () => {


    const session = useSession()
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);



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
                            !session.data ?
                                <>
                                    {/* <Link href="/suscribirse" className='bg-yellow-200 px-3 py-1 rounded-full md:hidden'>SUSCRIBITE</Link> */}
                                    <li>
                                        <Link href="/nosotros" className='hidden md:block'>NOSOTROS</Link>
                                    </li>
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
                                        session?.data ? (
                                            session.data.user.picture ? (
                                                <img
                                                    src={session.data.user.picture}
                                                    alt="Foto de perfil"
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            ) : (
                                                <p className="bg-gray-300 rounded-full px-3 py-3 me-2">
                                                    <svg
                                                        width="18px"
                                                        height="18px"
                                                        viewBox="0 0 16 16"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        stroke="#808080"
                                                    >
                                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                                        <g id="SVGRepo_iconCarrier">
                                                            <path
                                                                d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
                                                                fill="#808080">
                                                            </path>
                                                            <path
                                                                d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
                                                                fill="#808080">
                                                            </path>
                                                        </g>
                                                    </svg>
                                                </p>
                                            )
                                        ) : null
                                    }

                                </button>
                            </DropdownTrigger>
                            {
                                !session.data ?
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
                                        {!session.data && session.data.user.suscripto ?
                                            <DropdownItem key="new2" className='bg-yellow-200' textValue='a'>
                                                <Link href="/suscribirse">SUSCRIBIRSE</Link>
                                            </DropdownItem>
                                            :
                                            ""}
                                        <DropdownItem key="copy" textValue='a'>
                                            <Link href={`/cuenta/`} >CUENTA</Link>
                                        </DropdownItem>
                                        {session?.data?.user?.role == "admin" ?
                                            <DropdownItem key="admin" textValue='a'>
                                                <Link href={`/admin`} >ADMIN</Link>
                                            </DropdownItem> : ""}
                                        <DropdownItem key="edit" textValue='a'>
                                            <Link href="" onClick={() => { signOut({ callbackUrl: "/" }) }}>SALIR</Link>
                                        </DropdownItem>
                                    </DropdownMenu>
                            }
                        </Dropdown>
                    </ul>
                </nav>
            </div>
            {session?.data?.user?.role !== "admin" && !session?.data?.user?.suscripto ?
                <div className="w-full bg-gray-100 py-2 flex justify-center items-center gap-2">
                    <Link href={"/suscribirse"} className='px-3 py-2 text-xs font-semibold bg-yellow-200 rounded-full'>SUSCRIBITE POR $1.500</Link>
                    {/* <Link href={"/login"} className='px-3 py-2 text-xs font-semibold'>INICIAR SESIÓN</Link> */}
                </div>
                : ""
            }{
                session?.data?.user?.dni == 0 ?
                    <div className="w-full bg-gray-200 py-2 flex justify-center items-center gap-2">
                        <Link href={"/cuenta"} className='px-3 py-2 text-xs font-semibold bg-blue-200 rounded-full underline'>Completa los datos de tu perfil →</Link>
                        {/* <Link href={"/login"} className='px-3 py-2 text-xs font-semibold'>INICIAR SESIÓN</Link> */}
                    </div>
                    :
                    ""
            }
        </>
    )
}

export default Navbar