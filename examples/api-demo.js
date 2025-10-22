/**
 * Sample Script: Pokemon REST API Demo
 *
 * This script demonstrates how to interact with Pokemon API endpoints
 * for CREATE, READ, UPDATE, and DELETE operations.
 *
 * NOTE: This is a demonstration script. The POST, PUT, PATCH, and DELETE
 * endpoints shown here are NOT implemented in the actual application.
 * See route-example.ts for how to implement them.
 *
 * To run this script:
 * 1. Make sure your Next.js server is running (npm run dev)
 * 2. Run: node examples/api-demo.js
 */

const BASE_URL = 'http://localhost:3000/api/pokemon';

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error) {
    console.error('Request failed:', error.message);
    return { status: 0, ok: false, error: error.message };
  }
}

// ===========================
// CREATE (POST) Examples
// ===========================

async function createPokemon(pokemonData) {
  console.log('\n--- CREATE POKEMON ---');
  console.log('Sending:', pokemonData);

  const result = await makeRequest(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(pokemonData),
  });

  console.log('Response:', result);
  return result;
}

// ===========================
// READ (GET) Examples
// ===========================

async function getAllPokemon(filters = {}) {
  console.log('\n--- GET ALL POKEMON ---');

  const params = new URLSearchParams(filters);
  const url = `${BASE_URL}?${params}`;

  const result = await makeRequest(url);

  console.log(`Found ${result.data?.data?.length || 0} Pokemon`);
  if (result.data?.data) {
    console.log('First 3:', result.data.data.slice(0, 3).map(p => p.name));
  }
  return result;
}

async function getPokemonById(id) {
  console.log(`\n--- GET POKEMON #${id} ---`);

  const result = await makeRequest(`${BASE_URL}/${id}`);

  console.log('Response:', result);
  return result;
}

// ===========================
// UPDATE (PUT/PATCH) Examples
// ===========================

async function updatePokemon(id, pokemonData) {
  console.log(`\n--- UPDATE POKEMON #${id} (PUT) ---`);
  console.log('Sending:', pokemonData);

  const result = await makeRequest(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(pokemonData),
  });

  console.log('Response:', result);
  return result;
}

async function partialUpdatePokemon(id, updates) {
  console.log(`\n--- PARTIAL UPDATE POKEMON #${id} (PATCH) ---`);
  console.log('Sending:', updates);

  const result = await makeRequest(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });

  console.log('Response:', result);
  return result;
}

// ===========================
// DELETE Examples
// ===========================

async function deletePokemon(id) {
  console.log(`\n--- DELETE POKEMON #${id} ---`);

  const result = await makeRequest(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  console.log('Response:', result);
  return result;
}

// ===========================
// Advanced Query Examples
// ===========================

async function searchPokemonByName(name) {
  console.log(`\n--- SEARCH POKEMON BY NAME: "${name}" ---`);

  const result = await makeRequest(`${BASE_URL}?name=${encodeURIComponent(name)}`);

  console.log(`Found ${result.data?.data?.length || 0} Pokemon`);
  return result;
}

async function filterPokemonByType(types) {
  console.log(`\n--- FILTER BY TYPE: ${types.join(', ')} ---`);

  const result = await makeRequest(`${BASE_URL}?types=${types.join(',')}`);

  console.log(`Found ${result.data?.data?.length || 0} Pokemon`);
  return result;
}

async function filterPokemonByStats(minHp, maxHp, minAttack, maxAttack) {
  console.log(`\n--- FILTER BY STATS ---`);
  console.log(`HP: ${minHp}-${maxHp}, Attack: ${minAttack}-${maxAttack}`);

  const params = new URLSearchParams({
    minHp: minHp.toString(),
    maxHp: maxHp.toString(),
    minAttack: minAttack.toString(),
    maxAttack: maxAttack.toString(),
  });

  const result = await makeRequest(`${BASE_URL}?${params}`);

  console.log(`Found ${result.data?.data?.length || 0} Pokemon`);
  return result;
}

// ===========================
// MAIN DEMO FUNCTION
// ===========================

async function runDemo() {
  console.log('='.repeat(50));
  console.log('POKEMON REST API DEMONSTRATION');
  console.log('='.repeat(50));

  // READ Operations (these work with current implementation)
  await getAllPokemon({ page: 1, limit: 5 });
  await getPokemonById(1);
  await searchPokemonByName('pikachu');
  await filterPokemonByType(['electric', 'fire']);
  await filterPokemonByStats(50, 100, 50, 100);

  console.log('\n' + '='.repeat(50));
  console.log('WRITE OPERATIONS (NOT IMPLEMENTED)');
  console.log('These would work if you implement the routes');
  console.log('='.repeat(50));

  // CREATE Operation (example - not implemented)
  const newPokemon = {
    name: 'testmon',
    type1: 'electric',
    type2: 'fire',
    hp: 100,
    attack: 120,
    defense: 80,
    speed: 90,
  };
  await createPokemon(newPokemon);

  // UPDATE Operations (examples - not implemented)
  await updatePokemon(999, {
    name: 'testmon-updated',
    type1: 'electric',
    type2: 'fire',
    hp: 110,
    attack: 125,
    defense: 85,
    speed: 95,
  });

  await partialUpdatePokemon(999, {
    hp: 120,
    attack: 130,
  });

  // DELETE Operation (example - not implemented)
  await deletePokemon(999);

  console.log('\n' + '='.repeat(50));
  console.log('DEMO COMPLETE');
  console.log('='.repeat(50));
}

// Run the demo
if (require.main === module) {
  runDemo().catch(console.error);
}

// Export functions for use in other scripts
module.exports = {
  createPokemon,
  getAllPokemon,
  getPokemonById,
  updatePokemon,
  partialUpdatePokemon,
  deletePokemon,
  searchPokemonByName,
  filterPokemonByType,
  filterPokemonByStats,
};
