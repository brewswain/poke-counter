import { SearchPokemon } from "@/types/interfaces";
import { create } from "zustand";

interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearchQuery: () => void;
  searchResults: SearchPokemon[];
  setSearchResults: (results: SearchPokemon[]) => void;
  pokemonList: SearchPokemon[];
  setPokemonList: (list: SearchPokemon[]) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearchQuery: () => set({ searchQuery: "" }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  pokemonList: [],
  setPokemonList: (list) => set({ pokemonList: list }),
}));
