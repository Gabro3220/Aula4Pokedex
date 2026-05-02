# Proposta de Refatoração - PokedexScreen (MVVM)

## Padrão Escolhido

Escolhi o padrão **MVVM (Model-View-ViewModel)** para a Pokédex.

### Justificativa

O projeto já usa React com hooks, então o MVVM encaixa muito bem por meio de um ViewModel baseado em hook (`usePokedexViewModel`). Isso permite:

- tirar da tela a lógica de carregamento, paginação e filtro;
- manter a View mais simples e focada em renderização;
- melhorar testabilidade, pois o ViewModel pode ser testado isoladamente;
- facilitar evolução para estado global/caching sem reescrever a tela.

## Nova Estrutura de Arquivos

Proposta de organização por feature para a tela da Pokédex:

```text
PokedexApp/
├─ features/
│  └─ pokedex/
│     ├─ screens/
│     │  └─ PokedexScreen.tsx              (View)
│     ├─ viewmodels/
│     │  └─ usePokedexViewModel.ts         (ViewModel)
│     ├─ models/
│     │  ├─ pokemonMappers.ts              (mapeamentos API -> domínio/UI)
│     │  └─ pokemonTypes.ts                (tipos da feature)
│     ├─ components/
│     │  ├─ PokemonSearchInput.tsx
│     │  ├─ PokemonGrid.tsx
│     │  └─ PokedexStates.tsx              (loading/error/empty)
│     └─ index.ts
├─ services/
│  └─ api.ts                               (cliente HTTP e chamadas base)
├─ navigation/
│  └─ stack.tsx
└─ App.tsx
```

> Observação: a estrutura atual por camadas também funciona, mas a organização por feature tende a escalar melhor conforme o app cresce.

## Divisão de Responsabilidades

## View - `PokedexScreen.tsx`

A View deve conter apenas responsabilidades de interface e interação com navegação:

- renderização de título, input de busca e lista/grid;
- binding dos estados vindos do ViewModel (`list`, `isLoading`, `errorMessage`, etc.);
- ligação de callbacks do usuário para funções do ViewModel;
- navegação para detalhes (`navigate('Details', { pokemon })`).

### Exemplo de consumo do ViewModel

- recebe do hook: `visiblePokemons`, `searchQuery`, `isLoading`, `isFetchingMore`, `errorMessage`;
- usa ações: `setSearchQuery`, `loadInitial`, `loadMore`, `retry`.

## ViewModel - `usePokedexViewModel.ts`

O ViewModel centraliza regras de estado e dados da tela:

- buscar lista inicial de Pokémons;
- buscar detalhes complementares e mapear para formato usado pela UI;
- controlar estados: `pokemons`, `visiblePokemons`, `searchQuery`, `isLoading`, `isFetchingMore`, `errorMessage`, `offset`;
- aplicar filtro por busca (com memoização);
- paginação (`loadMore`) com proteção contra chamadas concorrentes;
- tratamento de erro padronizado (mensagens amigáveis para UI).

### Estado e funções expostas pela ViewModel (proposta)

- `visiblePokemons: PokemonCardViewData[]`
- `searchQuery: string`
- `isLoading: boolean`
- `isFetchingMore: boolean`
- `errorMessage: string | null`
- `setSearchQuery(value: string): void`
- `loadInitial(): Promise<void>`
- `loadMore(): Promise<void>`
- `retry(): Promise<void>`

## Fluxo de Dados (interação de busca)

Passo a passo do que acontece quando o usuário digita no campo de busca:

1. Usuário digita no `TextInput` da View (`PokedexScreen.tsx`).
2. O `onChangeText` chama `setSearchQuery(text)` do ViewModel.
3. O ViewModel atualiza o estado `searchQuery`.
4. O cálculo derivado (`visiblePokemons`) é reavaliado com base em `pokemons` + `searchQuery`.
5. A View re-renderiza automaticamente com a lista filtrada.
6. Se nenhum item corresponder, a View exibe estado vazio (`PokedexStates`).

## Fluxo de Dados (carregamento inicial)

1. A View monta e chama `loadInitial()` (ou o próprio ViewModel dispara em `useEffect` interno).
2. O ViewModel define `isLoading = true` e `errorMessage = null`.
3. O ViewModel chama serviços em `api.ts` para obter lista e detalhes necessários.
4. O ViewModel aplica mapeamento (`pokemonMappers.ts`) para formato de apresentação.
5. Atualiza `pokemons`, calcula `visiblePokemons` e define `isLoading = false`.
6. A View exibe a lista final sem conhecer regras de transformação.

## Benefícios Esperados da Refatoração

- `PokedexScreen` menor, mais legível e fácil de manter;
- menor acoplamento entre UI e dados;
- maior reaproveitamento de lógica (inclusive para outras telas);
- base mais preparada para próximos passos (favoritos globais, cache e offline).
