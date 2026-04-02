'use client';

// ============================================
// COMPONENTE TARJETA OBRA - ArtMap Resistencia
// Card individual para mostrar obras
// Equipo JGJ - Modelo COPROMAR
// ============================================

import Image from 'next/image';
import { MapPin, User, Calendar, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Obra } from '@/lib/tipos';
import { etiquetasCategorias, etiquetasMateriales } from '@/lib/datos-demo';

interface TarjetaObraProps {
  obra: Obra;
  alSeleccionar?: (obra: Obra) => void;
}

export function TarjetaObra({ obra, alSeleccionar }: TarjetaObraProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-border/50"
      onClick={() => alSeleccionar?.(obra)}
    >
      {/* Imagen de la obra */}
      <div className="relative aspect-[4/3] bg-muted">
        <Image
          src={obra.imagenUrl}
          alt={obra.titulo}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Badge de estado */}
        <Badge 
          className={`absolute top-2 right-2 ${
            obra.estado === 'optimo' 
              ? 'bg-success text-success-foreground' 
              : 'bg-warning text-warning-foreground'
          }`}
        >
          {obra.estado === 'optimo' ? 'Óptimo' : 'Deteriorado'}
        </Badge>

        {/* Categoría */}
        <Badge 
          variant="secondary"
          className="absolute top-2 left-2 bg-primary/90 text-primary-foreground"
        >
          {etiquetasCategorias[obra.categoria]}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Título */}
        <h3 className="font-semibold text-foreground text-base leading-tight line-clamp-2">
          {obra.titulo}
        </h3>

        {/* Autor y año */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4 shrink-0" />
          <span className="truncate">{obra.autor}</span>
          <span className="text-border">•</span>
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{obra.anio}</span>
        </div>

        {/* Ubicación */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-secondary" />
          <span className="line-clamp-1">{obra.direccion}</span>
        </div>

        {/* Material y votos */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <Badge variant="outline" className="text-xs">
            {etiquetasMateriales[obra.material]}
          </Badge>
          
          <div className="flex items-center gap-1.5 text-sm text-secondary">
            <Heart className="h-4 w-4 fill-current" />
            <span className="font-medium">{obra.cantidadVotos}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
