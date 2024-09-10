"use client";

import { useSearchStore } from "@/store/searchStore";
import supabase from "@/utils/supabase";

import { useRouter } from "next/navigation";

import { useAddHunt } from "./hookWrappers/rustWrappers";

const AddHuntButton = () => {
  const { selectedPokemon } = useSearchStore();

  const router = useRouter();
  const addHunt = useAddHunt();

  const handleClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      if (user && session) {
        const data = await addHunt({
          userId: user.id,
          pokemonId: selectedPokemon.pokemon_id,
          accessToken: session.access_token,
          sprite: selectedPokemon.sprite,
          name: selectedPokemon.name,
        });

        console.log({ data });
        if (data[0].id) {
          const cachedHunts = JSON.parse(
            localStorage.getItem("availableHunts") || "[]",
          );
          cachedHunts.push(data[0]);
          localStorage.setItem("availableHunts", JSON.stringify(cachedHunts));

          router.push(
            `/hunt-details?huntId=${data[0].id}&pokemonId=${selectedPokemon.pokemon_id}`,
          );
        }
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      className="rounded bg-white p-4 text-lg font-semibold text-black disabled:bg-gray-500 disabled:text-gray-400"
      onClick={handleClick}
      disabled={!selectedPokemon.name}
    >
      New hunt
    </button>
  );
};

export default AddHuntButton;
