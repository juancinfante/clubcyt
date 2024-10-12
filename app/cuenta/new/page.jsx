"use client"

import Navbar from '@/components/Navbar'
import Separador from '@/components/Separador'
import { Input, Textarea } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import { Tooltip } from '@nextui-org/tooltip'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { Spinner } from '@nextui-org/spinner';
import LeafletMap from "@/components/MapEdit";

// Importa ReactQuill dinámicamente
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Asegúrate de incluir los estilos de Quill


const Page = () => {

    const [nombre, setNombre] = useState("")
    const [categoria, setCategoria] = useState("")
    const [provincia, setProvincia] = useState("")
    const [ubicacion, setUbicacion] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [descuento, setDescuento] = useState("")
    const [logo, setLogo] = useState(null)
    const [portada, setPortada] = useState(null)
    const [telefono, setTelefono] = useState(null)
    const [celular, setCelular] = useState(null)
    const [ig, setIg] = useState("")
    const [fb, setFb] = useState("")
    const [web, setWeb] = useState("")
    const [video_youtube, setVideoYoutube] = useState("")
    const [logoPreview, setLogoPreview] = useState("https://img.freepik.com/premium-vector/image-upload-icon_192037-7840.jpg")
    const [portadaPreview, setPortadaPreview] = useState("https://img.freepik.com/premium-vector/image-upload-icon_192037-7840.jpg")
    const [logoUrl, setLogoUrl] = useState(null)
    const [portadaUrl, setPortadaUrl] = useState(null)
    const [galeriaUrls, setGaleriaUrls] = useState([]) // URLs para las imágenes de la galería
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [imagenes, setImagenes] = useState([]);
    const [previews, setPreviews] = useState([]);

    const [errores, setErrores] = useState([]);

    // Estado para los tags
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");


    // Función para agregar un nuevo tag
    const handleAddTag = () => {
        if (tagInput.trim() !== "") {
            setTags([...tags, tagInput]);
            setTagInput(""); // Limpiar el input después de agregar
        }
    };

    // Función para eliminar un tag
    const handleRemoveTag = (index) => {
        const updatedTags = tags.filter((_, i) => i !== index);
        setTags(updatedTags);
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

    const handleForm = async (e) => {
        e.preventDefault();
        setLoading(true);


        const Nerrores = [];

        // Validaciones
        if (!nombre) Nerrores.push("nombre");
        if (!ubicacion) Nerrores.push("ubicacion");
        if (!descuento) Nerrores.push("descuento");
        if (!categoria) Nerrores.push("categoria");
        if (!provincia) Nerrores.push("provincia");
        if (!celular) Nerrores.push("celular");
        // Agrega más validaciones para otros campos que consideres requeridos

        // Si hay errores, no enviar el formulario y mostrar los errores
        if (Nerrores.length > 0) {
            setErrores(Nerrores);
            Swal.fire({
                icon: "warning",
                text: "Completa los campos obligatorios!",
            });
            setLoading(false);
            return; // Salir de la función si hay errores
        }
        try {
            // Subir logo y portada
            const uploadedLogoUrl = logo ? await uploadImage(logo) : null;
            const uploadedPortadaUrl = portada ? await uploadImage(portada) : null;

            // Subir imágenes de la galería
            const uploadedGaleriaUrls = await Promise.all(
                imagenes.map(async (file) => (file ? await uploadImage(file) : null))
            );

            // Guardar los URLs en los estados correspondientes
            setLogoUrl(uploadedLogoUrl);
            setPortadaUrl(uploadedPortadaUrl);
            setGaleriaUrls(uploadedGaleriaUrls);

            const usuario = JSON.parse(localStorage.getItem("usuario"))
            const usuarioId = usuario._id

            const formData = {
                usuarioId,
                nombre,
                descripcion,
                provincia,
                categoria,
                descuento,
                ubicacion,
                telefono,
                celular,
                ig,
                fb,
                web,
                video_youtube,
                tags,
                portada: uploadedPortadaUrl,
                logo: uploadedLogoUrl,
                fotos: uploadedGaleriaUrls,
            };

            // Realizar el fetch POST a la API
            const response = await fetch('/api/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Convertir los datos a JSON
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    text: "Producto creado con exito!",
                });
                router.back()
            } else {
                Swal.fire({
                    icon: "warning",
                    text: "Hubo un error al crear el producto.",
                });
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error("Error subiendo imágenes:", error);
        }
    };

    // Funciones para mostrar la previsualización
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setLogo(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handlePortadaChange = (e) => {
        const file = e.target.files[0];
        setPortada(file);
        setPortadaPreview(URL.createObjectURL(file));
    };

    // Función para manejar la selección de imágenes
    const handleImagesChange = (e) => {
        const nuevasImagenes = Array.from(e.target.files);
        setImagenes((prevImagenes) => [...prevImagenes, ...nuevasImagenes]);

        // Crear URLs para las nuevas imágenes seleccionadas
        const nuevasPreviews = nuevasImagenes.map((imagen) => URL.createObjectURL(imagen));
        setPreviews((prevPreviews) => [...prevPreviews, ...nuevasPreviews]);
    };

    // Función para eliminar una imagen del array
    const handleRemoveImage = (index) => {
        setImagenes((prevImagenes) => prevImagenes.filter((_, i) => i !== index));
        setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };

    function getYouTubeVideoID(url) {
        let videoID = '';

        // Si la URL es del tipo 'https://www.youtube.com/watch?v=VIDEO_ID'
        if (url.includes('youtube.com')) {
            const urlParams = new URL(url).searchParams;
            videoID = urlParams.get('v');
        }

        // Si la URL es del tipo 'https://youtu.be/VIDEO_ID'
        else if (url.includes('youtu.be')) {
            videoID = url.split('/').pop().split('?')[0]; // Obtiene el video ID
        }

        return videoID;
    }

    const categorias = ["Hotel", "Gastronomia", "Area Comercial", "Atraccion Turistica", "Museo", "Turismo", "Promocion"]
    const provincias = ["Santiago del Estero", "Tucuman", "Catamarca", "Salta", "Jujuy", "Cordoba", "Buenos Aires"]
    const descuentos = ["10%", "15%", "20%", "25%", "30%", "35%", "40%"]

    return (
        <>
            <Navbar />
            <Separador texto={"Agregar comercio"} />
            <div className="container mx-auto max-w-6xl">
                <form className='mt-5 p-3 lg:p-0' onSubmit={handleForm}>
                    <div className="grid grid-cols-12 gap-5 mb-4">
                        <div className="grid gap-6 col-span-12 lg:col-span-6">
                            <Input
                                type="text"
                                className='w-full'
                                label="Nombre"
                                onChange={(e) => {

                                    setErrores(errores.filter(item => item !== "nombre"));
                                    setNombre(e.target.value)
                                }
                                }
                                isInvalid={errores.includes("nombre") ? true : false}
                                errorMessage="Ingresa el nombre"
                            />
                            <div className="w-full h-[300px] mb-10">
                                <h1 className='mb-5'>Ubicacion:</h1>
                            <LeafletMap setUbi={setUbicacion} />
                            </div>
                            <Input
                                type="number"
                                className='w-full'
                                label="Telefono"
                                onChange={(e) => setTelefono(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-5 col-span-12 lg:col-span-6">
                            <Select
                                label="Descuento"
                                className="w-full"
                                onChange={(e) => {

                                    setErrores(errores.filter(item => item !== "descuento"));
                                    setDescuento(e.target.value)
                                }
                                }
                                isInvalid={errores.includes("descuento") ? true : false}
                                errorMessage="Selecciona el descuento"
                            >
                                {descuentos.map((desc) => (
                                    <SelectItem key={desc}>
                                        {desc}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select
                                label="Categoria"
                                className="w-full"
                                onChange={(e) => {

                                    setErrores(errores.filter(item => item !== "categoria"));
                                    setCategoria(e.target.value)
                                }
                                }
                                isInvalid={errores.includes("categoria") ? true : false}
                                errorMessage="Selecciona la categoria"
                            >
                                {categorias.map((cat) => (
                                    <SelectItem key={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select
                                label="Provincia"
                                className="w-full"
                                onChange={(e) => {

                                    setErrores(errores.filter(item => item !== "provincia"));
                                    setProvincia(e.target.value)
                                }
                                }
                                isInvalid={errores.includes("provincia") ? true : false}
                                errorMessage="Selecciona la provincia"
                            >
                                {provincias.map((prov) => (
                                    <SelectItem key={prov}>
                                        {prov}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <Input
                                type="number"
                                className='w-full'
                                label="Celular"
                                onChange={(e) => {

                                    setErrores(errores.filter(item => item !== "celular"));
                                    setCelular(e.target.value)
                                }
                                }
                                isInvalid={errores.includes("celular") ? true : false}
                                errorMessage="El celular es requerido"
                                description="Ingresá el código de área sin 0 y el número de línea sin 15"
                            />
                        </div>

                        <div className="col-span-12 lg:col-span-6">
                            <div className="flex">
                                <Input
                                    type="text"
                                    className="flex-grow"
                                    label="Tags"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    description="Palabras clave que ayudan en la busqueda de tu producto. Ej: restaurante, anteojo, patio, etc"
                                />
                                <button
                                    type="button"
                                    className="ml-2 px-4 py-2 bg-blue-500 text-white font-bold rounded-md"
                                    onClick={handleAddTag}
                                >
                                    +
                                </button>
                            </div>
                            <div className="mt-2">
                                {tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 mr-2 mb-2 bg-gray-200 rounded-full"
                                    >
                                        <span>#{tag}</span>
                                        <button
                                            type="button"
                                            className="ml-2 text-red-500"
                                            onClick={() => handleRemoveTag(index)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-4">
                            <Input
                                type="text"
                                label="Instagram"
                                onChange={(e) => setIg(e.target.value)}
                                placeholder="instagram.com/tunegocio"
                                labelPlacement="outside"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">Link:</span>
                                    </div>
                                }
                            />
                        </div>
                        <div className="col-span-4">
                            <Input
                                type="text"
                                label="Facebook"
                                onChange={(e) => setFb(e.target.value)}
                                placeholder="facebook.com/tunegocio"
                                labelPlacement="outside"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">Link:</span>
                                    </div>
                                }
                            />
                        </div>
                        <div className="col-span-4">
                            <Input
                                type="text"
                                label="Pagina web"
                                onChange={(e) => setWeb(e.target.value)}
                                placeholder="tupagina.com"
                                labelPlacement="outside"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">Link:</span>
                                    </div>
                                }
                            />
                        </div>
                        <div className="col-span-4 flex ">
                            <Input
                                type="text"
                                label="Video youtube"
                                onChange={(e) => { setVideoYoutube(getYouTubeVideoID(e.target.value)); }}
                                placeholder=""
                                labelPlacement="outside"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">Link:</span>
                                    </div>
                                }
                            />
                        </div>
                        <div className="col-span-12 mb-16">
                            <label>Descripcion</label>
                            <ReactQuill theme="snow" className='h-full' type="text" value={descripcion} onChange={setDescripcion} />
                        </div>
                        <div className="col-span-12 md:col-span-6"
                            onClick={() => document.querySelector(".input-logo").click()}>
                            <label className='mb-5 text-xl'>Logo:</label>
                            <div className="flex justify-center p-2 mt-3 flex-col border-2 border-dashed border-gray-400">
                                <input className='input-logo' type="file" onChange={handleLogoChange} hidden />
                                {logoPreview && <img src={logoPreview} alt="Vista previa de la portada" className="mt-2 h-48 w-100 object-contain" />}
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-6"
                            onClick={() => document.querySelector(".input").click()}>
                            <label className='mb-5 text-xl'>Foto de portada:</label>
                            <div className="flex justify-center p-2 mt-3 flex-col border-2 border-dashed border-gray-400">
                                <input className='input' type="file" onChange={handlePortadaChange} hidden />
                                {portadaPreview && <img src={portadaPreview} alt="Vista previa de la portada" className="mt-2 h-48 w-100 object-contain" />}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 mb-4">
                        <h1 className='col-span-12 mt-5 text-xl'>Galeria de imagenes</h1>
                        <div className="col-span-12">
                            <input
                                type="file"
                                multiple
                                onChange={handleImagesChange}
                                className="hidden"
                                id="file-input-galeria"
                            />
                            <label htmlFor="file-input-galeria" className="cursor-pointer block text-center border-2 border-dashed border-gray-400 p-5">
                                <p>Haga clic para seleccionar varias imágenes</p>
                            </label>
                        </div>
                        {previews.map((preview, index) => (
                            <div key={index} className="relative col-span-3 h-44">
                                <img src={preview} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 m-3 bg-red-500 text-white py-2 px-3 rounded-sm"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className='text-xs text-gray-400 my-5'>
                        Los datos personales suministrados podrán ser utilizados con la finalidad de mantenerme actualizado e informado sobre promociones, campañas publicitarias, productos y servicios. Se deja expresamente aclarado que, en cualquier momento podés solicitar el retiro o bloqueo de tu nombre de nuestra base de datos. Para más información visitá los términos y condiciones de nuestra plataforma. Los beneficios y/o descuentos no son combinables ni acumulables con otras promociones, beneficios y/o descuentos. Para más información sobre beneficios, condiciones, locales adheridos y el reglamento de suscripción entrar a www.clubcyt.com
                    </p>
                    <button
                        type="submit"
                        className='w-full border-0 p-3 mb-5 rounded-md bg-indigo-400 text-white font-semibold'
                    >
                        {
                            loading ?
                                <Spinner color='default' size='sm' /> : "CREAR COMERCIO"
                        }
                    </button>
                </form>
            </div>
        </>
    );
}

export default Page;
