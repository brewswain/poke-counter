import { SearchPokemon } from "@/types/interfaces";
import { invoke } from "@tauri-apps/api/tauri";
import Fuse from "fuse.js";
import { StateCreator, create } from "zustand";
import { PersistOptions, createJSONStorage, persist } from "zustand/middleware";

import { RustFunctions } from "@/rust-components/enums";

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
type SearchPersist = (
  config: StateCreator<SearchState>,
  options: PersistOptions<SearchState>,
) => StateCreator<SearchState>;

export const useSearchStore = create(
  (persist as SearchPersist)(
    (set) => ({
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
      addSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
    }),
    {
      name: "pokemon-search-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        pokemonList: state.pokemonList,
        searchQuery: "",
        filteredResults: [],
        fuse: null,
        selectedPokemon: { name: "", sprite: "", pokemon_id: "" },
      }),
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            const lastFetchTime = localStorage.getItem(
              "lastPokemonListFetchTime",
            );
            const currentTime = Date.now();
            const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

            if (
              !lastFetchTime ||
              currentTime - parseInt(lastFetchTime) > oneDay
            ) {
              const refetchPokemonList = async () => {
                console.log("refetching pokemon list");
                try {
                  const response = await invoke<string>(
                    RustFunctions.GetPokemonList,
                  );
                  const data: SearchPokemon[] = JSON.parse(response);
                  state?.setPokemonList(data);
                } catch (error) {
                  console.error("Failed to refetch Pokemon list:", error);
                }
              };

              refetchPokemonList();
              localStorage.setItem(
                "lastPokemonListFetchTime",
                currentTime.toString(),
              );
            }
          }
        };
      },
    },
  ),
);
