"use client"
import CardProducto from '@/components/CardProducto'
import CardPromocion from '@/components/CardPromocion'
import Navbar from '@/components/Navbar'
import Products from '@/components/Products'
import Separador from '@/components/Separador'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import qrcontainer from '@/public/assets/qrcontainer.jpeg';
import { Spinner } from '@nextui-org/spinner'
import Swal from 'sweetalert2'
import { useSession } from 'next-auth/react'
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';


const page = ({ params }) => {
    const modalRef = useRef();
    const { data: session, status, update } = useSession();

    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar el modal
    const [isModalOpenPromocion, setIsModalOpenPromocion] = useState(false); // Estado para manejar el modal
    const [isModalOpenEditarUsuario, setIsModalOpenEditarUsuario] = useState(false); // Estado para manejar el modal

    const handleOpenModal = () => setIsModalOpen(true);  // Función para abrir el modal
    const handleCloseModal = () => setIsModalOpen(false);
    const handleOpenModalPromocion = () => setIsModalOpenPromocion(true);  // Función para abrir el modal
    const handleCloseModalPromocion = () => setIsModalOpenPromocion(false);

    const [productos, setProductos] = useState([])
    const [promociones, setPromociones] = useState([])
    const [usuario, setUsuario] = useState([])
    const [errores, setErrores] = useState({ email: false, dni: false });
    const [loading, setLoading] = useState(false);
    const [loadingForm, setLoadingForm] = useState(false);
    const [fechaInicio, setFechaInicio] = useState(false);
    const [fechafin, setFechaFin] = useState(false);
    const today = new Date().toISOString().split("T")[0];

    const [show, setShow] = useState(false);


    const [productoPromocion, setProductoPromocion] = useState(null);
    const [promocion, setPromocion] = useState(null);
    const [descripcionPromocion, setDescripcionPromocion] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [usuarioTemporal, setUsuarioTemporal] = useState([]);

    const handleOpenModalEditarUsuario = () => {
        setUsuarioTemporal(usuario);
        setIsModalOpenEditarUsuario(true); // Cambiar el estado para cerrar el modal
    };
    const handleCloseModalEditarUsuario = () => {
        setIsModalOpenEditarUsuario(false); // Cambiar el estado para cerrar el modal
    };

    async function updateSession(usuario) {
        await update({
            ...session,
            user: {
                usuario
            }
        })
    }


    const handleUpdateUsuario = async () => {
        setLoadingForm(true)
        try {
            // Opcional: Validación de los datos antes de enviarlos
            if (!usuarioTemporal.nombre || !usuarioTemporal.apellido || !usuarioTemporal.email || !usuarioTemporal.dni) {
                alert("Por favor, completa todos los campos.");
                setLoadingForm(false)
                return;
            }

            // Petición al backend para actualizar los datos
            const response = await fetch(`/api/usuarios/${usuario._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: usuarioTemporal.nombre,
                    apellido: usuarioTemporal.apellido,
                    email: usuarioTemporal.email,
                    dni: usuarioTemporal.dni,
                }),
            });

            if (response.ok) {
                setLoadingForm(false)
                Swal.fire({
                    icon: "success",
                    text: "Datos editados.",
                });

                const data = await response.json();

                // Actualizar el estado local/global con los datos nuevos
                setUsuario(data);
                await update({
                    ...session,
                    user: {
                        usuario
                    }
                })
                setTimeout(function () {
                    window.location.reload(true);
                }, 1500);
                setIsModalOpenPromocion(false)
            } else {
                setLoadingForm(false)
                Swal.fire({
                    icon: "warning",
                    text: "Hubo un error al editar los datos.",
                });
            }
            // Cerrar el modal
            handleCloseModalEditarUsuario();
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al actualizar el usuario.");
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchProductos = async (idUsuario) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/productos/usuario/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
                return;
            }

            const data = await response.json();
            setProductos(data.productos || []);
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
        setLoadingForm(false)

    };

    const fetchUsuario = async (idUsuario) => {
        setLoading(true);
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

        setLoading(false);

    }

    const fetchPromociones = async (userId) => {

        try {
            // Realizamos la solicitud GET al endpoint que maneja la función GET en el backend
            const response = await fetch(`/api/promociones/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setPromociones(data.promociones)
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    }

    // Función para subir la imagen a Cloudinary
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("nombreComercio", "promociones");

        const response = await fetch("/api/cloudinary", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        return data.imageUrl; // URL de la imagen en Cloudinary
    };

    const handleForm = async () => {
        setLoadingForm(true)
        try {
            const uploadImageUrl = selectedImage ? await uploadImage(selectedImage) : null;

            const formData = {
                usuarioId: usuario._id,
                productoId: productoPromocion,
                imagen: uploadImageUrl,
                desde: fechaInicio,
                hasta: fechafin,
                descripcion: descripcionPromocion,
                promocion: promocion
            }

            // Realizar el fetch POST a la API
            const response = await fetch('/api/promociones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Convertir los datos a JSON
            });
            if (response.ok) {
                setLoadingForm(false)
                Swal.fire({
                    icon: "success",
                    text: "Promocion añadidad.",
                });
                setTimeout(function () {
                    window.location.reload(true);
                }, 1500);
                setIsModalOpenPromocion(false)
            } else {
                setLoadingForm(false)
                Swal.fire({
                    icon: "warning",
                    text: "Hubo un error al crear la promocion.",
                });
            }

        } catch (error) {
            console.log(error)
        }
        setLoadingForm(true)

    }

    const handleDownloadPDF = async (usuario) => {
        if (!modalRef.current) return;

        const canvas = await html2canvas(modalRef.current);
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

        // nombre dinámico
        const fileName = `${usuario.nombre}_clubcyt.pdf`;

        pdf.save(fileName);
    };

    const suscribirse = async (email) => {

        try {
            const response = await fetch("/api/suscribirse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }), // Enviamos el email al backend
            });

            if (!response.ok) {
                console.log(response)
                throw new Error("Error al crear la suscripción");
            }

            const data = await response.json();
            // Redirigimos al usuario a Mercado Pago
            window.location.href = data.url;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // }, [])
    useEffect(() => {
        if (session?.user?.id) {
            fetchProductos(session.user.id);
            fetchUsuario(session.user.id);
            fetchPromociones(session.user.id)
        }
    }, [session, status]);



    return (
        <>
            <Navbar />
            <Separador texto={"Cuenta"} />
            <div className="container max-w-7xl mx-auto px-3 lg:p-0">
                <div className="grid grid-cols-12 gap-6 mt-5 py-4">
                    {loading ?
                        <div className="col-span-12 md:col-span-3 h-96 p-9 rounded-lg border border-slate-200 card-user flex flex-col items-center animate-pulse">
                            {/* Imagen Skeleton */}
                            <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
                            {/* Nombre y Apellido Skeleton */}
                            <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                            {/* Email Skeleton */}
                            <div className="h-4 w-40 bg-gray-300 rounded mb-4"></div>
                            {/* Botones Skeleton */}
                            <div className="w-24 h-8 bg-gray-300 rounded mb-2"></div>
                            <div className="w-32 h-8 bg-gray-300 rounded mb-2"></div>
                            <div className="w-32 h-8 bg-gray-300 rounded mb-2"></div>
                            <div className="w-28 h-8 bg-gray-300 rounded"></div>
                        </div>
                        :
                        <div className="col-span-12 md:col-span-3 h-96 p-9 rounded-lg border border-slate-200 card-user flex flex-col items-center">
                            {/* Foto de perfil */}
                            {usuario.picture ? (
                                <img src={usuario.picture} alt="Foto de perfil" className="w-20 h-20 rounded-full mb-4" />
                            ) : (
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500 mb-4">
                                    {usuario.nombre}
                                </div>
                            )}
                            {/* Información del usuario */}
                            <p className="text-lg font-semibold text-gray-700 flex items-center">
                                <svg className="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 12.879l7.072 7.072M5.121 5.121l7.072 7.072M3 12h18" />
                                </svg>
                                {usuario.nombre} {usuario.apellido}
                            </p>
                            {/* Botones */}
                            {usuario.suscripto ? (
                                <button
                                    onClick={handleOpenModal}
                                    className="bg-gray-200 w-48 text-gray-500 px-3 py-2 text-sm rounded-md mt-3 flex justify-center items-center hover:bg-gray-300">
                                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16h10M7 12h10M7 8h10" />
                                    </svg>
                                    Ver credencial
                                </button>
                            ) : (
                                <button
                                    onClick={() => suscribirse(usuario.email)}
                                    className="bg-yellow-500 text-white px-3 py-2 text-sm rounded-md mt-3 w-48 flex justify-center items-center hover:bg-yellow-600">
                                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                                    </svg>
                                    Suscribirse
                                </button>
                            )}
                            {Array.isArray(productos) && productos.length > 0 && (
                                <button
                                    onClick={handleOpenModalPromocion}
                                    className="bg-gray-200 text-gray-500 px-3 py-2 text-sm rounded-md mt-3 w-48 flex items-center hover:bg-gray-300">
                                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 0v4m-4-4h4m0 0h4" />
                                    </svg>
                                    Agregar promoción
                                </button>
                            )}

                            <Link href="/cuenta/new" className="w-48 justify-center bg-gray-200 text-gray-500 px-3 py-2 text-sm rounded-md mt-3 flex items-center hover:bg-gray-300">
                                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Agregar comercio
                            </Link>

                            <button
                                onClick={handleOpenModalEditarUsuario}
                                className="bg-gray-200 w-48 text-gray-500 px-3 py-2 text-sm rounded-md mt-3 flex justify-center items-center hover:bg-gray-300">
                                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12h.01M19 20l-7-7m-2-5h3M10 7H7m3 0V4m0 3h3" />
                                </svg>
                                Editar datos {usuario.dni === 0 && <span className="text-red-500 ml-2">⚠️</span>}
                            </button>
                        </div>}

                    <div className="col-span-12 md:col-span-9">
                        <div className="grid grid-cols-12 w-full gap-4">
                            {loading ? (
                                // Mostrar skeletons para simular productos
                                Array(8)
                                    .fill()
                                    .map((_, i) => <CardProducto key={i} loading={true} />)
                            ) : productos.length === 0 ? (
                                // Mostrar mensaje cuando no se encuentran productos
                                <h1 className='col-span-12 text-center font-semibold mt-10'>No tienes ningun producto publicado</h1>
                            ) : (
                                // Mostrar productos cuando existan
                                productos.map((producto) => (
                                    <CardProducto key={producto._id} producto={producto} email={usuario.email} loading={false} />
                                ))
                            )}
                            {productos.length != 0 ?
                                Array.isArray(promociones) ?
                                    promociones.length > 0 ? promociones.map((prom) => (
                                        <CardPromocion key={prom._id} promocion={prom} />
                                    )) : "" : ""
                                :
                                ""}
                        </div>
                    </div>
                </div>
            </div>
            {/* Componente del Modal */}
            {isModalOpen && (
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="container mx-auto flex justify-center mt-10">
                                            <div className="relative" ref={modalRef}>
                                                {/* Imagen de fondo con borde redondeado */}
                                                <img
                                                    src={qrcontainer.src}
                                                    height={500}
                                                    width={300}
                                                    alt="QR Container"
                                                    className="rounded-lg"
                                                />

                                                {/* Nombre del usuario encima del código QR */}
                                                <h3 className="absolute top-32 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-900">
                                                    {usuario.nombre} {usuario.apellido}
                                                </h3>

                                                {/* Imagen generada del QR superpuesta */}
                                                <img
                                                    src={usuario.qrcode}
                                                    alt="Generated QR Code"
                                                    className="absolute mt-1 top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px]" // Centrado
                                                />

                                                {/* Texto debajo del código QR */}
                                                <p className="absolute bottom-28 font-bold py-1 px-2 rounded-lg left-1/2 transform -translate-x-1/2 text-black text-lg">
                                                    Activo
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={handleCloseModal} // Cierra el modal
                                    >
                                        cerrar
                                    </button>
                                    <button
                                        onClick={() => handleDownloadPDF(usuario)}
                                        className="mt-3 inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                                    >
                                        Descargar imagen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )}
            {isModalOpenEditarUsuario && (
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 max-h-[500px] overflow-y-auto">
                                    <h2 className="text-2xl font-bold mb-4">Editar mis datos</h2>
                                    {/* Formulario de edición */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            id="nombre"
                                            className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={usuarioTemporal.nombre}
                                            onChange={(e) => setUsuarioTemporal({ ...usuarioTemporal, nombre: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700" htmlFor="apellido">
                                            Apellido
                                        </label>
                                        <input
                                            type="text"
                                            id="apellido"
                                            className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={usuarioTemporal.apellido}
                                            onChange={(e) => setUsuarioTemporal({ ...usuarioTemporal, apellido: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className={`mt-2 block w-full p-2.5 border ${errores.email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                            value={usuarioTemporal.email}
                                            onChange={(e) => {
                                                setUsuarioTemporal({ ...usuarioTemporal, email: e.target.value });
                                                setErrores({ ...errores, email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value) });
                                            }}
                                        />
                                        {errores.email && <p className="text-red-500 text-sm mt-1">Por favor, ingrese un email válido.</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700" htmlFor="dni">
                                            DNI
                                        </label>
                                        <input
                                            type="text"
                                            id="dni"
                                            className={`mt-2 block w-full p-2.5 border ${errores.dni ? "border-red-500" : "border-gray-300"
                                                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                            value={usuarioTemporal.dni}
                                            onChange={(e) => {
                                                const valor = e.target.value;
                                                setUsuarioTemporal({ ...usuarioTemporal, dni: valor });
                                                // Validar si el DNI es numérico y tiene exactamente 10 dígitos
                                                setErrores({
                                                    ...errores,
                                                    dni: isNaN(valor) || valor.length !== 8,
                                                });
                                            }}
                                        />
                                        {errores.dni && (
                                            <p className="text-red-500 text-sm mt-1">
                                                El DNI debe ser un número de 10 dígitos.
                                            </p>
                                        )}
                                    </div>
                                    {/* Botón Guardar */}
                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            onClick={handleUpdateUsuario}
                                            disabled={Object.values(errores).some((error) => error)}
                                        >
                                            {loadingForm ? <Spinner color="default" size="sm" /> : "Guardar cambios"}
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={handleCloseModalEditarUsuario}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpenPromocion && (
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 max-h-[500px] overflow-y-auto ">
                                    <div className="sm:flex sm:items-start">
                                        <div className="container mx-auto flex justify-center mt-10">
                                            <div className="max-w-xl mx-auto bg-white rounded-lg">
                                                <h1 className="text-2xl font-bold mb-4">Agregar Promocion</h1>

                                                {/* Subir Imagen */}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700" htmlFor="image">
                                                        Subir Imagen
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id="image"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                    />

                                                    {/* Previsualización de la imagen */}
                                                    {imagePreview && (
                                                        <div className="mt-4">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Previsualización"
                                                                className="w-full h-48 object-cover rounded-md border border-gray-300"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Descripción */}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                                                        Breve descripción
                                                    </label>
                                                    <textarea
                                                        id="description"
                                                        rows="3"
                                                        className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="Descripción de la promocion..."
                                                        onChange={(e) => setDescripcionPromocion(e.target.value)}
                                                    ></textarea>
                                                </div>

                                                {/* Seleccionar Promoción */}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700" htmlFor="promotion">
                                                        Promoción
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="promotion"
                                                        className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        onChange={(e) => setPromocion(e.target.value)}
                                                    />
                                                </div>

                                                {/* Seleccionar Producto */}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700" htmlFor="product">
                                                        Aplicar en
                                                    </label>
                                                    <select
                                                        id="product"
                                                        className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        onChange={(e) => setProductoPromocion(e.target.value)}
                                                    >
                                                        <option value="">Selecciona un producto</option>
                                                        {productos.map((producto) => (
                                                            <option key={producto._id} value={producto._id}>
                                                                {producto.nombre}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {/* Fecha de inicio */}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700" htmlFor="start-date">
                                                        Valido desde:
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="start-date"
                                                        className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        onChange={(e) => setFechaInicio(e.target.value)}
                                                        min={today}
                                                    />
                                                </div>

                                                {/* Fecha de fin */}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700" htmlFor="end-date">
                                                        Hasta
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="end-date"
                                                        className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        onChange={(e) => setFechaFin(e.target.value)}
                                                    />
                                                </div>
                                                {/* Botón Enviar */}
                                                <div className="mt-6">
                                                    <button
                                                        type="submit"
                                                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        onClick={handleForm}
                                                    >
                                                        {
                                                            loadingForm ?
                                                                <Spinner color='default' size='sm' /> : "Crear"
                                                        }
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={handleCloseModalPromocion} // Cierra el modal
                                    >
                                        cerrar
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="mt-3 inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                                    >
                                        Descargar imagen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </>
    )
}

export default page