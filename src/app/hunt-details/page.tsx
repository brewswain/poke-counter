"use client";

import { useSearchParams } from "next/navigation";

import SignOut from "@/components/auth/SignOut";
import IncrementAmount from "@/components/hunts/IncrementAmount";
import HomeButton from "@/components/nav/HomeButton";

import AddHuntButton from "@/rust-components/AddHunt";
import Count from "@/rust-components/Count";
import DecrementCountButton from "@/rust-components/DecrementCountButton";
import IncrementCountButton from "@/rust-components/IncrementCountButton";
import PokemonDetails from "@/rust-components/PokemonDetails";

const HuntDetails = () => {
  const searchParams = useSearchParams();
  const huntId = searchParams.get("huntId");
  const pokemonId = searchParams.get("pokemonId");

  if (!huntId || !pokemonId) {
    return <div>missing information</div>;
  }
  return (
    <div className="flex min-h-dvh flex-col items-center gap-4 bg-slate-500">
      <div className="flex gap-2">
        <HomeButton />
        <SignOut />
      </div>
      <PokemonDetails pokemonId={pokemonId} />
      <Count huntId={huntId} />
      <IncrementAmount />

      <section className="flex gap-2">
        <IncrementCountButton huntId={huntId} />
        <DecrementCountButton huntId={huntId} />
      </section>
    </div>
  );
};

export default HuntDetails;
