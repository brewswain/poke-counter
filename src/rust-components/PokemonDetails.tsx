"use client";

import { useEffect, useState } from "react";

import { useGetPokemonDetails } from "./hookWrappers/rustWrappers";

const PokemonDetails = ({ pokemonId }: { pokemonId: string }) => {
  const [pokemon, setPokemon] = useState<{ name: string; sprite: string }>();
  const getPokemonDetails = useGetPokemonDetails();

  const fetchPokemon = async () => {
    try {
      const data = await getPokemonDetails({ pokemonId });
      setPokemon(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchPokemon();
  }, []);

  return (
    <>
      {pokemon ? (
        <div className="flex items-center justify-center">
          <img src={pokemon?.sprite} alt="" className="" />
          <h1 className="text-2xl text-black">{pokemon?.name}</h1>
        </div>
      ) : (
        <div className="flex items-center justify-center">loading...</div>
      )}
    </>
  );
};

export default PokemonDetails;
