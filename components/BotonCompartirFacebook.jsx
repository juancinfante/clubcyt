'use client';
import Fb from '@/public/assets/facebook.svg'

export default function BotonCompartirFacebook({ url }) {
    const handleClick = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

        window.open(
            facebookUrl,
            'Compartir en Facebook',
            'width=600,height=400,scrollbars=no,toolbar=no,menubar=no'
        );
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center"
        >
            <Fb className="w-6 h-6" />
        </button>
    );
}
