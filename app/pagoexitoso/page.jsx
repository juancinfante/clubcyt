"use client";

import { useEffect, useState } from "react";

import QRCode from 'qrcode';
import qrcontainer from '@/public/assets/qrcontainer.jpeg';
import Image from 'next/image';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import Link from "next/link";

const QrCodeGenerator = () => {
    const [qrCode, setQrCode] = useState('');
    const [usuario, setUsuario] = useState(null);
    const router = useRouter(); // Para manejar la redirección

    const fetchUsuario = async (idUsuario) => {
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
    }
    useEffect(() => {
        if (localStorage.getItem('usuario') == null) {
            router.push('/login')
        } else {
            const { _id } = JSON.parse(localStorage.getItem('usuario'));
            fetchUsuario(_id)
        }
    }, []);

    // // Este useEffect genera el QR una vez que se haya cargado el usuario
    useEffect(() => {
        const generateQrCode = async () => {
            try {
                if (usuario && usuario.suscripto == false) {
                    // Genera el QR con el ID del usuario
                    const qrCodeData = await QRCode.toDataURL(`https://clubcyt.vercel.app/user/${usuario._id}`);
                    setQrCode(qrCodeData);
                    const qrCodeUrl = await uploadQrCode(qrCodeData); // Subir a Cloudinary después de generar
                    console.log('URL del QR Code en Cloudinary:', qrCodeUrl);
                    // Actualizar el usuario después de subir el QR Code
                    await updateUser(usuario._id, qrCodeUrl);
                } else {
                    if (usuario) {
                        setQrCode(usuario.qrcode)
                    }
                }
            } catch (err) {
                console.error('Error generating QR code:', err);
            }
        };

        generateQrCode();
    }, [usuario]); // Se vuelve a ejecutar cuando el usuario cambia

    const uploadQrCode = async (qrCodeData) => {
        try {
            // Convertir base64 a Blob
            const blob = await (await fetch(qrCodeData)).blob();
            const url = await uploadImage(blob); // Utiliza tu función para subir la imagen
            return url; // Retorna la URL de la imagen subida
        } catch (error) {
            console.error('Error uploading QR code to Cloudinary:', error);
            return null; // Maneja el error según sea necesario
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
        console.log(data)
        return data.secure_url; // Retorna el URL seguro de la imagen
    };

    // Función para actualizar el usuario
    const updateUser = async (userId, qrcode_url) => {
        try {
            const res = await fetch(`/api/usuarios/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    suscripto: true,
                    qrcode: qrcode_url
                }),
            });
            const data = await res.json();
            console.log(data);

            // // Actualizar localStorage
            // if (data) {
            //     const updatedUsuario = { ...usuario, suscripto: true }; // Actualiza el objeto usuario
            //     localStorage.setItem('usuario', JSON.stringify(updatedUsuario)); // Guarda el usuario actualizado en localStorage
            //     setUsuario(updatedUsuario); // Actualiza el estado local también
            // }
        } catch (error) {
            console.log('Error al actualizar el usuario:', error);
        }
    };


    return (
        <>
            <div className="container mx-auto flex justify-center mt-10">
                {
                    usuario && usuario.suscripto ?
                        " "
                        :
                        <h1>Bienvenido a club Cyt!</h1>

                }
            </div>
            <div className="container mx-auto flex justify-center mt-10">
                <div className="relative">
                    <Image
                        src={qrcontainer}
                        width={300}
                        height={500}
                        alt="QR Container"
                        className="rounded-lg" // Clase para el borde redondeado
                        priority
                    />
                    {/* Nombre del usuario encima del código QR */}
                    {usuario ? 
                    <h3 className="absolute top-32 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-900">
                        {usuario.nombre} {usuario.apellido}
                    </h3> 
                    :
                    ""}
                    <img
                        src={qrCode ? qrCode : ""}
                        alt="Generated QR Code"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px]" // Tamaño ajustado

                    />

                    <p className="absolute bottom-28 bg-yellow-200 py-1 px-2 rounded-lg left-1/2 transform -translate-x-1/2 text-black text-lg">
                        Usuario Activo
                    </p>
                </div>
            </div>
            <div className="container mx-auto flex justify-center mt-10">
                <button className='bg-indigo-500 px-2 py-2 rounded-lg text-white'>
                    <Link href="/">
                        Explorar comercios
                    </Link>
                </button>
            </div>
        </>
    );
};

export default QrCodeGenerator;
