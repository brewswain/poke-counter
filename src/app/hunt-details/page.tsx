"use client";

import SignOut from "@/app/components/auth/SignOut";
import IncrementAmount from "@/app/components/IncrementAmount";
import AddHuntButton from "@/app/rust-components/AddHunt";
import Count from "@/app/rust-components/Count";
import DecrementCountButton from "@/app/rust-components/DecrementCountButton";
import { RustFunctions } from "@/app/rust-components/enums";
import IncrementCountButton from "@/app/rust-components/IncrementCountButton";
import PokemonDetails from "@/app/rust-components/PokemonDetails";
import { Hunt } from "@/app/types/interfaces";
import supabase from "@/app/utils/supabase";
import { invoke } from "@tauri-apps/api";
import { useSearchParams } from "next/navigation";
import React from "react";

const HuntDetails = () => {
  const searchParams = useSearchParams();
  const huntId = searchParams.get("huntId");
  const pokemonId = searchParams.get("pokemonId");
  const initial_count = searchParams.get("initial_count");
  console.log({ huntId, pokemonId, initial_count });

  if (!huntId || !pokemonId || !initial_count) {
    return <div>missing information</div>;
  }
  return (
    <div className="flex flex-col items-center min-h-dvh bg-slate-500 gap-4">
      <SignOut />
      <PokemonDetails pokemonId={pokemonId} />
      <Count initial_count={parseInt(initial_count)} huntId={huntId} />
      <AddHuntButton />
      <IncrementAmount />

      <section className="flex gap-2">
        <IncrementCountButton />
        <DecrementCountButton />
      </section>
    </div>
  );
};

export default HuntDetails;
