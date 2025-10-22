'use client';

import { useState, useEffect } from "react";
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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchPokemon = async (page: number = 1, name: string = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (name) {
        params.append('name', name);
      }

      const response = await fetch(`/api/pokemon?${params}`);
      const data = await response.json();
      console.log(data);

      setPokemon(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching pokemon:', error);
    } finally {
      setLoading(false);
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

  const handlePageChange = (newPage: number) => {
    fetchPokemon(newPage, searchQuery);
  };

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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        )}

        {/* Pokemon Grid */}
        {!loading && (
          <>
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

                  <div className="flex gap-2 justify-center mb-4">
                    <span
                      className={`${getTypeColor(
                        p.type1
                      )} px-3 py-1 rounded-full text-white text-xs font-semibold uppercase`}
                    >
                      {p.type1}
                    </span>
                    {p.type2 && (
                      <span
                        className={`${getTypeColor(
                          p.type2
                        )} px-3 py-1 rounded-full text-white text-xs font-semibold uppercase`}
                      >
                        {p.type2}
                      </span>
                    )}
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
          </>
        )}

        {/* Pagination */}
        {!loading && pokemon.length > 0 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* No Results */}
        {pokemon.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No Pokemon found. Try a different search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
