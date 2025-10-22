# Pokemon API Examples

This directory contains example code demonstrating REST API operations for the Pokedex application.

## Files

### 1. `route-example.ts`
Location: `/src/app/api/pokemon/route-example.ts`

This file shows example implementations of REST API endpoints:
- **POST** - Create a new Pokemon
- **PUT** - Full update of a Pokemon
- **PATCH** - Partial update of a Pokemon
- **DELETE** - Remove a Pokemon

**Note:** These are example implementations and are NOT active in the application. They demonstrate the patterns you would use to implement these operations.

### 2. `api-demo.js`
A Node.js script that demonstrates how to call the Pokemon API endpoints.

## Running the Demo Script

1. Make sure your Next.js development server is running:
   ```bash
   npm run dev
   ```

2. Run the demo script:
   ```bash
   node examples/api-demo.js
   ```

The script will demonstrate:
- Getting all Pokemon with pagination
- Getting a single Pokemon by ID
- Searching Pokemon by name
- Filtering Pokemon by type
- Filtering Pokemon by stats
- Example POST, PUT, PATCH, DELETE requests (these will fail since they're not implemented)

## Implementing Write Operations

To add POST/PUT/PATCH/DELETE support to your application:

### Option 1: Add to main route
Add the POST method to `/src/app/api/pokemon/route.ts`:

```typescript
export async function POST(request: NextRequest) {
  // Copy implementation from route-example.ts
}
```

### Option 2: Add to individual Pokemon route
Add PUT, PATCH, DELETE methods to `/src/app/api/pokemon/[id]/route.ts`:

```typescript
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Copy implementation from route-example.ts
}
```

## Example Usage with curl

### GET - Fetch Pokemon
```bash
# Get all Pokemon (paginated)
curl "http://localhost:3000/api/pokemon?page=1&limit=20"

# Get single Pokemon
curl "http://localhost:3000/api/pokemon/25"

# Search by name
curl "http://localhost:3000/api/pokemon?name=pikachu"

# Filter by type
curl "http://localhost:3000/api/pokemon?types=electric,fire"

# Filter by stats
curl "http://localhost:3000/api/pokemon?minHp=50&maxHp=100&minAttack=50&maxAttack=100"
```

### POST - Create Pokemon (if implemented)
```bash
curl -X POST "http://localhost:3000/api/pokemon" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "testmon",
    "type1": "electric",
    "type2": "fire",
    "hp": 100,
    "attack": 120,
    "defense": 80,
    "speed": 90
  }'
```

### PUT - Update Pokemon (if implemented)
```bash
curl -X PUT "http://localhost:3000/api/pokemon/999" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "testmon-updated",
    "type1": "electric",
    "type2": "fire",
    "hp": 110,
    "attack": 125,
    "defense": 85,
    "speed": 95
  }'
```

### PATCH - Partial Update (if implemented)
```bash
curl -X PATCH "http://localhost:3000/api/pokemon/999" \
  -H "Content-Type: application/json" \
  -d '{
    "hp": 120,
    "attack": 130
  }'
```

### DELETE - Remove Pokemon (if implemented)
```bash
curl -X DELETE "http://localhost:3000/api/pokemon/999"
```

## Using with JavaScript/TypeScript

```typescript
// Create a new Pokemon
const response = await fetch('/api/pokemon', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'testmon',
    type1: 'electric',
    hp: 100,
    attack: 120,
    defense: 80,
    speed: 90
  })
});
const data = await response.json();

// Update a Pokemon
const updateResponse = await fetch('/api/pokemon/999', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    hp: 120,
    attack: 130
  })
});

// Delete a Pokemon
const deleteResponse = await fetch('/api/pokemon/999', {
  method: 'DELETE'
});
```

## Database Schema Reference

The Pokemon table structure:
```sql
CREATE TABLE pokemon (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  type1 VARCHAR(50),
  type2 VARCHAR(50),
  hp INT,
  attack INT,
  defense INT,
  speed INT
);
```

## Security Considerations

When implementing write operations in production:
1. Add authentication/authorization
2. Validate all input data
3. Use prepared statements (already done via the `query` function)
4. Add rate limiting
5. Implement proper error handling
6. Add audit logging
7. Consider implementing soft deletes instead of hard deletes
