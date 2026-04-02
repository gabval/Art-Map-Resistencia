'use client';

// ============================================
// PÁGINA PRINCIPAL - ArtMap Resistencia
// Aplicación de relevamiento de arte urbano
// Equipo JGJ - Modelo COPROMAR
// ============================================

import { useState, useCallback } from 'react';
import { MapPin, Grid3X3, Heart, ClipboardList } from 'lucide-react';
import { HeaderNavegacion, type SeccionActiva } from '@/components/artmap/header-navegacion';
import { Relevamiento } from '@/components/artmap/relevamiento';
import { Catalogo } from '@/components/artmap/catalogo';
import { Votacion } from '@/components/artmap/votacion';
import type { Obra, DatosRelevamiento, DatosValidacionVoto } from '@/lib/tipos';
import { obrasDemostracion } from '@/lib/datos-demo';

export default function PaginaPrincipal() {
  const [seccionActiva, setSeccionActiva] = useState<SeccionActiva>('catalogo');
  const [obraSeleccionada, setObraSeleccionada] = useState<Obra | null>(null);
  const [obras, setObras] = useState<Obra[]>(obrasDemostracion);
  const [obrasVotadas, setObrasVotadas] = useState<Set<string>>(new Set());

  /**
   * Maneja la selección de una obra desde el catálogo
   */
  const manejarSeleccionObra = useCallback((obra: Obra) => {
    setObraSeleccionada(obra);
    setSeccionActiva('votacion');
  }, []);

  /**
   * Maneja el volver al catálogo desde votación
   */
  const manejarVolverCatalogo = useCallback(() => {
    setObraSeleccionada(null);
    setSeccionActiva('catalogo');
  }, []);

  /**
   * Maneja el guardado de un relevamiento - agrega la obra al catálogo
   */
  const manejarGuardarRelevamiento = useCallback((datos: DatosRelevamiento) => {
    const nuevaObra: Obra = {
      id: `nueva-${Date.now()}`,
      titulo: datos.titulo,
      autor: datos.autor,
      anio: datos.anio,
      descripcion: datos.observaciones || 'Obra relevada recientemente',
      categoria: datos.categoria,
      material: datos.material,
      coordenadas: datos.coordenadas,
      direccion: `Lat: ${datos.coordenadas.latitud.toFixed(4)}, Lon: ${datos.coordenadas.longitud.toFixed(4)}`,
      imagenUrl: datos.imagenUrl || '/obras/pensador-chaco.jpg',
      estado: datos.estado,
      cantidadVotos: 0,
    };

    setObras(obrasActuales => [nuevaObra, ...obrasActuales]);
  }, []);

  /**
   * Maneja un voto exitoso - incrementa el contador de votos
   */
  const manejarVoto = useCallback((obra: Obra, datosValidacion: DatosValidacionVoto) => {
    // Incrementar votos de la obra
    setObras(obrasActuales => 
      obrasActuales.map(o => 
        o.id === obra.id 
          ? { ...o, cantidadVotos: o.cantidadVotos + 1 }
          : o
      )
    );

    // Marcar la obra como votada
    setObrasVotadas(votadas => new Set([...votadas, obra.id]));

    // Actualizar la obra seleccionada si es la misma
    if (obraSeleccionada?.id === obra.id) {
      setObraSeleccionada(prev => 
        prev ? { ...prev, cantidadVotos: prev.cantidadVotos + 1 } : null
      );
    }
  }, [obraSeleccionada]);

  /**
   * Renderiza el contenido según la sección activa
   */
  const renderizarContenido = () => {
    switch (seccionActiva) {
      case 'relevamiento':
        return (
          <div className="p-4">
            <Relevamiento alGuardar={manejarGuardarRelevamiento} />
          </div>
        );

      case 'catalogo':
        return (
          <div className="p-4">
            <Catalogo 
              obras={obras}
              alSeleccionarObra={manejarSeleccionObra}
            />
          </div>
        );

      case 'votacion':
        if (obraSeleccionada) {
          return (
            <div className="p-4">
              <Votacion 
                obra={obraSeleccionada}
                alVolver={manejarVolverCatalogo}
                alVotar={manejarVoto}
                yaVotada={obrasVotadas.has(obraSeleccionada.id)}
              />
            </div>
          );
        }
        // Si no hay obra seleccionada, mostrar mensaje
        return (
          <div className="p-4 flex items-center justify-center min-h-[60vh]">
            <div className="text-center text-muted-foreground">
              <Heart className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg mb-4">Selecciona una obra del catalogo para votar</p>
              <button
                onClick={() => setSeccionActiva('catalogo')}
                className="text-secondary underline hover:no-underline"
              >
                Ir al catalogo
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavegacion 
        seccionActiva={seccionActiva}
        alCambiarSeccion={setSeccionActiva}
      />
      
      <main className="pb-20">
        {renderizarContenido()}
      </main>

      {/* Navegación inferior mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border/40 safe-area-inset-bottom">
        <div className="grid grid-cols-3 h-16">
          <NavBotonMovil
            activo={seccionActiva === 'relevamiento'}
            onClick={() => setSeccionActiva('relevamiento')}
            icono={<ClipboardList className="h-5 w-5" />}
            label="Relevar"
          />
          <NavBotonMovil
            activo={seccionActiva === 'catalogo'}
            onClick={() => setSeccionActiva('catalogo')}
            icono={<Grid3X3 className="h-5 w-5" />}
            label="Catalogo"
          />
          <NavBotonMovil
            activo={seccionActiva === 'votacion'}
            onClick={() => {
              if (!obraSeleccionada) {
                setSeccionActiva('catalogo');
              } else {
                setSeccionActiva('votacion');
              }
            }}
            icono={<Heart className="h-5 w-5" />}
            label="Votar"
            badge={obrasVotadas.size > 0 ? obrasVotadas.size : undefined}
          />
        </div>
      </nav>
    </div>
  );
}

/**
 * Botón de navegación inferior para mobile
 */
function NavBotonMovil({ 
  activo, 
  onClick, 
  icono, 
  label,
  badge
}: { 
  activo: boolean; 
  onClick: () => void; 
  icono: React.ReactNode; 
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
        activo 
          ? 'text-secondary' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <span className="relative">
        {icono}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-2 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-1">
            {badge}
          </span>
        )}
      </span>
      <span className={`text-xs font-medium ${activo ? 'text-secondary' : ''}`}>
        {label}
      </span>
      {activo && (
        <span className="absolute bottom-1 h-1 w-8 rounded-full bg-secondary" />
      )}
    </button>
  );
}
