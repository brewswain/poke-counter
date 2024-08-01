"use client";

import { useState, useEffect } from "react";

import { invoke } from "@tauri-apps/api/tauri";
import { RustFunctions } from "./enums";
import Image from "next/image";

const PokemonDetails = () => {
  const [pokemon, setPokemon] = useState<{ name: string; sprite: string }>();

  useEffect(() => {
    invoke<string>(RustFunctions.GetPokemon, { pokedexId: "246" })
      .then((result) => {
        const data = JSON.parse(result);
        setPokemon(data);
      })
      .catch(console.error);
  }, []);

  console.log({ pokemon });
  return (
    <>
      {pokemon ? (
        <div className="flex justify-center items-center">
          <img src={pokemon?.sprite} alt="" />
          <h1 className="text-2xl">{pokemon?.name}</h1>
        </div>
      ) : (
        <div className="flex justify-center items-center">loading...</div>
      )}
    </>
  );
};

export default PokemonDetails;
