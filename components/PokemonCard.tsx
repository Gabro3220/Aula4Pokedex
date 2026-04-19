// PokemonCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'; // Importe TouchableOpacity
import { Pokemon } from '../types/Pokemon';
import { capitalize } from '../utils/format';

interface Props {
  pokemon: Pokemon;
  onPress?: () => void; // Adicione esta linha
}

export const PokemonCard = ({ pokemon, onPress }: Props) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} // Aciona a função de clique
      activeOpacity={0.7}
    >
      {pokemon.image ? (
        <Image 
          source={{ uri: pokemon.image }} 
          style={styles.image} 
          resizeMode="contain"
        />
      ) : (
        <View style={styles.imageFallback}>
          <Text style={styles.fallbackText}>Sem imagem</Text>
        </View>
      )}

      <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
      
      <Text style={styles.types}>
        {pokemon.types
          .map((t: any) => capitalize(t.type.name))
          .join(' • ')}
      </Text>
    </TouchableOpacity>
  );
};;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    margin: 8,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { 
    width: 100, // Aumentei um pouco para aparecer melhor
    height: 100 
  },
  imageFallback: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 10,
    color: '#777',
  },
  name: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  types: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
});