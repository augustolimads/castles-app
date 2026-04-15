'use client';

import { useEffect, useState } from 'react';

export interface Monster {
  id: string;
  nome: string;
  nivel: string;
  pv: string;
  numero: string;
  ca: string;
  rm: string;
  tamanho: string;
  jp: string;
  inteligencia: string;
  movimento: string;
  disposicao: string;
  sanidade: string;
  clima: string;
  ataques: string;
  bioma: string;
  xp: string;
  tesouros: string;
  habilidades: string;
  pag: string;
  bloco: number;
}

export function useMonsters() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/monsters')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch monsters');
        return res.json();
      })
      .then(data => {
        setMonsters(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { monsters, loading, error };
}
