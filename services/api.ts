// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
});

export const getPokemons = async (limit: number = 30, offset: number = 0) => {
  try {
    const response = await api.get(`pokemon?limit=${limit}&offset=${offset}`);
    return response.data.results;
  } catch (error) {
    console.error("Erro ao buscar lista de pokemons", error);
    throw new Error('Erro ao buscar lista'); 
  }
};

export const getPokemonDetails = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes", error);
    throw new Error('Erro ao buscar detalhes');
  }
};