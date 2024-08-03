"use client";

import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store/searchStore";
import { MagnifyingGlassIcon, Cross1Icon } from "@radix-ui/react-icons";
import { invoke } from "@tauri-apps/api/tauri";
import { RustFunctions } from "@/rust-components/enums";
import { SearchPokemon } from "@/types/interfaces";

const PokemonDropdown = () => {
  const {
    searchQuery,
    setSearchQuery,
    clearSearchQuery,
    pokemonList,
    setPokemonList,
  } = useSearchStore();

  useEffect(() => {
    const fetchData = async () => {
      const response = await invoke<string>(RustFunctions.GetPokemonList);
      const data: SearchPokemon[] = JSON.parse(response);
      setPokemonList(data);
    };

    if (!pokemonList || pokemonList.length === 0) {
      fetchData();
    }
  }, []);

  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Choose your pokémon" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 transform" />

            <Input
              className="pl-8 outline-none focus:outline-none"
              placeholder="Search for pokémon"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            {searchQuery.length ? (
              <Cross1Icon
                className="absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer"
                onClick={() => clearSearchQuery()}
              />
            ) : null}
          </div>
          <SelectLabel>Pokémon</SelectLabel>
          <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400">
            {pokemonList ? (
              pokemonList.map((pokemon) => (
                <SelectItem
                  key={pokemon.name}
                  value={pokemon.name}
                  className="capitalize"
                >
                  {pokemon.name}
                </SelectItem>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default PokemonDropdown;
