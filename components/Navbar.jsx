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

    const router = useRouter()

    const pathname = usePathname();

    const handleSalir = () => {
        localStorage.removeItem('usuario');
        window.location.href('/')
    }

    useEffect(() => {
        // Este código solo se ejecuta en el navegador
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
    }, []);

    return (
        <div className="container mx-auto max-w-7xl p-2">
            <nav className='flex justify-between items-center  py-4 '>
                <Link href="/">
                    <Image src={logo}
                        width={150}
                        height={50} style={{ marginTop: 5 }} priority alt='logo' />
                </Link>
                <ul className='flex gap-4 justify-center items-center'>
                    <Link href="/" className='hidden md:block'>Inicio</Link>
                    <Link href="/productos" className='hidden md:block'>Productos</Link>
                    <Link href="/productos" className='hidden md:block'>Nosotros</Link>
                    <Link href="/productos" className='hidden md:block'>Contacto</Link>
                    {
                        usuario == null ?
                            <li>
                                <Link href="/login" className='hidden md:block'>login</Link>
                            </li>
                            :
                            <>
                                <li>
                                    <Link href={`/cuenta/${usuario._id}`} className='hidden md:block' >Cuenta</Link>
                                </li>
                                <li>
                                    <Link href="" onClick={handleSalir} className='hidden md:block'>Salir</Link>
                                </li>
                            </>
                    }
                    <Dropdown className=''>
                        <DropdownTrigger>
                            <button
                                variant="bordered"
                            >
                                <MenuSvg className="w-10 h-10 block md:hidden" />
                            </button>
                        </DropdownTrigger>
                        {
                            usuario == null ?
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="new">
                                        <Link href="/login">Ingresar</Link>
                                    </DropdownItem>
                                    <DropdownItem key="new">
                                        <Link href="/productos">Productos</Link>
                                    </DropdownItem>
                                    <DropdownItem key="new">
                                        <Link href="/">Nosotros</Link>
                                    </DropdownItem>
                                    <DropdownItem key="new">
                                        <Link href="/">Contacto</Link>
                                    </DropdownItem>
                                </DropdownMenu>
                                :
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="new">
                                        <Link href="/productos">Productos</Link>
                                    </DropdownItem>
                                    <DropdownItem key="new">
                                        <Link href="/">Nosotros</Link>
                                    </DropdownItem>
                                    <DropdownItem key="new">
                                        <Link href="/">Contacto</Link>
                                    </DropdownItem>
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