"use client"
import Navbar from '@/components/Navbar'
import Separador from '@/components/Separador'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Spinner } from '@nextui-org/spinner';
import Swal from 'sweetalert2'
import LeafletMap from "@/components/MapEdit";


// Importa ReactQuill dinámicamente
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Asegúrate de incluir los estilos de Quill


const page = ({ params }) => {

    const [nombre, setNombre] = useState("")
    const [categoria, setCategoria] = useState("")
    const [provincia, setProvincia] = useState("")
    const [ubicacion, setUbicacion] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [descuento, setDescuento] = useState("")
    const [telefono, setTelefono] = useState("")
    const [celular, setCelular] = useState("")
    const [ig, setIg] = useState("")
    const [fb, setFb] = useState("")
    const [wp, setWp] = useState("")
    const [web, setWeb] = useState("")
    const [video_youtube, setVideoYoutube] = useState("")
    const [logo, setLogo] = useState(null)
    const [portada, setPortada] = useState(null)
    const [galeria, setGaleria] = useState([]) // Tres imágenes para la galería
    const [logoPreview, setLogoPreview] = useState("")
    const [portadaPreview, setPortadaPreview] = useState("")
    const [galeriaPreviews, setGaleriaPreviews] = useState([]);
    const [loading, setLoading] = useState(false)

    // Estado para los tags
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    const router = useRouter()

    const fetchProd = async () => {
        try {
            const res = await fetch(`/api/productos/${params.id}`)
            const data = await res.json()

            setNombre(data.nombre)
            setCategoria(data.categoria)
            setProvincia(data.provincia)
            setUbicacion(data.ubicacion)
            setDescripcion(data.descripcion)
            setDescuento(data.descuento)
            setIg(data.ig)
            setWp(data.wp)
            setFb(data.fb)
            setWeb(data.web)
            setTags(data.tags)
            setVideoYoutube(data.video_youtube)
            setCelular(data.celular)
            setTelefono(data.telefono)
            setLogoPreview(data.logo)
            setPortadaPreview(data.portada)
            setGaleriaPreviews(data.fotos)

        } catch (error) {
            console.log(error)
        }
    }

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

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return; // Si no hay un archivo, no hacer nada
        setLogo(file); // Actualizar el estado solo si hay un archivo
        setLogoPreview(URL.createObjectURL(file));
    };

    const handlePortadaChange = (e) => {
        const file = e.target.files[0];
        if (!file) return; // Si no hay un archivo, no hacer nada
        setPortada(file); // Actualizar el estado solo si hay un archivo
        setPortadaPreview(URL.createObjectURL(file));
    };

    // Función para manejar el cambio de las imágenes de la galería
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setGaleriaPreviews((prev) => [...prev, ...newPreviews]);
        setGaleria((prev) => [...prev, ...files]); // Guardar archivos para subir a Cloudinary
    };

    // Función para eliminar una imagen del array
    const handleRemoveImage = (index) => {
        setGaleriaPreviews((prev) => prev.filter((_, i) => i !== index));
        setGaleria((prev) => prev.filter((_, i) => i !== index)); // Asegurarse de eliminar también del arreglo de archivos
    };


    // Función para subir imágenes a Cloudinary
    const uploadImage = async (image) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "albums"); // Configurado en Cloudinary

        const response = await fetch(`https://api.cloudinary.com/v1_1/dwjhbrsmf/image/upload`, {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        return data.secure_url; // URL de la imagen subida
    };

    // Manejo del formulario
    const handleForm = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Solo subir imágenes nuevas
        let logoUrl = logoPreview;
        let portadaUrl = portadaPreview;
        let galeriaUrls = [...galeriaPreviews];

        if (logo) {
            logoUrl = await uploadImage(logo);
        }
        if (portada) {
            portadaUrl = await uploadImage(portada);
        }

        // Subir las nuevas imágenes de la galería si hay
        const nuevasGaleriaUrls = await Promise.all(
            galeria.map(async (file, index) => {
                const cloudinaryUrl = await uploadImage(file);

                // Reemplazar el blob URL por la URL de Cloudinary en galeriaPreviews
                setGaleriaPreviews((prev) => {
                    const newPreviews = [...prev];
                    // Reemplazamos el blob con la URL retornada de Cloudinary
                    newPreviews[prev.indexOf(URL.createObjectURL(file))] = cloudinaryUrl;
                    return newPreviews;
                });

                return cloudinaryUrl; // Devolver la URL de Cloudinary
            })
        );

        // Combinar las imágenes anteriores con las nuevas (reemplazadas correctamente)
        galeriaUrls = [...galeriaUrls.filter(url => !url.startsWith('blob:')), ...nuevasGaleriaUrls];

        // Preparar datos para la actualización del producto
        const updatedProduct = {
            nombre,
            categoria,
            provincia,
            ubicacion,
            telefono,
            celular,
            ig,
            wp,
            fb,
            web,
            video_youtube,
            descripcion,
            descuento,
            tags,
            logo: logoUrl,
            portada: portadaUrl,
            fotos: galeriaUrls,
        };

        // Actualizar el producto en la base de datos
        try {
            const res = await fetch(`/api/productos/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });
            const data = await res.json();
            Swal.fire({
                icon: "success",
                text: "Producto actualizado!",
            });
            router.back()
        } catch (error) {
            console.log('Error al actualizar el producto:', error);
            Swal.fire({
                icon: "warning",
                text: "Error al actualizar el producto.",
            });
        }

        setLoading(false);
    };

    const categorias = [
        { key: "hotel", label: "Hotel" },
        { key: "gastronomia", label: "Gastronomia" },
        { key: "area comercial", label: "Area Comercial" },
        { key: "atraccion turistica", label: "Atraccion Turistica" },
    ];

    const provincias = [
        { key: "santiago del estero", label: "Santiago del Estero" },
        { key: "tucuman", label: "Tucuman" },
        { key: "catamarca", label: "Catamarca" },
        { key: "salta", label: "Salta" },
        { key: "jujuy", label: "Jujuy" },
        { key: "cordoba", label: "Cordoba" },
        { key: "buenos aires", label: "Buenos Aires" }
    ];

    const descuentos = [
        { key: "10%", label: "10%" },
        { key: "15%", label: "15%" },
        { key: "20%", label: "20%" },
        { key: "25%", label: "25%" },
        { key: "30%", label: "30%" },
        { key: "35%", label: "35%" },
        { key: "40%", label: "40%" }
    ];

    function capitalize(str) {
        if (!str) return ''; // Verificar que la cadena no esté vacía
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    useEffect(() => {
        fetchProd()
    }, [])
    return (
        <>
            <Navbar />
            <Separador texto={"Editar producto"} />
            <div className="container mx-auto max-w-6xl">
                <form className='mt-5 p-3 lg:p-0' onSubmit={handleForm}>
                    <div className="grid grid-cols-12 gap-5 mb-4">
                        <div className="grid gap-6 col-span-12 lg:col-span-6">
                            <Input
                                type="text"
                                className='w-full'
                                label="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                            <div className="w-full h-[300px] mb-8">
                                <h1>Selecciona tu ubicacion en el mapa:</h1>
                                <LeafletMap setUbi={setUbicacion} ubicacion={ubicacion}/>
                            </div>
                            <Input
                                type="number"
                                className='w-full'
                                label="Telefono"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-5 col-span-12 lg:col-span-6">
                            {categoria && (
                                <Select
                                    label="Categoria"
                                    defaultSelectedKeys={[categoria.toLocaleLowerCase()]}
                                    className="w-full"
                                    onChange={(e) => setCategoria(capitalize(e.target.value))}
                                >
                                    {categorias.map((categoria) => (
                                        <SelectItem key={categoria.key}>
                                            {categoria.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                            {provincia && (
                                <Select
                                    label="Provincia"
                                    defaultSelectedKeys={[provincia.toLocaleLowerCase()]}
                                    onChange={(e) => setProvincia(capitalize(e.target.value))}
                                    className="w-full"
                                >
                                    {provincias.map((provincia) => (
                                        <SelectItem key={provincia.key}>
                                            {provincia.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                            {descuento && (
                                <Select
                                    label="Descuento"
                                    defaultSelectedKeys={[descuento]}
                                    className="w-full"
                                    onChange={(e) => setDescuento(e.target.value)}
                                >
                                    {descuentos.map((desc) => (
                                        <SelectItem key={desc.key}>
                                            {desc.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <Input
                                type="number"
                                className='w-full'
                                label="Celular"
                                value={celular}
                                onChange={(e) => setCelular(e.target.value)}
                                description="Ingresá el código de área sin 0 y el número de línea sin 15"
                            />
                        </div>
                        {/* Input para los tags */}
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
                        <div className="col-span-12 md:col-span-3">
                            <Input
                                type="text"
                                label="Instagram"
                                onChange={(e) => setIg(e.target.value)}
                                value={ig}
                                placeholder="instagram.com/tunegocio"
                                labelPlacement="outside"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">Link:</span>
                                    </div>
                                }
                            />
                        </div>
                        <div className="col-span-12 md:col-span-3">
                            <Input
                                type="text"
                                label="Facebook"
                                onChange={(e) => setFb(e.target.value)}
                                value={fb}
                                placeholder="facebook.com/tunegocio"
                                labelPlacement="outside"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">Link:</span>
                                    </div>
                                }
                            />
                        </div>
                        <div className="col-span-12 md:col-span-3">
                            <Input
                                type="text"
                                label="Whatsapp"
                                onChange={(e) => setWp(e.target.value)}
                                value={wp}
                                placeholder="link a tu numero"
                                labelPlacement="outside"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">Link:</span>
                                    </div>
                                }
                            />
                        </div>
                        <div className="col-span-12 md:col-span-3">
                            <Input
                                type="text"
                                label="Pagina web"
                                onChange={(e) => setWeb(e.target.value)}
                                value={web}
                                placeholder="tupagina.com"
                                labelPlacement="outside"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">Link:</span>
                                    </div>
                                }
                            />
                        </div>
                        <div className="col-span-12 md:col-span-3">
                            <Input
                                type="text"
                                label="Video youtube"
                                onChange={(e) => setVideoYoutube(e.target.value)}
                                value={video_youtube}
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
                            <label className='mb-5 font-semibold text-xl'>Logo:</label>
                            <div className="flex justify-center p-2 mt-3 flex-col border-2 border-dashed border-black">
                                <input className='input-logo' type="file" onChange={handleLogoChange} hidden />
                                {logoPreview && <img src={logoPreview} alt="Vista previa de la portada" className="mt-2 h-48 w-100 object-contain" />}
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-6"
                            onClick={() => document.querySelector(".input").click()}>
                            <label className='mb-5 font-semibold text-xl'>Foto de portada:</label>
                            <div className="flex justify-center p-2 mt-3 flex-col border-2 border-dashed border-black">
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
                        {galeriaPreviews.map((preview, index) => (
                            <div key={index} className="relative col-span-6 md:col-span-4 lg:col-span-3 h-44">
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
                    <button
                        type="submit"
                        className='w-full border-0 p-3 mb-5 rounded-md bg-indigo-400 text-white font-semibold'
                    >
                        {
                            loading ?
                                <Spinner color='default' size='sm' /> : "Guardar"
                        }
                    </button>
                </form>
            </div>
        </>
    )
}

export default page