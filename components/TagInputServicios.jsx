import { useState } from "react";

// Mapa de servicios con íconos
const serviceIcons = {
  // Baño
  "Papel Higiénico": "/hotel/banio_green.svg",
  Toallas: "/hotel/banio_green.svg",
  Sábanas: "/hotel/banio_green.svg",
  "Baño Privado": "/hotel/banio_green.svg",
  Ducha: "/hotel/banio_green.svg",
  "Secador de Pelo": "/hotel/banio_green.svg",
  "Artículos de Aseo": "/hotel/banio_green.svg",
  "Bañera": "/hotel/banio_green.svg",

  // General
  "Prohibido Fumar": "/hotel/smoking_green.svg",
  Calefacción: "/hotel/warm_green.svg",
  Ascensor: "/hotel/elevator_green.svg",
  Insonorización: "/hotel/soundproof_green.svg",
  "Habitación Insonorizada": "/hotel/soundproof_green.svg",
  "Aire Acondicionado": "/hotel/air-conditioning_green.svg",

  // Aparcamiento
  Parking: "/hotel/parking_green.svg",
  "Parking en un Garaje": "/hotel/parking_green.svg",

  // Habitación
  "Ropa de Cama": "/hotel/bed_green.svg",
  Armario: "/hotel/bed_green.svg",
  "Enchufe Cerca de la Cama": "/hotel/bed_green.svg",
  Perchero: "/hotel/bed_green.svg",
  Wifi: "/hotel/wifi_green.svg",

  // Equipamiento
  TV: "/hotel/tv.svg",
  "Canales por Cable": "/hotel/equipamiento.svg",
  "Canales Vía Satélite": "/hotel/equipamiento.svg",
  Teléfono: "/hotel/equipamiento.svg",
  "Canales de Pago": "/hotel/equipamiento.svg",

  // Seguridad
  Extintores: "/hotel/extintores.svg",
  "Cámaras de Seguridad": "/hotel/security-camera_green.svg",
  "Detectores de Humo": "/hotel/smoke.svg",
  "Seguridad 24 Horas": "/hotel/lock_green.svg",
  "Tarjeta de Acceso": "/hotel/lock_green.svg",
  "Alarma de Seguridad": "/hotel/lock_green.svg",

  // Idiomas
  Inglés: "/hotel/chats_green.svg",
  Español: "/hotel/chats_green.svg",
  Francés: "/hotel/chats_green.svg",
  Portugués: "/hotel/chats_green.svg",
  Italiano: "/hotel/chats_green.svg",

  // Servicios
  "Recepción 24 Horas": "/hotel/room-service_green.svg",
  "Información Turística": "/hotel/room-service_green.svg",
  "Servicio de Traslado": "/hotel/room-service_green.svg",
  "Guarda Equipaje": "/hotel/room-service_green.svg",
  "Servicio de Habitaciones": "/hotel/room-service_green.svg",

  // Limpieza
  "Servicio de Limpieza Diario": "/hotel/cleaner_green.svg",
  "Servicio de Lavandería": "/hotel/cleaner_green.svg",
  "Plancha para Pantalones": "/hotel/cleaner_green.svg",

  // Bienestar
  Gym: "/hotel/gym_green.svg",
  Spa: "/hotel/spa_green.svg",
  "Piscina al Aire Libre": "/hotel/swimming.svg",
  "Sauna": "/hotel/sauna.svg",

  // Comida y Bebida
  Bar: "/hotel/drink-.svg",
  Restaurante: "/hotel/restaurant.svg",
  "Mini Bar": "/hotel/restaurant.svg",
   

  // Internet
  Wifi: "/hotel/wifi_green.svg"
};

// Componente de selección de servicios
const TagInputServicios = ({ availableServices, setSelectedPopulares, selectedPopulares }) => {

  // Función para agregar un servicio seleccionado desde el select
  const handleAddService = (e) => {
    const service = e.target.value;
    if (service && !selectedPopulares.some((s) => s.service === service)) {
      // Agregar servicio con su ícono correspondiente al estado
      setSelectedPopulares([...selectedPopulares, { service, icon: serviceIcons[service] }]);
    }
  };

  // Función para eliminar un servicio seleccionado
  const handleRemoveService = (service) => {
    setSelectedPopulares(selectedPopulares.filter((s) => s.service !== service));
  };

  return (
    <div className="tag-input-container">
      <select
        onChange={handleAddService}
        className="border p-2 rounded-md w-full mb-5"
        defaultValue=""
      >
        <option value="" disabled>
          Selecciona un servicio...
        </option>
        {availableServices.map((service) => (
          <option key={service} value={service}>
            {service}
          </option>
        ))}
      </select>
      <div className="selected-services flex gap-2 flex-wrap mb-2">
        {selectedPopulares.map(({ service, icon }) => (
          <div
            key={service}
            className="tag flex items-center gap-1 bg-white border py-2 px-3 rounded-full"
          >
            {/* Mostrar ícono del servicio */}
            <img src={icon} alt={service} width={20} height={20} />
            {service}
            <button
              type="button"
              className="remove-tag text-red-500 ml-2"
              onClick={() => handleRemoveService(service)}
            >
              x
            </button>
          </div>
        ))}
      </div>

      
    </div>
  );
};

// Componente principal con lista de servicios disponibles
const InputServiciosPopulares = ({ setSelectedPopulares, selectedPopulares }) => {
  const availableServices = [
    "Papel Higiénico", "Toallas", "Sábanas", "Baño Privado", "Ducha", "Secador de Pelo", 
    "Artículos de Aseo","Bañera", "Prohibido Fumar", "Calefacción", "Ascensor", "Insonorización", 
    "Habitación Insonorizada", "Parking", "Parking en un Garaje", "Ropa de Cama", "Armario", 
    "Enchufe Cerca de la Cama", "Perchero", "Wifi","Mini Bar","Sauna", "TV", "Canales por Cable", "Canales Vía Satélite", 
    "Teléfono", "Canales de Pago", "Extintores", "Cámaras de Seguridad", "Detectores de Humo", 
    "Seguridad 24 Horas", "Tarjeta de Acceso", "Alarma de Seguridad", "Inglés", "Español", "Francés", 
    "Portugués", "Italiano", "Recepción 24 Horas", "Información Turística", "Servicio de Traslado", "Servicio de Habitaciones",
    "Guarda Equipaje", "Servicio de Limpieza Diario", "Servicio de Lavandería", 
    "Plancha para Pantalones", "Gym", "Spa", "Piscina al Aire Libre", "Bar", "Restaurante", "Aire Acondicionado"
  ];

  return (
    <div className="mt-5">
      <h2 className="mb-5 text-xl font-semibold">Selecciona los servicios más populares</h2>
      <TagInputServicios 
        availableServices={availableServices} 
        setSelectedPopulares={setSelectedPopulares} 
        selectedPopulares={selectedPopulares} 
      />
    </div>
  );
};

export default InputServiciosPopulares;
