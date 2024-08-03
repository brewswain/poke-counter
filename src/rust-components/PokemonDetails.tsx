"use client";

import { useState, useEffect } from "react";

import { invoke } from "@tauri-apps/api/tauri";
import { RustFunctions } from "./enums";

const PokemonDetails = ({ pokemonId }: { pokemonId: string }) => {
  const [pokemon, setPokemon] = useState<{ name: string; sprite: string }>();

  useEffect(() => {
    invoke<string>(RustFunctions.GetPokemon, { pokemonId })
      .then((result) => {
        const data = JSON.parse(result);
        setPokemon(data);
      })
      .catch(console.error);
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
