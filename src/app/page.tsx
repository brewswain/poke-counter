"use client";

import { useEffect, useState } from "react";
import IncrementAmount from "./components/IncrementAmount";
import AddHuntButton from "./rust-components/AddHunt";
import Count from "./rust-components/Count";
import DecrementCountButton from "./rust-components/DecrementCountButton";
import IncrementCountButton from "./rust-components/IncrementCountButton";
import PokemonDetails from "./rust-components/PokemonDetails";
import { AuthSession } from "@supabase/supabase-js";
import Auth from "./Auth";
import supabase from "./utils/supabase";

export default function Home() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <main className="flex flex-col items-center gap-4 bg-gray-900 min-h-dvh">
      {!session ? (
        <Auth />
      ) : (
        <>
          <PokemonDetails />

          <Count />
          <AddHuntButton />
          <IncrementAmount />
          <section className="flex gap-2">
            <IncrementCountButton />
            <DecrementCountButton />
          </section>
        </>
      )}
    </main>
  );
}
