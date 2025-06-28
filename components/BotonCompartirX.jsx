'use client';
import Xlogo from '@/public/assets/x-logo.svg'

export default function BotonCompartirX({ url, texto = '' }) {
  const handleClick = () => {
    // URL para compartir en Twitter/X
    const twitterUrl = `https://x.com/intent/post?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`;

    window.open(
      twitterUrl,
      'Compartir en X',
      'width=600,height=400,scrollbars=no,toolbar=no,menubar=no'
    );
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center"
      aria-label="Compartir en X"
    >
      <Xlogo />
    </button>
  );
}
