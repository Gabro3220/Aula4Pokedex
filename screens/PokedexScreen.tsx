import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getPokemonDetails, getPokemons } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';

export const PokedexScreen = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PokedexScreen.tsx

useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const list = await getPokemons(30);
      
      const details = await Promise.all(
        list.map(async (pokemon: any) => {
          const response = await getPokemonDetails(pokemon.url);
          
          // AQUI ESTÁ O MAPEAMENTO:
          // Transformamos o dado bruto da API no formato que seu componente entende
          return {
            id: response.id,
            name: response.name,
            types: response.types,
            // Pegamos a imagem oficial (que é a mais bonita)
            image: response.sprites.other['official-artwork'].front_default || response.sprites.front_default,
          };
        })
      );
      
      setPokemons(details);
    } catch (err) {
      setError('Falha ao carregar Pokémons. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);

  const filteredPokemons = useMemo(
    () => pokemons.filter((pokemon) => 
      pokemon.name.toLowerCase().includes(search.toLowerCase().trim())
    ),
    [pokemons, search]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokedex</Text>
      
      <TextInput
        placeholder="Buscar pokemon..."
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />

      {/* Indicador de Carregamento centralizado */}
      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF0000" />
          <Text style={styles.loadingText}>Carregando Pokémons...</Text>
        </View>
      )}

      {/* Mensagem de Erro amigável */}
      {error && !isLoading && (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      {/* Lista de Pokémons */}
      {!isLoading && !error && (
        <FlatList
          data={filteredPokemons}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <PokemonCard pokemon={item} />}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum pokemon encontrado.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  list: {
    paddingBottom: 24,
  },
  error: {
    textAlign: 'center',
    color: '#b00020',
    fontSize: 16,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});