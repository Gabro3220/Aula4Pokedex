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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const list = await getPokemons(30);
        const details = await Promise.all(list.map((pokemon) => getPokemonDetails(pokemon.url)));
        setPokemons(details);
      } catch {
        setError('Nao foi possivel carregar os pokemons. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPokemons = useMemo(
    () => pokemons.filter((pokemon) => pokemon.name.includes(search.toLowerCase().trim())),
    [pokemons, search]
  );
  const hasSearchTerm = search.trim().length > 0;
  const listEmptyMessage = hasSearchTerm
    ? `Nenhum Pokemon encontrado para "${search.trim()}".`
    : 'Nenhum Pokemon para exibir no momento.';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokedex</Text>
      <TextInput
        placeholder="Buscar pokemon..."
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />

      {isLoading ? <ActivityIndicator size="large" color="#444" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!isLoading && !error ? (
        <FlatList
          data={filteredPokemons}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <PokemonCard pokemon={item} />}
          ListEmptyComponent={<Text style={styles.empty}>{listEmptyMessage}</Text>}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
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
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  list: {
    paddingBottom: 24,
  },
  error: {
    marginTop: 12,
    color: '#b00020',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
