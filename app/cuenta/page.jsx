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

const page = ({ params }) => {

    const { data: session, status, update } = useSession();
    console.log(session)

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
        formData.append("upload_preset", "albums"); // Configurado en Cloudinary

        const response = await fetch(`https://api.cloudinary.com/v1_1/dwjhbrsmf/image/upload`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        return data.secure_url; // Retorna el URL seguro de la imagen
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
            <div className="container max-w-6xl mx-auto px-3 lg:p-0">
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
                            {usuario.picture ?
                                <img src={usuario.picture} alt="" className='w-20' />

                                :
                                <img src="https://th.bing.com/th/id/R.19fa7497013a87bd77f7adb96beaf768?rik=144XvMigWWj2bw&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fUser-Profile-PNG-High-Quality-Image.png&ehk=%2bat%2brmqQuJrWL609bAlrUPYgzj%2b%2f7L1ErXRTN6ZyxR0%3d&risl=&pid=ImgRaw&r=0" alt="" className='w-20' />
                            }
                            <p className='text-sm'>{usuario.nombre + " " + usuario.apellido} </p>
                            <p className='text-sm'>{usuario.email}</p>
                            {
                                usuario.suscripto ?
                                    <button
                                        onClick={handleOpenModal}
                                        className='bg-gray-200 text-gray-500 px-2 py-1 text-sm rounded-sm mt-3 hover:border-solid border-2'>Ver credencial</button>
                                    :
                                    <a onClick={() => suscribirse(usuario.email)}
                                        className='bg-yellow-400 cursor-pointer text-white px-2 py-1 text-sm rounded-sm mt-3 hover:border-solid'>Suscribirse</a>
                            }
                            {Array.isArray(productos) && productos.length ?
                                <button
                                    onClick={handleOpenModalPromocion}
                                    className='bg-gray-200 text-gray-500 px-2 py-1 text-sm rounded-sm mt-3 hover:border-solid border-2'>Agregar promocion
                                </button>
                                :
                                ""
                            }
                            <Link href="/cuenta/new" className="bg-gray-200 text-gray-500 px-2 py-1 text-sm rounded-sm mt-3 hover:border-solid border-2">Agregar comercio</Link>
                            <button onClick={
                                handleOpenModalEditarUsuario

                            }
                                className='bg-gray-200 text-gray-500 px-2 py-1 text-sm  rounded-sm mt-3 hover:border-solid border-2'>Editar datos {usuario.dni == 0 ? "⚠️" : ""} </button>
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
                                            <div className="relative">
                                                {/* Imagen de fondo con borde redondeado */}
                                                <Image
                                                    src={qrcontainer}
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
                                                    className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px]" // Centrado
                                                />

                                                {/* Texto debajo del código QR */}
                                                <p className="absolute bottom-28 bg-yellow-200 py-1 px-2 rounded-lg left-1/2 transform -translate-x-1/2 text-black text-lg">
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
                                                    <select
                                                        id="promotion"
                                                        className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        onChange={(e) => setPromocion(e.target.value)}
                                                    >
                                                        <option value="">Selecciona una promoción</option>
                                                        <option value="2x1">2x1</option>
                                                        <option value="3x1">3x1</option>
                                                        <option value="50% off">50% off</option>
                                                    </select>
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