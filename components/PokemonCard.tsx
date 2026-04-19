import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Pokemon } from '../types/Pokemon';
import { capitalize } from '../utils/format';

interface Props {
  pokemon: Pokemon;
}

export const PokemonCard = ({ pokemon }: Props) => {
  return (
    <View style={styles.card}>
      {pokemon.image ? (
        <Image source={{ uri: pokemon.image }} style={styles.image} />
      ) : (
        <View style={styles.imageFallback}>
          <Text style={styles.fallbackText}>Sem imagem</Text>
        </View>
      )}

      <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
      <Text style={styles.types}>{pokemon.types.join(' • ')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    margin: 8,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  image: { width: 80, height: 80 },
  imageFallback: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#cfcfcf',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 10,
    color: '#555',
  },
  name: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  types: {
    marginTop: 4,
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
});
