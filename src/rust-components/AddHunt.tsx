"use client";

import { useSearchStore } from "@/store/searchStore";
import supabase from "@/utils/supabase";
import { invoke } from "@tauri-apps/api/tauri";

import { useRouter } from "next/navigation";

import { RustFunctions } from "./enums";

const AddHuntButton = () => {
  const { selectedPokemon } = useSearchStore();

  const router = useRouter();
  const handleClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      if (user && session) {
        const res = await invoke<string>(RustFunctions.AddHunt, {
          userId: user.id,
          pokemonId: selectedPokemon.pokemon_id,
          accessToken: session.access_token,
        });

        const data = JSON.parse(res);
        console.log(data);
        if (data[0].id) {
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
