"use client";

import { useState, useEffect } from "react";

import { invoke } from "@tauri-apps/api/tauri";
import { RustFunctions } from "./enums";

const PokemonDetails = () => {
  const [pokemon, setPokemon] = useState<{ name: string; sprite: string }>();

  useEffect(() => {
    invoke<string>(RustFunctions.GetPokemon, { pokedexId: "1" })
      .then((result) => {
        const data = JSON.parse(result);
        setPokemon(data);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      {pokemon ? (
        <div className="flex justify-center items-center">
          <img src={pokemon?.sprite} alt="" className="" />
          <h1 className="text-2xl">{pokemon?.name}</h1>
        </div>
      ) : (
        <div className="flex justify-center items-center">loading...</div>
      )}
    </>
  );
};

export default PokemonDetails;
