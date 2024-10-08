"use client"
import Navbar from '@/components/Navbar'
import Community from '@/public/assets/community.svg'
import { useEffect, useState } from 'react';

const page = () => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        // Asegurarse de que el código se ejecute solo en el cliente
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <>
            <div className='container mx-auto'>
                <Navbar />
            </div>

            <section
                className="relative bg-[url(https://thumbs.dreamstime.com/b/young-people-having-fun-happy-group-friendship-student-lifestyle-outdoors-park-244194483.jpg)] bg-cover bg-center bg-no-repeat text-gray-800"
            >
                <div
                    className="absolute inset-0 bg-white/75 sm:bg-transparent sm:from-white/95 sm:to-white/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l"
                ></div>

                <div
                    className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex justify-start lg:h-screen lg:items-center lg:px-8"
                >
                    <div className="container mx-auto max-w-6xl text-center ltr:sm:text-left rtl:sm:text-left">
                        <h1 className="text-3xl font-extrabold sm:text-5xl">
                            Suscríbite y disfruta todos los beneficios que ClubCyt tiene para ofrecerte

                        </h1>

                        <p className="mt-4">
                            Solo cuesta $ 2.599 por mes. Cancelá cuando quieras.
                        </p>

                        <div className="mt-8 flex gap-4 justify-start">

                            <a
                                href={user ? "/pagoexitoso" : "/login"}
                                className="block w-full rounded border border-yellow-300 bg-yellow-300 px-3 py-3 md:px-12 md:py-3 text-sm font-medium  shadow hover:text-gray-700 focus:outline-none focus:ring sm:w-auto"
                            >
                                Suscríbite
                            </a>
                            <a
                                href="#clubcyt"
                                className="block w-full rounded bg-white px-3 py-3 md:px-12 md:py-3 text-sm font-medium text-black shadow hover:border-black hover:border focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
                            >
                                Que es club cyt?
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <div className='container mx-auto max-w-6xl mt-[100px] text-gray-800' id='clubcyt'>
                <div className="text-center mb-16">
                    <h1 className='text-7xl font-bold' >ClubC&T</h1>
                    <p className='font-semibold'>Nuestra Cultura al Mundo</p>
                </div>
                <section>
                    <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:h-screen lg:grid-cols-2">
                            <div className="relative z-10 lg:py-16">
                                <div className="relative h-64 sm:h-80 lg:h-full">
                                    <img
                                        alt=""
                                        src="https://cdn.gamma.app/xxfz2vnuinvjx5m/5e48f80e3190483c95a1f0394e7fe0c4/original/tilcara-3.jpg"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="relative flex items-center bg-gray-100">
                                <span
                                    className="hidden lg:absolute lg:inset-y-0 lg:-start-16 lg:block lg:w-16 lg:bg-gray-100"
                                ></span>

                                <div className="p-8 sm:p-16 lg:p-24">
                                    <h2 className="text-2xl font-bold sm:text-3xl">
                                        Bienvenidos a clubcyt.com
                                    </h2>

                                    <p className="mt-4 text-gray-600">
                                        La plataforma de membresía que conecta y potencia el consumo cultural, turístico y comercial del Noroeste Argentino (NOA).
                                    </p>

                                    {/* <a
                                        href=""
                                        className="mt-8 inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                                    >
                                        Get in Touch
                                    </a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl font-bold sm:text-4xl">
                                Que es ClubC&T?
                            </h2>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
                            <div className="relative h-64 overflow-hidden sm:h-80 lg:h-full">
                                <img
                                    alt=""
                                    src="https://cdn.gamma.app/xxfz2vnuinvjx5m/87bd802695244b6286a47097fd5cffd4/original/conectar.webp"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            </div>

                            <div className="lg:py-16">
                                <article className="space-y-4 text-gray-600">
                                    <p>
                                        <strong>Clubcyt.com</strong> es una iniciativa innovadora de Terraviva diseñada para brindar beneficios exclusivos a sus miembros, al mismo tiempo que impulsa el desarrollo económico y cultural de la región.
                                    </p>

                                    <p>
                                        Nuestra plataforma ofrece una amplia gama de ventajas en productos y servicios, que van desde experiencias turísticas y culturales hasta descuentos en una variedad de comercios.
                                    </p>
                                </article>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
            
            <section className="bg-gray-900 text-white">
                <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                    <div className="mx-auto max-w-lg text-center">
                        <h2 className="text-3xl font-bold sm:text-4xl mt-10">Beneficios de ClubC&T</h2>

                        <p className="mt-4 text-gray-300">
                            Ventajas tangibles e inmediatas
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
                        <a
                            className="block rounded-xl border border-gray-800 p-8 shadow-xl transition "
                            href=""
                        >
                            <svg width="45px" height="45px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 2V4" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M12 20V22" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M2 12L4 12" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M20 12L22 12" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M6 18L6.34305 17.657" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M17.6567 6.34326L18 6" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M18 18L17.657 17.657" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M6.34326 6.34326L6 6" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M15.2653 14.6272C15.3921 15.9353 15.4554 16.5894 15.0724 16.8801C14.6894 17.1709 14.1137 16.9058 12.9622 16.3756L12.6643 16.2384C12.337 16.0878 12.1734 16.0124 12 16.0124C11.8266 16.0124 11.663 16.0878 11.3357 16.2384L11.0378 16.3756C9.88634 16.9058 9.31059 17.1709 8.92757 16.8801C8.54456 16.5894 8.60794 15.9353 8.7347 14.6272L8.76749 14.2888C8.80351 13.9171 8.82152 13.7312 8.76793 13.5589C8.71434 13.3865 8.59521 13.2472 8.35696 12.9686L8.14005 12.715C7.30162 11.7345 6.88241 11.2443 7.02871 10.7739C7.13469 10.4331 7.4866 10.2661 8.14005 10.0942M10.5766 8.70419C11.2099 7.56806 11.5266 7 12 7C12.4734 7 12.7901 7.56806 13.4234 8.70419L13.5873 8.99812C13.7672 9.32097 13.8572 9.48239 13.9975 9.5889C14.1378 9.69541 14.3126 9.73495 14.6621 9.81402L14.9802 9.88601C16.2101 10.1643 16.825 10.3034 16.9713 10.7739C17.0769 11.1134 16.8879 11.4631 16.4595 12" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>

                            <h2 className="mt-4 text-xl font-bold text-white">Descuentos exclusivos</h2>

                            <p className="mt-1 text-sm text-gray-300">
                                Acceso a descuentos y promociones en una amplia gama de productos y servicios en la región del NOA.
                            </p>
                        </a>

                        <a
                            className="block rounded-xl border border-gray-800 p-8 shadow-xl transition "
                            href=""
                        >
                            <svg width="45px" height="45px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 2V4" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M12 20V22" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M2 12L4 12" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M20 12L22 12" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M6 18L6.34305 17.657" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M17.6567 6.34326L18 6" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M18 18L17.657 17.657" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M6.34326 6.34326L6 6" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M15.2653 14.6272C15.3921 15.9353 15.4554 16.5894 15.0724 16.8801C14.6894 17.1709 14.1137 16.9058 12.9622 16.3756L12.6643 16.2384C12.337 16.0878 12.1734 16.0124 12 16.0124C11.8266 16.0124 11.663 16.0878 11.3357 16.2384L11.0378 16.3756C9.88634 16.9058 9.31059 17.1709 8.92757 16.8801C8.54456 16.5894 8.60794 15.9353 8.7347 14.6272L8.76749 14.2888C8.80351 13.9171 8.82152 13.7312 8.76793 13.5589C8.71434 13.3865 8.59521 13.2472 8.35696 12.9686L8.14005 12.715C7.30162 11.7345 6.88241 11.2443 7.02871 10.7739C7.13469 10.4331 7.4866 10.2661 8.14005 10.0942M10.5766 8.70419C11.2099 7.56806 11.5266 7 12 7C12.4734 7 12.7901 7.56806 13.4234 8.70419L13.5873 8.99812C13.7672 9.32097 13.8572 9.48239 13.9975 9.5889C14.1378 9.69541 14.3126 9.73495 14.6621 9.81402L14.9802 9.88601C16.2101 10.1643 16.825 10.3034 16.9713 10.7739C17.0769 11.1134 16.8879 11.4631 16.4595 12" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>

                            <h2 className="mt-4 text-xl font-bold text-white">Experiencias Culturales y Turísticas</h2>

                            <p className="mt-1 text-sm text-gray-300">
                                Participación en eventos culturales, festivales, y experiencias turísticas únicas que destacan lo mejor del NOA.
                            </p>
                        </a>

                        <a
                            className="block rounded-xl border border-gray-800 p-8 shadow-xl transition "
                            href="#"
                        >
                            <img src="" alt="" />
                            <svg width="45px" height="45px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 2V4" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M12 20V22" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M2 12L4 12" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M20 12L22 12" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M6 18L6.34305 17.657" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M17.6567 6.34326L18 6" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M18 18L17.657 17.657" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M6.34326 6.34326L6 6" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M15.2653 14.6272C15.3921 15.9353 15.4554 16.5894 15.0724 16.8801C14.6894 17.1709 14.1137 16.9058 12.9622 16.3756L12.6643 16.2384C12.337 16.0878 12.1734 16.0124 12 16.0124C11.8266 16.0124 11.663 16.0878 11.3357 16.2384L11.0378 16.3756C9.88634 16.9058 9.31059 17.1709 8.92757 16.8801C8.54456 16.5894 8.60794 15.9353 8.7347 14.6272L8.76749 14.2888C8.80351 13.9171 8.82152 13.7312 8.76793 13.5589C8.71434 13.3865 8.59521 13.2472 8.35696 12.9686L8.14005 12.715C7.30162 11.7345 6.88241 11.2443 7.02871 10.7739C7.13469 10.4331 7.4866 10.2661 8.14005 10.0942M10.5766 8.70419C11.2099 7.56806 11.5266 7 12 7C12.4734 7 12.7901 7.56806 13.4234 8.70419L13.5873 8.99812C13.7672 9.32097 13.8572 9.48239 13.9975 9.5889C14.1378 9.69541 14.3126 9.73495 14.6621 9.81402L14.9802 9.88601C16.2101 10.1643 16.825 10.3034 16.9713 10.7739C17.0769 11.1134 16.8879 11.4631 16.4595 12" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                            <h2 className="mt-4 text-xl font-bold text-white">Mejora del Poder Adquisitivo</h2>

                            <p className="mt-1 text-sm text-gray-300">
                                Beneficios que impactan directamente en el rendimiento económico de nuestros miembros, haciendo que su dinero rinda más
                            </p>
                        </a>

                        <a
                            className="block rounded-xl border border-gray-800 p-8 shadow-xl transition "
                            href=""
                        >
                            <svg width="45px" height="45px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 2V4" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M12 20V22" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M2 12L4 12" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M20 12L22 12" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M6 18L6.34305 17.657" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M17.6567 6.34326L18 6" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M18 18L17.657 17.657" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M6.34326 6.34326L6 6" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M15.2653 14.6272C15.3921 15.9353 15.4554 16.5894 15.0724 16.8801C14.6894 17.1709 14.1137 16.9058 12.9622 16.3756L12.6643 16.2384C12.337 16.0878 12.1734 16.0124 12 16.0124C11.8266 16.0124 11.663 16.0878 11.3357 16.2384L11.0378 16.3756C9.88634 16.9058 9.31059 17.1709 8.92757 16.8801C8.54456 16.5894 8.60794 15.9353 8.7347 14.6272L8.76749 14.2888C8.80351 13.9171 8.82152 13.7312 8.76793 13.5589C8.71434 13.3865 8.59521 13.2472 8.35696 12.9686L8.14005 12.715C7.30162 11.7345 6.88241 11.2443 7.02871 10.7739C7.13469 10.4331 7.4866 10.2661 8.14005 10.0942M10.5766 8.70419C11.2099 7.56806 11.5266 7 12 7C12.4734 7 12.7901 7.56806 13.4234 8.70419L13.5873 8.99812C13.7672 9.32097 13.8572 9.48239 13.9975 9.5889C14.1378 9.69541 14.3126 9.73495 14.6621 9.81402L14.9802 9.88601C16.2101 10.1643 16.825 10.3034 16.9713 10.7739C17.0769 11.1134 16.8879 11.4631 16.4595 12" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>

                            <h2 className="mt-4 text-xl font-bold text-white">Apoyo a Emprendedores y Artistas Locales</h2>

                            <p className="mt-1 text-sm text-gray-300">
                                Promoción y respaldo a emprendedores, artistas y artesanos, facilitando el desarrollo de sus proyectos y contribuyendo al crecimiento económico local.
                            </p>
                        </a>
                    </div>

                </div>
            </section>
            <div className="container mx-auto max-w-6xl mt-16 text-gray-600 p-4">
                <h1 className='text-4xl font-semibold mb-16'>Preguntas Frecuentes</h1>
                <div className="space-y-4">
                    <details
                        className="group border-s-4 border-indigo-500 bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden"
                        open
                    >
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5">
                            <h2 className="text-lg font-medium text-gray-800">
                                ¿Qué servicios ofrecen?
                            </h2>

                            <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-800 sm:p-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                        </summary>
                        <ul>
                            <li className='mt-4 leading-relaxed text-gray-700'>
                                • Ofrecemos a nuestros miembros acceso a descuentos y promociones especiales en una amplia gama de productos y servicios, incluyendo gastronomía, tiendas, y actividades turísticas y culturales.
                            </li>
                            <li className='mt-4 leading-relaxed text-gray-700'>
                                • Nuestros miembros disfrutan de acceso privilegiado a eventos culturales, festivales y conciertos, además de paquetes turísticos exclusivos que destacan la riqueza del NOA.
                            </li>
                            <li className='mt-4 leading-relaxed text-gray-700'>
                                • Promovemos y apoyamos a emprendedores, artistas y artesanos de la región, ayudándoles a alcanzar una audiencia más amplia y a desarrollar sus proyectos mediante nuestra plataforma.
                            </li>
                        </ul>
                    </details>

                    <details
                        className="group border-s-4 border-indigo-500 bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden"
                    >
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5">
                            <h2 className="text-lg font-medium text-gray-800">
                                ¿Cómo puedo contactarlos?
                            </h2>

                            <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-800 sm:p-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                        </summary>

                        <p className="mt-4 leading-relaxed text-gray-700">
                            Puedes contactarnos a través de nuestro sitio web, correo electrónico o teléfono.
                        </p>
                    </details>
                    <details
                        className="group border-s-4 border-indigo-500 bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden"
                    >
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5">
                            <h2 className="text-lg font-medium text-gray-800">
                                ¿Qué tipo de membresías  ofrecen?
                            </h2>

                            <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-800 sm:p-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                        </summary>

                        <ul>
                            <li>
                                <p className='font-bold'>
                                    • Membresía Básica:
                                </p>
                                <br />
                                <p>
                                    <strong className='ms-10'>Beneficios Incluidos: </strong>
                                    Acceso a descuentos en productos y servicios locales, participación en eventos comunitarios y notificaciones sobre ofertas especiales.
                                </p>
                                <p>
                                    <strong className='ms-10'>Ideal para: </strong>
                                    Residentes locales que desean ahorrar en su consumo diario y participar en la vida cultural de la región.
                                </p>

                            </li>
                            <br />
                            <li>
                                <p className='font-bold'>
                                    • Membresía Premium:
                                </p>
                                <br />
                                <p>
                                    <strong className='ms-10'>Beneficios Incluidos: </strong>
                                    Todos los beneficios de la Membresía Básica, además de acceso          exclusivo a experiencias turísticas y culturales únicas, eventos VIP y mayores descuentos en productos y servicios.
                                </p>
                                <p>
                                    <strong className='ms-10'>Ideal para: </strong>
                                    Turistas y residentes que buscan una experiencia más enriquecida y exclusiva del     NOA.
                                </p>

                            </li>
                            <br />
                            <li>
                                <p className='font-bold'>
                                    • Membresía Empresarial:
                                </p>
                                <br />
                                <p>
                                    <strong className='ms-10'>Beneficios Incluidos: </strong>
                                    Descuentos y promociones para empleados, acceso a eventos empresariales y networking, y oportunidades de colaboración y promoción a través de nuestra plataforma.
                                </p>
                                <p>
                                    <strong className='ms-10'>Ideal para: </strong>
                                    Empresas locales y regionales que desean ofrecer beneficios adicionales a sus empleados y aumentar su visibilidad en la comunidad.
                                </p>

                            </li>
                        </ul>
                    </details>
                </div>

            </div>

        </>
    )
}

export default page