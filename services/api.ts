import axios from 'axios';
import { Pokemon, PokemonListItem } from '../types/Pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';

type PokemonDetailsResponse = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
};

export async function getPokemons(limit: number): Promise<PokemonListItem[]> {
  const response = await axios.get<{ results: PokemonListItem[] }>(
    `${API_BASE}/pokemon?limit=${limit}`
  );
  return response.data.results;
}

export async function getPokemonDetails(url: string): Promise<Pokemon> {
  const response = await axios.get<PokemonDetailsResponse>(url);

  return {
    id: response.data.id,
    name: response.data.name,
    image: response.data.sprites.front_default ?? '',
    types: response.data.types.map((entry) => entry.type.name),
  };
}
