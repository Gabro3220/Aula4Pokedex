export interface Pokemon {
  id: number;
  name: string;
  types: any[];
  image: string;
}

export interface PokemonDetails extends Pokemon {
  height: number;
  weight: number;
  description: string;
}

export type RootStackParamList = {
  Home: undefined;
  Details: { pokemon: Pokemon };
};