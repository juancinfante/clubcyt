"use client"

import "leaflet/dist/leaflet.css";
import style from "../../styles/Home.module.css";
import L from "leaflet";

const customIcon = new L.Icon({
    iconUrl: "https://www.svgrepo.com/show/231101/placeholder-pin.svg", // Ruta a la imagen del icono
    iconSize: [38, 38], // Tamaño del icono en píxeles
    iconAnchor: [19, 38], // Punto del icono que se coloca en la posición del marcador
    popupAnchor: [0, -38], // Posición del popup relativo al marcador
  });

import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";

function Map({position}) {
  const { lat, lng } = position;
  return (
    <MapContainer
      className={style.map}
      center={[lat, lng]}
      zoom={16}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution="bullseye map"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
        <Marker position={[lat, lng]} icon={customIcon}>
      <Popup>
        Estoy aqui!
      </Popup>
    </Marker>
    </MapContainer>
  );
}

export default Map;