import Navbar from '@/components/Navbar'
import Image from 'next/image'

const page = () => {
    return (
        <>
            <div className='container mx-auto'>
                <Navbar />
            </div>
            <div className='w-full h-screen relative'>
                <img className='w-full h-full object-cover'
                    src="https://img.freepik.com/free-photo/medium-shot-happy-people-partying-with-confetti_23-2149128383.jpg?t=st=1728327692~exp=1728331292~hmac=bf8f80251958fa3c32cc5117a60e5109457532b7ff57dfb21ce5dd80dcd7d4c8&w=996" alt="" />
                <div className="absolute top-60 transform -translate-y-1/2 ps-32">
                    <div className='bg-gray-50 text-gray-800 flex flex-col justify-start p-5'>
                        <h1 className='font-bold  text-5xl w-[650px]'>Suscribite y disfruta al maximo los beneficios que club cyt tiene para ofrecerte.</h1>
                        <p></p>
                        <div className="flex mt-4 gap-3">
                            <a href="" className='bg-yellow-400 px-2 py-1 rounded-sm text-lg text-gray-800'>SUSCRIBITE</a>
                            <a href="" className='border-1 border-black px-2 py-1 rounded-sm text-lg text-gray-800'>QUIENES SOMOS</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page