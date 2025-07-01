'use client';
import Wp from '@/public/assets/whatsapp.svg'

export default function BotonCompartirWhatsApp({ url }) {
  const handleClick = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;

    window.open(
      whatsappUrl,
      'Compartir en WhatsApp',
      'width=600,height=400,scrollbars=no,toolbar=no,menubar=no,noopener,noreferrer'
    );
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center"
    >
      <Wp />
    </button>
  );
}
