'use client';

// ============================================
// PÁGINA PRINCIPAL - ArtMap Resistencia
// Aplicación de relevamiento de arte urbano
// Equipo JGJ - Modelo COPROMAR
// ============================================

import { useState, useCallback } from 'react';
import { HeaderNavegacion, type SeccionActiva } from '@/components/artmap/header-navegacion';
import { Relevamiento } from '@/components/artmap/relevamiento';
import { Catalogo } from '@/components/artmap/catalogo';
import { Votacion } from '@/components/artmap/votacion';
import type { Obra, DatosRelevamiento, DatosValidacionVoto } from '@/lib/tipos';
import { obrasDemostracion } from '@/lib/datos-demo';

export default function PaginaPrincipal() {
  const [seccionActiva, setSeccionActiva] = useState<SeccionActiva>('catalogo');
  const [obraSeleccionada, setObraSeleccionada] = useState<Obra | null>(null);

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
   * Maneja el guardado de un relevamiento
   */
  const manejarGuardarRelevamiento = useCallback((datos: DatosRelevamiento) => {
    console.log('[v0] Relevamiento guardado:', datos);
    // Aquí iría la lógica para enviar al backend
  }, []);

  /**
   * Maneja un voto exitoso
   */
  const manejarVoto = useCallback((obra: Obra, datosValidacion: DatosValidacionVoto) => {
    console.log('[v0] Voto registrado:', { obra: obra.titulo, datosValidacion });
    // Aquí iría la lógica para enviar al backend
  }, []);

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
              obras={obrasDemostracion}
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
              />
            </div>
          );
        }
        // Si no hay obra seleccionada, mostrar mensaje
        return (
          <div className="p-4 flex items-center justify-center min-h-[60vh]">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-4">Seleccioná una obra del catálogo para votar</p>
              <button
                onClick={() => setSeccionActiva('catalogo')}
                className="text-secondary underline hover:no-underline"
              >
                Ir al catálogo
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
            icono="📍"
            label="Relevar"
          />
          <NavBotonMovil
            activo={seccionActiva === 'catalogo'}
            onClick={() => setSeccionActiva('catalogo')}
            icono="🎨"
            label="Catálogo"
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
            icono="❤️"
            label="Votar"
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
  label 
}: { 
  activo: boolean; 
  onClick: () => void; 
  icono: string; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 transition-colors ${
        activo 
          ? 'text-secondary' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <span className="text-xl">{icono}</span>
      <span className={`text-xs font-medium ${activo ? 'text-secondary' : ''}`}>
        {label}
      </span>
      {activo && (
        <span className="absolute bottom-1 h-1 w-8 rounded-full bg-secondary" />
      )}
    </button>
  );
}
