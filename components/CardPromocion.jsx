import { Spinner } from '@nextui-org/spinner';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";


const CardPromocion = ({ promocion }) => {
    console.log(promocion)
    const pathName = usePathname();

    const [isModalOpenPromocion, setIsModalOpenPromocion] = useState(false); // Estado para manejar el modal
    const handleOpenModalPromocion = () => setIsModalOpenPromocion(true);  // Función para abrir el modal
    const handleCloseModalPromocion = () => setIsModalOpenPromocion(false);

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(promocion.imagen);
    const [descripcion, setDescripcion] = useState(promocion.descripcion);
    const [promocionP, setPromocionP] = useState(promocion.promocion);
    const [loadingForm, setLoadingForm] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Eliminar promo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`/api/promociones/${id}`, {
                        method: 'DELETE',
                    });

                    if (res.ok) {
                        Swal.fire({
                            title: "Tu promocion fue eliminada.",
                            icon: "success"
                        });
                        // router.refresh(); // Refrescar la página o lista de productos
                        setTimeout(() => {
                            // Código que quieres retardar
                            window.location.href = window.location.href
                        }, 1500);
                    } else {
                        const data = await res.json();
                        console.error('Error al eliminar la promocion:', data.error);
                        alert('Error al eliminar la promocion');
                    }
                } catch (error) {
                    console.error('Error en la petición:', error);
                    alert('Hubo un error al eliminar la promocion');
                }
            }
        });
    };

    const handleForm = async () => {
        setLoadingForm(true)
        try {
            const uploadImageUrl = selectedImage ? await uploadImage(selectedImage) : promocion.imagen;

            const formData = {
                imagen: uploadImageUrl,
                descripcion: descripcion,
                promocion: promocionP
            }

            // Realizar el fetch POST a la API
            const response = await fetch(`/api/promociones/${promocion._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Convertir los datos a JSON
            });
            if (response.ok) {
                setLoadingForm(false)
                Swal.fire({
                    icon: "success",
                    text: "Promocion actualizada.",
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
    }



    return (

        <>
            
                <div onClick={!pathName.startsWith("/cuenta/") ? onOpen : null} className={pathName.startsWith("/cuenta/") ? "col-span-12 sm:col-span-6 md:col-span-4 rounded-xl overflow-hidden" : "borded col-span-3 rounded-xl overflow-hidden hover:cursor-pointer"}>
                    <div className="relative group">
                        {/* Imagen */}
                        <img src={promocion.imagen} alt="" className="h-40 w-full object-cover" /> {/* Muestra la imagen de la primera promoción */}

                        {/* Contenido del Card */}
                        <div className="p-3 bg-gray-50 h-[85px] rounded-b-xl border">
                            <div className="grid grid-cols-4 text-xl font-semibold items-center">
                                <span className="col-span-3">{promocion.productoId.nombre}</span>
                                <span className="col-span-1 text-right text-3xl text-blue-800">{promocion.promocion}</span>
                            </div>
                        </div>

                        {/* Capa de Hover sobre todo el Card */}
                        {pathName.startsWith("/cuenta/") ? "" : <div className="absolute inset-0 bg-white opacity-0 hover:opacity-30 transition-opacity duration-300"></div>}

                        {
                            pathName.startsWith("/cuenta/") ? (
                                <div className="flex gap-4 justify-end mt-3 p-3">
                                    <div className='flex justify-center items-center gap-3'>
                                        <Image onClick={() => handleDelete(promocion._id)} className='hover:cursor-pointer'
                                            src="https://raw.githubusercontent.com/adrianhajdin/event_platform/fa7a715be4612ad8e17049a8b2ef2ac20ecbf88b/public/assets/icons/delete.svg" alt="delete" width={25} height={25} />
                                        <span onClick={handleOpenModalPromocion}>
                                            <Image src="https://raw.githubusercontent.com/adrianhajdin/event_platform/fa7a715be4612ad8e17049a8b2ef2ac20ecbf88b/public/assets/icons/edit.svg" alt="edit" width={25} height={25} />
                                        </span>
                                    </div>
                                </div>
                            ) : ""
                        }
                    </div>
                </div>
            
            {isModalOpenPromocion && (
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="container mx-auto flex justify-center mt-10">
                                            <div className=" py-10">
                                                <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
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
                                                            value={descripcion}
                                                            id="description"
                                                            rows="3"
                                                            className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            placeholder="Descripción de la promocion..."
                                                            onChange={(e) => setDescripcion(e.target.value)}
                                                        ></textarea>
                                                    </div>
                                                    {/* Seleccionar Promoción */}
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700" htmlFor="promotion">
                                                            Promoción
                                                        </label>
                                                        <select
                                                            value={promocionP}
                                                            id="promotion"
                                                            className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            onChange={(e) => setPromocionP(e.target.value)}
                                                        >
                                                            <option value="">Selecciona una promoción</option>
                                                            <option value="2x1">2x1</option>
                                                            <option value="3x1">3x1</option>
                                                            <option value="50% off">50% off</option>
                                                        </select>
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
                                                                    <Spinner color='default' size='sm' /> : "Actualizar"
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
                </div>
            )}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody>
                                <ModalHeader className="flex p-0 pb-2 pt-5 justify-between items-center"><p>{promocion.productoId.nombre}</p>
                                </ModalHeader>
                                <img
                                    src={imagePreview}
                                    alt="Previsualización"
                                    className="w-full h-48 object-cover rounded-md border border-gray-300"
                                />
                                <div className="flex justify-between items-center">
                                    <p className='text-2xl font-semibold'>Promo</p>
                                    <p className='text-2xl text-blue-800 font-semibold'>{promocionP} </p>
                                </div>
                                <p>
                                    {descripcion}
                                </p>
                            </ModalBody>
                            <ModalFooter>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )

}

export default CardPromocion;