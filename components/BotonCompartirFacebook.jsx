'use client';
import Fb from '@/public/assets/facebook.svg'


export default function BotonCompartirFacebook({ url }) {
  return (
    <button
      onClick={() =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
          'noopener,noreferrer'
        )
      }
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      <Fb className="w-8 h-8" />
      Compartir
    </button>
  );
}