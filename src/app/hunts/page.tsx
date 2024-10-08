"use client";

import { useSearchStore } from "@/store/searchStore";
import { SearchPokemon } from "@/types/interfaces";
import { invoke } from "@tauri-apps/api/tauri";

import { useEffect } from "react";

import SignOut from "@/components/auth/SignOut";
import PokemonDropdown from "@/components/pokemonList/PokemonDropdown";

import AddHuntButton from "@/rust-components/AddHunt";
import AvailableHunts from "@/rust-components/AvailableHunts";
import { useGetPokemonList } from "@/rust-components/hookWrappers/rustWrappers";

const HuntsListPage = () => {
  const { clearSearchQuery, pokemonList, setPokemonList } = useSearchStore();
  const getPokemonList = useGetPokemonList();

  useEffect(() => {
    const fetchData = async () => {
      if (pokemonList.length === 0) {
        const response = await getPokemonList();

        setPokemonList(response);
      }
    };

    fetchData();

    return () => {
      clearSearchQuery();
    };
  }, []);

  return (
    <main className="min-h-dvh bg-slate-500 px-4">
      <div className="flex w-full justify-center">
        <SignOut />
      </div>

      <PokemonDropdown />
      <AddHuntButton />
      <AvailableHunts />
    </main>
  );
};

export default HuntsListPage;
