"use client"

import "leaflet/dist/leaflet.css";
import style from "../../styles/Home.module.css";
import L from "leaflet";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import { useCallback, useMemo, useRef, useState } from "react";

const customIcon = new L.Icon({
  iconUrl: "https://www.svgrepo.com/show/231101/placeholder-pin.svg", // Ruta a la imagen del icono
  iconSize: [38, 38], // Tamaño del icono en píxeles
  iconAnchor: [19, 38], // Punto del icono que se coloca en la posición del marcador
  popupAnchor: [0, -38], // Posición del popup relativo al marcador
});

const center = {
  lat: -27.7833,
  lng: -64.2667,
}
function Map({ setUbi , ubicacion }) {
  const [draggable, setDraggable] = useState(false)
  const [position, setPosition] = useState(
    ubicacion ? [ubicacion.lat, ubicacion.lng] : center
  );

  const markerRef = useRef(null)
  const markerPosition = position;
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const newPosition = {
            lat: marker.getLatLng().lat,  // Obtener la latitud
            lng: marker.getLatLng().lng,  // Obtener la longitud
          };
          setPosition(newPosition)
          setUbi(newPosition);  // Actualiza el estado con el nuevo objeto
          console.log(newPosition);
        }
      },
    }),
    [],
  )
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d)
  }, [])

  return (
    <MapContainer
      className={style.map}
      center={markerPosition}
      zoom={16}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution="bullseye map"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        draggable={draggable}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
        icon={customIcon}>
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {draggable
              ? 'Ahora puedes mover el marcador!'
              : 'Haz click en este texto para poder mover el marcador!'}
          </span>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;