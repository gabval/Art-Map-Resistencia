'use client';

import { Trophy, Medal, Award } from 'lucide-react';
import type { Obra } from '@/lib/tipos';

interface LeaderboardProps {
  obras: Obra[];
}

export function Leaderboard({ obras }: LeaderboardProps) {
  const obrasOrdenadas = [...obras].sort((a, b) => b.cantidadVotos - a.cantidadVotos).filter(o => o.cantidadVotos > 0);

  const getMedalColor = (index: number) => {
    switch(index) {
      case 0: return 'text-yellow-500';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-700';
      default: return 'text-muted-foreground';
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className={`h-6 w-6 ${getMedalColor(index)}`} />;
    if (index === 1) return <Medal className={`h-6 w-6 ${getMedalColor(index)}`} />;
    if (index === 2) return <Award className={`h-6 w-6 ${getMedalColor(index)}`} />;
    return <span className="text-lg font-bold text-muted-foreground w-6 text-center">{index + 1}</span>;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Top Obras</h2>
        <p className="text-muted-foreground">Las obras de arte urbano más elegidas por la comunidad.</p>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        {obrasOrdenadas.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Aún no hay obras votadas.</p>
            <p className="text-sm mt-1">¡Sé el primero en votar tu obra favorita!</p>
          </div>
        ) : (
          <ul className="divide-y">
            {obrasOrdenadas.map((obra, index) => (
              <li 
                key={obra.id} 
                className={`p-4 flex items-center gap-4 transition-colors hover:bg-muted/50 ${
                  index < 3 ? 'bg-muted/20' : ''
                }`}
              >
                <div className="flex-shrink-0 flex justify-center items-center w-10 h-10 rounded-full bg-background border shadow-sm">
                  {getRankIcon(index)}
                </div>
                
                <div className="flex-grow min-w-0 flex items-center gap-3">
                  {obra.imagenUrl && (
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 hidden sm:block">
                      <img src={obra.imagenUrl} alt={obra.titulo} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {obra.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {obra.autor} • {obra.categoria}
                    </p>
                  </div>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <div className="inline-flex items-center justify-center bg-secondary/20 text-secondary-foreground font-bold rounded-full px-3 py-1 border border-secondary/30">
                    {obra.cantidadVotos}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground ml-2 hidden sm:inline-block">
                    {obra.cantidadVotos === 1 ? 'Voto' : 'Votos'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
