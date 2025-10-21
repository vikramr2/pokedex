'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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

const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

interface Filters {
  types: string[];
  minHp: number;
  maxHp: number;
  minAttack: number;
  maxAttack: number;
  minDefense: number;
  maxDefense: number;
  minSpeed: number;
  maxSpeed: number;
}

interface StatRanges {
  minHp: number;
  maxHp: number;
  minAttack: number;
  maxAttack: number;
  minDefense: number;
  maxDefense: number;
  minSpeed: number;
  maxSpeed: number;
}

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statRanges, setStatRanges] = useState<StatRanges>({
    minHp: 0,
    maxHp: 255,
    minAttack: 0,
    maxAttack: 255,
    minDefense: 0,
    maxDefense: 255,
    minSpeed: 0,
    maxSpeed: 255,
  });
  const [filters, setFilters] = useState<Filters>({
    types: [],
    minHp: 0,
    maxHp: 255,
    minAttack: 0,
    maxAttack: 255,
    minDefense: 0,
    maxDefense: 255,
    minSpeed: 0,
    maxSpeed: 255,
  });
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchPokemon = async (page: number = 1, name: string = '', currentFilters: Filters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (name) {
        params.append('name', name);
      }

      // Add type filters
      if (currentFilters.types.length > 0) {
        params.append('types', currentFilters.types.join(','));
      }

      // Add stat filters (only if not default values)
      if (currentFilters.minHp > statRanges.minHp) params.append('minHp', currentFilters.minHp.toString());
      if (currentFilters.maxHp < statRanges.maxHp) params.append('maxHp', currentFilters.maxHp.toString());
      if (currentFilters.minAttack > statRanges.minAttack) params.append('minAttack', currentFilters.minAttack.toString());
      if (currentFilters.maxAttack < statRanges.maxAttack) params.append('maxAttack', currentFilters.maxAttack.toString());
      if (currentFilters.minDefense > statRanges.minDefense) params.append('minDefense', currentFilters.minDefense.toString());
      if (currentFilters.maxDefense < statRanges.maxDefense) params.append('maxDefense', currentFilters.maxDefense.toString());
      if (currentFilters.minSpeed > statRanges.minSpeed) params.append('minSpeed', currentFilters.minSpeed.toString());
      if (currentFilters.maxSpeed < statRanges.maxSpeed) params.append('maxSpeed', currentFilters.maxSpeed.toString());

      const response = await fetch(`/api/pokemon?${params}`);
      const data = await response.json();

      setPokemon(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch stat ranges on mount
    const fetchStatRanges = async () => {
      try {
        const response = await fetch('/api/pokemon/stats');
        const data = await response.json();
        const ranges = data.data;

        setStatRanges(ranges);
        setFilters(prev => ({
          ...prev,
          minHp: ranges.minHp,
          maxHp: ranges.maxHp,
          minAttack: ranges.minAttack,
          maxAttack: ranges.maxAttack,
          minDefense: ranges.minDefense,
          maxDefense: ranges.maxDefense,
          minSpeed: ranges.minSpeed,
          maxSpeed: ranges.maxSpeed,
        }));
      } catch (error) {
        console.error('Error fetching stat ranges:', error);
      }
    };

    fetchStatRanges();
    fetchPokemon();
  }, []);

  // Debounced search - updates as you type or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPokemon(1, searchQuery, filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search already happens via useEffect, this just prevents page reload
  };

  const handlePageChange = (newPage: number) => {
    fetchPokemon(newPage, searchQuery, filters);
  };

  const toggleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const resetFilters = () => {
    setFilters({
      types: [],
      minHp: statRanges.minHp,
      maxHp: statRanges.maxHp,
      minAttack: statRanges.minAttack,
      maxAttack: statRanges.maxAttack,
      minDefense: statRanges.minDefense,
      maxDefense: statRanges.maxDefense,
      minSpeed: statRanges.minSpeed,
      maxSpeed: statRanges.maxSpeed,
    });
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
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {(searchQuery || filters.types.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  resetFilters();
                }}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </form>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Advanced Filters
            </h2>

            {/* Type Filters */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {POKEMON_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-white ${getTypeColor(type)} ${
                      filters.types.includes(type)
                        ? 'scale-105 ring-4 ring-offset-2 ring-white dark:ring-gray-800'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Stat Range Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* HP Range */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  HP: {filters.minHp} - {filters.maxHp}
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={statRanges.minHp}
                    max={statRanges.maxHp}
                    value={filters.minHp}
                    onChange={(e) => setFilters(prev => ({ ...prev, minHp: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={statRanges.minHp}
                    max={statRanges.maxHp}
                    value={filters.maxHp}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxHp: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Attack Range */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Attack: {filters.minAttack} - {filters.maxAttack}
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={statRanges.minAttack}
                    max={statRanges.maxAttack}
                    value={filters.minAttack}
                    onChange={(e) => setFilters(prev => ({ ...prev, minAttack: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={statRanges.minAttack}
                    max={statRanges.maxAttack}
                    value={filters.maxAttack}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxAttack: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Defense Range */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Defense: {filters.minDefense} - {filters.maxDefense}
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={statRanges.minDefense}
                    max={statRanges.maxDefense}
                    value={filters.minDefense}
                    onChange={(e) => setFilters(prev => ({ ...prev, minDefense: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={statRanges.minDefense}
                    max={statRanges.maxDefense}
                    value={filters.maxDefense}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxDefense: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Speed Range */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Speed: {filters.minSpeed} - {filters.maxSpeed}
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={statRanges.minSpeed}
                    max={statRanges.maxSpeed}
                    value={filters.minSpeed}
                    onChange={(e) => setFilters(prev => ({ ...prev, minSpeed: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={statRanges.minSpeed}
                    max={statRanges.maxSpeed}
                    value={filters.maxSpeed}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxSpeed: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

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
                <div
                  key={p.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
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

            {/* Pagination */}
            {pokemon.length > 0 && (
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
            {pokemon.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No Pokemon found. Try a different search.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
