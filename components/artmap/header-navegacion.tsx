'use client';

// ============================================
// COMPONENTE HEADER NAVEGACIÓN - ArtMap Resistencia
// Barra de navegación principal Mobile-First
// Equipo JGJ - Modelo COPROMAR
// ============================================

import { Palette, MapPin, Grid3X3, Heart, Menu, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export type SeccionActiva = 'relevamiento' | 'catalogo' | 'votacion' | 'leaderboard';

interface HeaderNavegacionProps {
  seccionActiva: SeccionActiva;
  alCambiarSeccion: (seccion: SeccionActiva) => void;
}

const SECCIONES = [
  { id: 'relevamiento' as const, label: 'Relevamiento', icono: MapPin },
  { id: 'catalogo' as const, label: 'Catálogo', icono: Grid3X3 },
  { id: 'votacion' as const, label: 'Votación', icono: Heart },
];

export function HeaderNavegacion({ seccionActiva, alCambiarSeccion }: HeaderNavegacionProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const manejarCambioSeccion = (seccion: SeccionActiva) => {
    alCambiarSeccion(seccion);
    setMenuAbierto(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-primary text-primary-foreground">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
            <Palette className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-tight">ArtMap</span>
            <span className="text-[10px] text-primary-foreground/70 leading-tight">Resistencia</span>
          </div>
        </div>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {SECCIONES.map(({ id, label, icono: Icono }) => (
            <Button
              key={id}
              variant={seccionActiva === id ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => alCambiarSeccion(id)}
              className={`gap-2 ${
                seccionActiva === id 
                  ? 'text-secondary-foreground' 
                  : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
              }`}
            >
              <Icono className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </nav>

        {/* Badge equipo */}
        <div className="hidden md:flex items-center">
          <span className="text-xs bg-secondary/20 px-2 py-1 rounded-full">
            Equipo JGJ
          </span>
        </div>

        {/* Menú Mobile */}
        <Sheet open={menuAbierto} onOpenChange={setMenuAbierto}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-primary text-primary-foreground border-secondary/20">
            <div className="flex flex-col h-full">
              {/* Header del sheet */}
              <div className="flex items-center gap-3 mb-8 pt-2">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Palette className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="font-bold">ArtMap Resistencia</h2>
                  <p className="text-xs text-primary-foreground/70">Equipo JGJ - COPROMAR</p>
                </div>
              </div>

              {/* Navegación */}
              <nav className="flex flex-col gap-2">
                {SECCIONES.map(({ id, label, icono: Icono }) => (
                  <Button
                    key={id}
                    variant={seccionActiva === id ? 'secondary' : 'ghost'}
                    onClick={() => manejarCambioSeccion(id)}
                    className={`justify-start gap-3 h-12 ${
                      seccionActiva === id 
                        ? 'text-secondary-foreground' 
                        : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
                    }`}
                  >
                    <Icono className="h-5 w-5" />
                    {label}
                  </Button>
                ))}
              </nav>

              {/* Footer del sheet */}
              <div className="mt-auto pb-4">
                <div className="p-4 rounded-lg bg-secondary/20 text-sm">
                  <p className="font-medium mb-1">Modelo COPROMAR</p>
                  <p className="text-xs text-primary-foreground/70">
                    Validación incremental de relevamiento de arte urbano
                  </p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
