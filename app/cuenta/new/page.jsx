"use client"

import Navbar from '@/components/Navbar'
import Separador from '@/components/Separador'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { Spinner } from '@nextui-org/spinner';
import Bathroom from '@/public/hotel/bathroom.svg'
import Bed from '@/public/hotel/bed.svg'
import Chat from '@/public/hotel/chat.svg'
import Lock from '@/public/hotel/lock.svg'
import Parking from '@/public/hotel/parking.svg'
import Services from '@/public/hotel/services.svg'
import Tv from '@/public/hotel/tv.svg'
import Warning from '@/public/hotel/warning.svg'
import Wifi from '@/public/hotel/wifi.svg'
import Bienestar from '@/public/hotel/bienestar.svg'
import Cleaner from '@/public/hotel/cleaner.svg'
import Food from '@/public/hotel/food.svg'


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

    const [services, setServices] = useState({
        baño: {
            papelHigienico: false,
            toallas: false,
            sabanans: false,
            bañoPrivado: false,
            ducha: false,
            secadorDePelo: false,
            articulosDeAseo: false,
        },
        internet: {
            wifi: false,
        },
        general: {
            prohibidoFumar: false,
            calefaccion: false,
            ascensor: false,
            insonorizacion: false,
            habitacionInsonorizadas: false,
        },
        aparcamiento: {
            parking: false,
            parkingEnUnGaraje: false,
        },
        habitacion: {
            ropaDeCama: false,
            armario: false,
            enchufeCercaDeLaCama: false,
            perchero: false,
            wifi: false,
        },
        equipamiento: {
            tv: false,
            canalesPorCable: false,
            canalesViaSatelite: false,
            telefono: false,
            canalesDePago: false,
        },
        seguridad: {
            extiontores: false,
            cámarasDeSeguridad: false,
            detectoresDeHumo: false,
            seguridad24Horas: false,
            tarjetaDeAcceso: false,
            alarmaDeSeguridad: false,
        },
        idiomas: {
            ingles: false,
            español: false,
            frances: false,
            portugues: false,
            italiano: false,
        },
        servicios: {
            recepcion24Horas: false,
            informacionTuristica: false,
            servicioDeTraslado: false,
            guardaEquipaje: false,
        },
        limpieza: {
            servicioDeLimpiezaDiario: false,
            servicioDeLavanderia: false,
            planchaParaPantalones: false,
        },
        bienestar: {
            gimnasio: false,
            spa: false,
            piscinaAlAireLibre: false
        },
        comidaYBebida: {
            bar: false,
            restaurante: false,
        },
    });

    const handleCheckboxChange = (category, service) => {
        setServices(prevServices => ({
            ...prevServices,
            [category]: {
                ...prevServices[category],
                [service]: !prevServices[category][service],
            },
        }));
    };

    const formatServiceName = (service) => {
        return service.replace(/([A-Z])/g, ' $1') // Agregar espacio antes de mayúsculas
            .replace(/^./, str => str.toUpperCase()); // Capitalizar la primera letra
    };

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
                activado: false
                // condicion si cateogira es hotel colocar los servicios aqui 
            };

            if (categoria === "Hotel") {
                formData.services = services; // Agrega los servicios al objeto
                formData.activado = true; // Agrega los servicios al objeto
            }

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
                            {/* <div className="w-full h-[300px] mb-10">
                                <h1 className='mb-5'>Ubicacion:</h1>
                            <LeafletMap setUbi={setUbicacion} />
                            </div> */}
                            <Input
                                type="text"
                                className='w-full'
                                label="Ubicacion"
                                onChange={(e) => setUbicacion(e.target.value)}
                            />
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
                        <div className="col-span-12 text-gray-700 mb-10">
                            {categoria == "Hotel" ?
                                <>
                                    <h2 className='mb-5 text-xl'>Servicios del Hotel</h2>
                                    <div className='grid grid-cols-3 gap-4'>

                                        {/* BAÑO */}
                                        <div className="col-span-3 md:col-span-1">
                                            <div className='flex gap-2 items-center'>
                                                <Bathroom className="h-5 w-5" />
                                                <h3 className='font-medium text-lg'>Baño</h3>
                                            </div>
                                            <div className='flex flex-col mt-2 gap-2'>
                                                {Object.keys(services.baño).map(service => (
                                                    <label key={service}>
                                                        <input
                                                            type="checkbox"
                                                            className='me-2'
                                                            checked={services.baño[service]}
                                                            onChange={() => handleCheckboxChange('baño', service)}
                                                        />
                                                        {formatServiceName(service)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {/* HABITACION */}
                                        <div className="col-span-3 md:col-span-1">
                                            <div className='flex gap-2 items-center'>
                                                <Bed className="h-5 w-5" />
                                                <h3 className='font-medium text-lg'>Habitacion</h3>
                                            </div>
                                            <div className='flex flex-col mt-2 gap-2'>
                                                {Object.keys(services.habitacion).map(service => (
                                                    <label key={service}>
                                                        <input
                                                            type="checkbox"
                                                            className='me-2'
                                                            checked={services.habitacion[service]}
                                                            onChange={() => handleCheckboxChange('habitacion', service)}
                                                        />
                                                        {formatServiceName(service)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {/* EQUIPAMIENTO */}
                                        <div className="col-span-3 md:col-span-1">
                                            <div className='flex gap-2 items-center'>
                                                <Tv className="h-5 w-5" />
                                                <h3 className='font-medium text-lg'>Equipamiento</h3>
                                            </div>
                                            <div className='flex flex-col mt-2 gap-2'>
                                                {Object.keys(services.equipamiento).map(service => (
                                                    <label key={service}>
                                                        <input
                                                            type="checkbox"
                                                            className='me-2'
                                                            checked={services.equipamiento[service]}
                                                            onChange={() => handleCheckboxChange('equipamiento', service)}
                                                        />
                                                        {formatServiceName(service)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {/* SEGURIDAD */}
                                        <div className="col-span-3 md:col-span-1">
                                            <div className='flex gap-2 items-center'>
                                                <Lock className="h-5 w-5" />
                                                <h3 className='font-medium text-lg'>Seguridad</h3>
                                            </div>
                                            <div className='flex flex-col mt-2 gap-2'>
                                                {Object.keys(services.seguridad).map(service => (
                                                    <label key={service}>
                                                        <input
                                                            type="checkbox"
                                                            className='me-2'
                                                            checked={services.seguridad[service]}
                                                            onChange={() => handleCheckboxChange('seguridad', service)}
                                                        />
                                                        {formatServiceName(service)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {/* GENERAL */}
                                        <div className="col-span-3 md:col-span-1">
                                            <div className='flex gap-2 items-center'>
                                                <Warning className="h-5 w-5" />
                                                <h3 className='font-medium text-lg'>General</h3>
                                            </div>
                                            <div className='flex flex-col mt-2 gap-2'>
                                                {Object.keys(services.general).map(service => (
                                                    <label key={service}>
                                                        <input
                                                            type="checkbox"
                                                            className='me-2'
                                                            checked={services.general[service]}
                                                            onChange={() => handleCheckboxChange('general', service)}
                                                        />
                                                        {formatServiceName(service)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                         {/* SERVICIOS */}
                                         <div className="col-span-3 md:col-span-1">
                                            <div className='flex gap-2 items-center'>
                                                <Services className="h-5 w-5" />
                                                <h3 className='font-medium text-lg'>Servicios</h3>
                                            </div>
                                            <div className='flex flex-col mt-2 gap-2'>
                                                {Object.keys(services.servicios).map(service => (
                                                    <label key={service}>
                                                        <input
                                                            type="checkbox"
                                                            className='me-2'
                                                            checked={services.servicios[service]}
                                                            onChange={() => handleCheckboxChange('servicios', service)}
                                                        />
                                                        {formatServiceName(service)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {/* LIMPIEZA */}
                                        <div className="col-span-3 md:col-span-1">
                                            <div className='flex gap-2 items-center'>
                                                <Cleaner className="h-5 w-5" />
                                                <h3 className='font-medium text-lg'>Limpieza</h3>
                                            </div>
                                            <div className='flex flex-col mt-2 gap-2'>
                                                {Object.keys(services.limpieza).map(service => (
                                                    <label key={service}>
                                                        <input
                                                            type="checkbox"
                                                            className='me-2'
                                                            checked={services.limpieza[service]}
                                                            onChange={() => handleCheckboxChange('limpieza', service)}
                                                        />
                                                        {formatServiceName(service)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {/* IDIOMAS */}
                                        <div className="col-span-3 md:col-span-1">
                                            <div className='flex gap-2 items-center'>
                                                <Chat className="h-5 w-5" />
                                                <h3 className='font-medium text-lg'>Idiomas</h3>
                                            </div>
                                            <div className='flex flex-col mt-2 gap-2'>
                                                {Object.keys(services.idiomas).map(service => (
                                                    <label key={service}>
                                                        <input
                                                            type="checkbox"
                                                            className='me-2'
                                                            checked={services.idiomas[service]}
                                                            onChange={() => handleCheckboxChange('idiomas', service)}
                                                        />
                                                        {formatServiceName(service)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {/* COMIDA */}
                                        <div className="col-span-3 md:col-span-1">
                                            <div className='flex gap-2 items-center'>
                                                <Food className="h-5 w-5" />
                                                <h3 className='font-medium text-lg'>Comida y Bebida</h3>
                                            </div>
                                            <div className='flex flex-col mt-2 gap-2'>
                                                {Object.keys(services.comidaYBebida).map(service => (
                                                    <label key={service}>
                                                        <input
                                                            type="checkbox"
                                                            className='me-2'
                                                            checked={services.comidaYBebida[service]}
                                                            onChange={() => handleCheckboxChange('comidaYBebida', service)}
                                                        />
                                                        {formatServiceName(service)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {/* BIENESTAR */}
                                        <div className="col-span-3 md:col-span-1">
                                            <div className='flex gap-2 items-center'>
                                                <Bienestar className="h-5 w-5" />
                                                <h3 className='font-medium text-lg'>Bienestar</h3>
                                            </div>
                                            <div className='flex flex-col mt-2 gap-2'>
                                                {Object.keys(services.bienestar).map(service => (
                                                    <label key={service}>
                                                        <input
                                                            type="checkbox"
                                                            className='me-2'
                                                            checked={services.bienestar[service]}
                                                            onChange={() => handleCheckboxChange('bienestar', service)}
                                                        />
                                                        {formatServiceName(service)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {/* APARCAMIENTO */}
                                        <div className="col-span-3 md:col-span-1">
                                            <div className='flex gap-2 items-center'>
                                                <Parking className="h-5 w-5" />
                                                <h3 className='font-medium text-lg'>Aparcamiento</h3>
                                            </div>
                                            <div className='flex flex-col mt-2 gap-2'>
                                                {Object.keys(services.aparcamiento).map(service => (
                                                    <label key={service}>
                                                        <input
                                                            type="checkbox"
                                                            className='me-2'
                                                            checked={services.aparcamiento[service]}
                                                            onChange={() => handleCheckboxChange('aparcamiento', service)}
                                                        />
                                                        {formatServiceName(service)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {/* INTERNET */}
                                        <div className="col-span-3 md:col-span-1">
                                            <div className='flex gap-2 items-center'>
                                                <Wifi className="h-5 w-5" />
                                                <h3 className='font-medium text-lg'>Internet</h3>
                                            </div>
                                            <div className='flex flex-col mt-2 gap-2'>
                                                {Object.keys(services.internet).map(service => (
                                                    <label key={service}>
                                                        <input
                                                            type="checkbox"
                                                            className='me-2'
                                                            checked={services.internet[service]}
                                                            onChange={() => handleCheckboxChange('internet', service)}
                                                        />
                                                        {formatServiceName(service)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                ""}
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
