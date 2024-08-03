"use client";

import SignOut from "@/components/auth/SignOut";
import IncrementAmount from "@/components/hunts/IncrementAmount";
import HomeButton from "@/components/nav/HomeButton";
import AddHuntButton from "@/rust-components/AddHunt";
import Count from "@/rust-components/Count";
import DecrementCountButton from "@/rust-components/DecrementCountButton";
import IncrementCountButton from "@/rust-components/IncrementCountButton";
import PokemonDetails from "@/rust-components/PokemonDetails";

import { useSearchParams } from "next/navigation";
import React from "react";

const HuntDetails = () => {
  const searchParams = useSearchParams();
  const huntId = searchParams.get("huntId");
  const pokemonId = searchParams.get("pokemonId");
  const initial_count = searchParams.get("initial_count");

  if (!huntId || !pokemonId || !initial_count) {
    return <div>missing information</div>;
  }
  return (
    <div className="flex min-h-dvh flex-col items-center gap-4 bg-slate-500">
      <div className="flex gap-2">
        <HomeButton />
        <SignOut />
      </div>
      <PokemonDetails pokemonId={pokemonId} />
      <Count initial_count={parseInt(initial_count)} huntId={huntId} />
      <AddHuntButton />
      <IncrementAmount />

      <section className="flex gap-2">
        <IncrementCountButton huntId={huntId} />
        <DecrementCountButton huntId={huntId} />
      </section>
    </div>
  );
};

export default HuntDetails;
