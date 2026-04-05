'use client';

// ============================================
// COMPONENTE LEADERBOARD - ArtMap Resistencia
// Tabla de clasificación de obras más votadas
// Equipo JGJ - Modelo COPROMAR
// ============================================

import { useMemo } from 'react';
import Image from 'next/image';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Heart,
  MapPin,
  User,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Obra } from '@/lib/tipos';

interface LeaderboardProps {
  obras: Obra[];
  alSeleccionarObra?: (obra: Obra) => void;
}

/**
 * Iconos de podio según posición
 */
function IconoPosicion({ posicion }: { posicion: number }) {
  switch (posicion) {
    case 1:
      return (
        <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
          <Trophy className="h-5 w-5 text-white" />
        </div>
      );
    case 2:
      return (
        <div className="h-10 w-10 rounded-full bg-slate-400 flex items-center justify-center shadow-md">
          <Medal className="h-5 w-5 text-white" />
        </div>
      );
    case 3:
      return (
        <div className="h-10 w-10 rounded-full bg-amber-700 flex items-center justify-center shadow-md">
          <Award className="h-5 w-5 text-white" />
        </div>
      );
    default:
      return (
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
          <span className="font-bold text-muted-foreground">{posicion}</span>
        </div>
      );
  }
}

/**
 * Componente principal de Leaderboard
 */
export function Leaderboard({ obras, alSeleccionarObra }: LeaderboardProps) {
  // Ordenar obras por cantidad de votos (descendente)
  const obrasOrdenadas = useMemo(() => {
    return [...obras].sort((a, b) => b.cantidadVotos - a.cantidadVotos);
  }, [obras]);

  // Calcular total de votos para porcentajes
  const totalVotos = useMemo(() => {
    return obras.reduce((sum, obra) => sum + obra.cantidadVotos, 0);
  }, [obras]);

  // Top 3 para el podio
  const podio = obrasOrdenadas.slice(0, 3);
  
  // Resto para la lista
  const resto = obrasOrdenadas.slice(3, 10);

  // Estadísticas generales
  const estadisticas = useMemo(() => {
    const obraConMasVotos = obrasOrdenadas[0];
    const promedioVotos = totalVotos / obras.length || 0;
    const obrasConVotos = obras.filter(o => o.cantidadVotos > 0).length;
    
    return {
      totalObras: obras.length,
      totalVotos,
      obraLider: obraConMasVotos?.titulo || '-',
      promedioVotos: Math.round(promedioVotos),
      obrasConVotos,
      participacion: Math.round((obrasConVotos / obras.length) * 100) || 0
    };
  }, [obras, obrasOrdenadas, totalVotos]);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
          <Trophy className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Ranking de Votaciones</h2>
          <p className="text-sm text-muted-foreground">Las obras mas populares de Resistencia</p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Heart className="h-4 w-4" />
              <span className="text-xs">Total Votos</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{estadisticas.totalVotos}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Promedio</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{estadisticas.promedioVotos}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Award className="h-4 w-4" />
              <span className="text-xs">Obras Votadas</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{estadisticas.obrasConVotos}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Medal className="h-4 w-4" />
              <span className="text-xs">Participacion</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{estadisticas.participacion}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Podio - Top 3 */}
      {podio.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-border/50 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Podio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {podio.map((obra, index) => {
                const porcentaje = totalVotos > 0 
                  ? Math.round((obra.cantidadVotos / totalVotos) * 100) 
                  : 0;
                
                return (
                  <button
                    key={obra.id}
                    onClick={() => alSeleccionarObra?.(obra)}
                    className={`relative rounded-xl p-4 text-left transition-all hover:scale-[1.02] ${
                      index === 0 
                        ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-2 border-amber-500/30' 
                        : index === 1 
                        ? 'bg-gradient-to-br from-slate-400/20 to-slate-500/10 border border-slate-400/30'
                        : 'bg-gradient-to-br from-amber-700/20 to-amber-800/10 border border-amber-700/30'
                    }`}
                  >
                    {/* Medalla de posición */}
                    <div className="absolute -top-2 -right-2">
                      <IconoPosicion posicion={index + 1} />
                    </div>

                    {/* Imagen */}
                    <div className="relative h-32 w-full mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={obra.imagenUrl}
                        alt={obra.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <h3 className="font-semibold text-foreground line-clamp-1 mb-1 pr-8">
                      {obra.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                      <User className="h-3 w-3" />
                      {obra.autor}
                    </p>

                    {/* Votos y barra */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-secondary font-medium">
                          <Heart className="h-4 w-4 fill-secondary" />
                          {obra.cantidadVotos} votos
                        </span>
                        <span className="text-muted-foreground">{porcentaje}%</span>
                      </div>
                      <Progress value={porcentaje} className="h-2" />
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista del resto */}
      {resto.length > 0 && (
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ranking Completo</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {resto.map((obra, index) => {
                const posicion = index + 4;
                const porcentaje = totalVotos > 0 
                  ? Math.round((obra.cantidadVotos / totalVotos) * 100) 
                  : 0;

                return (
                  <button
                    key={obra.id}
                    onClick={() => alSeleccionarObra?.(obra)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                  >
                    {/* Posición */}
                    <IconoPosicion posicion={posicion} />

                    {/* Imagen mini */}
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={obra.imagenUrl}
                        alt={obra.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground line-clamp-1">{obra.titulo}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {obra.autor}
                      </p>
                    </div>

                    {/* Votos */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-secondary flex items-center gap-1 justify-end">
                        <Heart className="h-4 w-4 fill-secondary" />
                        {obra.cantidadVotos}
                      </p>
                      <p className="text-xs text-muted-foreground">{porcentaje}%</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensaje si no hay votos */}
      {totalVotos === 0 && (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-8 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-medium text-foreground mb-2">Aun no hay votos</h3>
            <p className="text-sm text-muted-foreground">
              Se el primero en votar por tu obra favorita desde el catalogo
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
