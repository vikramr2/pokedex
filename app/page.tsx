'use client';

import { useState, useEffect, use } from "react";
import Image from "next/image";

interface Pokemon {
  id: number;
  name: string;
  type1: string;
  type2?: string;
  hp: number;
  attack: number;
  defense: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
}

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPokemon = async (page: number = 1, name: string = '') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (name) {
        params.append('name', name);
      }

      const response = await fetch(`/api/pokemon?${params}`);
      const data = await response.json();
      console.log(data);

      setPokemon(data.data);
    } catch (error) {
      console.error('Error fetching pokemon:', error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  // Debounced search - updates as you type or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPokemon(1, searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search already happens via useEffect, this just prevents page reload
  };

  const getPokemonImageUrl = (id: number, name: string) => {
    const paddedId = id.toString().padStart(3, '0');
    return `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${paddedId}.png`;
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Pokedex
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Pokemon by name..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Pokemon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {pokemon.map((p) => (
            <div>
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  #{p.id.toString().padStart(4, '0')}
                </span>
                <div className="relative w-full h-48 mb-2">
                  <Image
                    src={getPokemonImageUrl(p.id, p.name)}
                    alt={p.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white capitalize">
                  {p.name}
                </h3>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>HP:</span>
                  <span className="font-semibold">{p.hp}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Attack:</span>
                  <span className="font-semibold">{p.attack}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Defense:</span>
                  <span className="font-semibold">{p.defense}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Speed:</span>
                  <span className="font-semibold">{p.speed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
