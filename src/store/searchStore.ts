import { SearchPokemon } from "@/types/interfaces";
import Fuse from "fuse.js";
import { create } from "zustand";

interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearchQuery: () => void;
  pokemonList: SearchPokemon[];
  setPokemonList: (list: SearchPokemon[]) => void;
  filteredResults: SearchPokemon[];
  setFilteredResults: (results: SearchPokemon[]) => void;
  fuse: Fuse<SearchPokemon> | null;
  setFuse: (fuse: Fuse<SearchPokemon> | null) => void;
  selectedPokemon: SearchPokemon;
  addSelectedPokemon: (pokemon: SearchPokemon) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearchQuery: () => set({ searchQuery: "" }),
  pokemonList: [],
  setPokemonList: (list) => set({ pokemonList: list }),
  filteredResults: [],
  setFilteredResults: (results) => set({ filteredResults: results }),
  fuse: null,
  setFuse: (fuse) => set({ fuse }),
  selectedPokemon: { name: "", sprite: "", pokemon_id: "" },
  addSelectedPokemon: (pokemon) =>
    set({
      selectedPokemon: pokemon,
    }),
}));
