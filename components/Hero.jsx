import Image from 'next/image'
import hero from '../public/assets/hero.png'
import Link from 'next/link'

const Hero = () => {
    return (
        <div className="hero py-9">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-12 items-center justify-between">
                    <div className="col-span-12 md:col-span-6 mt-5 mb-6">
                        <h1 className='text-5xl font-bold mb-8'>Bienvenidos al club de cultura y turismo de la región</h1>
                        <p className='text-md text-slate-500 mb-8'>Explora con nosotros experiencias culturales y turísticas únicas en la región. Descubre tradiciones, lugares y actividades inolvidables</p>
                        <Link href='/productos' className='bg-indigo-500 px-9 py-2 text-center rounded-full text-white'>Explorar productos</Link>
                    </div>
                    <div className="col-span-12 md:col-span-6 flex justify-end">
                    <Image src={hero} width={500} alt='hero' className=''/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero