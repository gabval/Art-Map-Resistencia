'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { Coordenadas } from '@/lib/tipos';

interface MapaRelevamientoProps {
  coordenadas: Coordenadas;
  alCambiarCoordenadas: (coords: Coordenadas) => void;
}

// Componente para capturar clicks en el mapa
function ClickHandler({ alClick }: { alClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      alClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Componente para centrar el mapa cuando cambian las props
function CenterMap({ coords }: { coords: Coordenadas }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (coords.latitud !== 0 && coords.longitud !== 0) {
      map.flyTo([coords.latitud, coords.longitud], map.getZoom(), {
        animate: true,
        duration: 1.5
      });
    }
  }, [coords, map]);
  return null;
}

export default function MapaRelevamiento({ coordenadas, alCambiarCoordenadas }: MapaRelevamientoProps) {
  // Centro inicial: Resistencia o coordenadas recibidas si son válidas
  const centroInicial: [number, number] = (coordenadas.latitud !== 0 || coordenadas.longitud !== 0)
    ? [coordenadas.latitud, coordenadas.longitud]
    : [-27.4513, -58.9867];

  const handleMapClick = (lat: number, lng: number) => {
    alCambiarCoordenadas({ latitud: lat, longitud: lng });
  };

  return (
    <div className="w-full h-full min-h-[300px] rounded-lg overflow-hidden border border-border">
      <MapContainer 
        center={centroInicial} 
        zoom={15} 
        style={{ height: '300px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ClickHandler alClick={handleMapClick} />
        <CenterMap coords={coordenadas} />
        
        {coordenadas.latitud !== 0 && coordenadas.longitud !== 0 && (
          <Marker position={[coordenadas.latitud, coordenadas.longitud]} />
        )}
      </MapContainer>
    </div>
  );
}
