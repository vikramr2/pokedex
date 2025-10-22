'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface Pokemon {
  id: number;
  name: string;
  type1: string;
  type2?: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(`/api/pokemon/${params.id}`);
        if (!response.ok) {
          throw new Error('Pokemon not found');
        }
        const data = await response.json();
        setPokemon(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pokemon');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPokemon();
    }
  }, [params.id]);

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-cyan-300',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-700',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };
    return colors[type.toLowerCase()] || 'bg-gray-400';
  };

  const getPokemonImageUrl = (id: number) => {
    const paddedId = id.toString().padStart(3, '0');
    return `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${paddedId}.png`;
  };

  const getStatBarColor = (stat: number) => {
    if (stat >= 150) return 'bg-green-500';
    if (stat >= 100) return 'bg-blue-500';
    if (stat >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Pokemon not found'}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Back to Pokedex
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="mb-6 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          ← Back to Pokedex
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <span className="text-2xl text-gray-500 dark:text-gray-400 font-bold">
              #{pokemon.id.toString().padStart(4, '0')}
            </span>
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white capitalize mt-2">
              {pokemon.name}
            </h1>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative w-96 h-96">
              <Image
                src={getPokemonImageUrl(pokemon.id)}
                alt={pokemon.name}
                fill
                className="object-contain"
                unoptimized
                priority
              />
            </div>
          </div>

          <div className="flex gap-3 justify-center mb-8">
            <span
              className={`${getTypeColor(
                pokemon.type1
              )} px-6 py-2 rounded-full text-white text-lg font-semibold uppercase`}
            >
              {pokemon.type1}
            </span>
            {pokemon.type2 && (
              <span
                className={`${getTypeColor(
                  pokemon.type2
                )} px-6 py-2 rounded-full text-white text-lg font-semibold uppercase`}
              >
                {pokemon.type2}
              </span>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Base Stats</h2>

            {[
              { name: 'HP', value: pokemon.hp },
              { name: 'Attack', value: pokemon.attack },
              { name: 'Defense', value: pokemon.defense },
              { name: 'Speed', value: pokemon.speed },
            ].map((stat) => (
              <div key={stat.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300 w-32">
                    {stat.name}
                  </span>
                  <span className="text-lg font-bold text-gray-800 dark:text-white w-16 text-right">
                    {stat.value}
                  </span>
                  <div className="flex-1 ml-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                      <div
                        className={`${getStatBarColor(stat.value)} h-6 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min((stat.value / 255) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
                  Total
                </span>
                <span className="text-xl font-bold text-gray-800 dark:text-white">
                  {pokemon.hp + pokemon.attack + pokemon.defense + pokemon.speed}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
