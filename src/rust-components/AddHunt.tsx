"use client";

import supabase from "@/utils/supabase";
import { invoke } from "@tauri-apps/api/tauri";

import { RustFunctions } from "./enums";

const AddHuntButton = () => {
  const handleClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      if (user && session) {
        await invoke<string>(RustFunctions.AddHunt, {
          userId: user.id,
          pokemonId: "5",
          accessToken: session.access_token,
        });
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      className="rounded bg-white p-4 text-lg font-semibold text-black"
      onClick={handleClick}
    >
      Click to create a new hunt!
    </button>
  );
};

export default AddHuntButton;
