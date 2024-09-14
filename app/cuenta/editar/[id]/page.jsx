"use client"
import Navbar from '@/components/Navbar'
import Separador from '@/components/Separador'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = ({ params }) =>{

    const [nombre, setNombre] = useState("")
    const [categoria, setCategoria] = useState("")
    const [provincia, setProvincia] = useState("")
    const [ubicacion, setUbicacion] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [descuento, setDescuento] = useState("")
    const [logo, setLogo] = useState(null)
    const [portada, setPortada] = useState(null)
    const [galeria, setGaleria] = useState([null, null, null]) // Tres imágenes para la galería
    const [logoPreview, setLogoPreview] = useState("")
    const [portadaPreview, setPortadaPreview] = useState("")
    const [galeriaPreviews, setGaleriaPreviews] = useState([]);
    const [loading, setLoading] = useState(false)

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
            setLogoPreview(data.logo)
            setPortadaPreview(data.portada)
            setGaleriaPreviews(data.fotos)

            console.log(data)
        } catch (error) {
            console.log(error)            
        }
    }
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
    
    const handleGaleriaChange = (e, index) => {
        const file = e.target.files[0];
        if (!file) return; // Si no hay un archivo, no hacer nada
    
        const updatedGaleria = [...galeria];
        updatedGaleria[index] = file; // Solo cambiar la imagen seleccionada
        setGaleria(updatedGaleria);
    
        const updatedPreviews = [...galeriaPreviews];
        updatedPreviews[index] = URL.createObjectURL(file);
        setGaleriaPreviews(updatedPreviews);
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
        for (let i = 0; i < galeria.length; i++) {
            if (galeria[i]) {
                galeriaUrls[i] = await uploadImage(galeria[i]); // Solo subir la imagen que cambió
            }
        }
    
        // Preparar datos para la actualización del producto
        const updatedProduct = {
            nombre,
            categoria,
            provincia,
            ubicacion,
            descripcion,
            descuento,
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
            alert("Producto actualizado!")
            router.back()
        } catch (error) {
            console.log('Error al actualizar el producto:', error);
        }
    
        setLoading(false);
    };
    

    useEffect(() => {
        fetchProd()
    },[])
    return (
    <>
        <Navbar />
        <Separador texto={"Editar producto"}/>
        <div className="container mx-auto max-w-6xl">
                <form className='mt-5 p-3 lg:p-0' onSubmit={handleForm}>
                    <div className="grid grid-cols-12 gap-5 mb-4">
                        <div className="col-span-12 md:col-span-6 flex flex-col">
                            <label className='mb-2 font-semibold text-xl'>Nombre</label>
                            <input
                                value={nombre}
                                type="text"
                                className='col-span-6 border border-slate-300 text-sm p-2'
                                placeholder='Nombre'
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6 flex flex-col">
                            <label className='mb-2 font-semibold text-xl'>Categoria</label>
                            <select
                                className='col-span-6 border p-2 rounded outline-none'
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                            >
                               <option value="" disabled>Selecciona</option>
                                <option value="Hotel">Hotel</option>
                                <option value="Gastronomia">Gastronomia</option>
                                <option value="Area Comercial">Area Comercial</option>
                                <option value="Atraccion Turistica">Atraccion Turistica</option>
                            </select>
                        </div>
                        <div className="col-span-12 md:col-span-6 flex flex-col">
                            <label className='mb-2 font-semibold text-xl'>Provincia</label>
                            <select
                                className='col-span-6 border p-2 rounded outline-none'
                                value={provincia}
                                onChange={(e) => setProvincia(e.target.value)}
                            >
                                <option value="" disabled>Selecciona</option>
                                <option value="Santiago del Estero">Santiago del Estero</option>
                                <option value="Tucuman">Tucuman</option>
                                <option value="Salta">Salta</option>
                                <option value="Jujuy">Jujuy</option>
                            </select>
                        </div>
                        <div className="col-span-12 md:col-span-6 flex flex-col">
                            <label className='mb-2 font-semibold text-xl'>Descuento</label>
                            <select
                                className='col-span-6 border p-2 rounded outline-none'
                                value={descuento}
                                onChange={(e) => setDescuento(e.target.value)}
                            >
                                <option value="" disabled>Selecciona</option>
                                <option value="10%">10%</option>
                                <option value="15%">15%</option>
                                <option value="25%">25%</option>
                                <option value="40%">40%</option>
                                <option value="50%">50%</option>
                            </select>
                        </div>
                        <div className="col-span-12 md:col-span-6 flex flex-col">
                            <label className='mb-2 font-semibold text-xl'>Ubicacion</label>
                            <input
                                type="text"
                                value={ubicacion}
                                className='col-span-6 border p-2 rounded outline-none'
                                placeholder='Ubicacion'
                                onChange={(e) => setUbicacion(e.target.value)}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6 flex flex-col">
                            <label className='mb-2 font-semibold text-xl'>Descripcion</label>
                            <textarea
                                value={descripcion}
                                type="text"
                                className='col-span-6 border p-2 rounded outline-none'
                                placeholder='Descripcion'
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
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
                        <h1 className='col-span-12 mt-5 font-semibold text-xl'>Galeria de imagenes (max 4)</h1>
                        {[0, 1, 2, 3].map((index) => (
                            <div key={index} className="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col">
                                <div className="flex justify-center p-3 h-48 border-2 border-dashed border-black"
                                    onClick={() => document.querySelector(`.input-${index}`).click()}>
                                    <input className={`input-${index}`} type="file" onChange={(e) => handleGaleriaChange(e, index)} hidden />
                                    {galeriaPreviews[index] && <img src={galeriaPreviews[index]} alt={`Vista previa ${index + 1}`} className="mt-2  h-100 w-100 object-cover" />}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className='w-full border-0 p-3 mb-5 rounded-md bg-indigo-400 text-white font-semibold'
                    >
                        {
                            loading ?
                                    "Cargando..." : "Guardar"
                        }
                    </button>
                </form>
            </div>
    </>
  )
}

export default page