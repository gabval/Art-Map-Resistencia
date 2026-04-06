'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { Obra } from '@/lib/tipos';
import Image from 'next/image';

interface MapaCatalogoProps {
  obras: Obra[];
  alSeleccionarObra?: (obra: Obra) => void;
}

export default function MapaCatalogo({ obras, alSeleccionarObra }: MapaCatalogoProps) {
  // Centro por defecto: Resistencia, Chaco
  const centroBase: [number, number] = [-27.4513, -58.9867];
  
  // Calcular el centro según las obras
  const calcularCentro = (): [number, number] => {
    if (obras.length === 0) return centroBase;
    
    // Si hay obras, centrar en el promedio de coordenadas
    let sumLat = 0;
    let sumLon = 0;
    obras.forEach(obra => {
      sumLat += obra.coordenadas.latitud;
      sumLon += obra.coordenadas.longitud;
    });
    
    return [sumLat / obras.length, sumLon / obras.length];
  };

  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[600px] rounded-lg overflow-hidden border border-border">
      <MapContainer 
        center={calcularCentro()} 
        zoom={obras.length > 0 ? 14 : 12} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {obras.map(obra => (
          <Marker 
            key={obra.id} 
            position={[obra.coordenadas.latitud, obra.coordenadas.longitud]}
          >
            <Popup>
              <div className="w-48">
                <div className="relative aspect-video w-full mb-2 overflow-hidden rounded-sm">
                  <Image
                    src={obra.imagenUrl || '/placeholder.svg?height=100&width=200'}
                    alt={obra.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-sm line-clamp-1">{obra.titulo}</h3>
                <p className="text-xs text-muted-foreground mb-2">{obra.autor}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => alSeleccionarObra?.(obra)}
                    className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded w-full hover:bg-primary/90 transition-colors"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
