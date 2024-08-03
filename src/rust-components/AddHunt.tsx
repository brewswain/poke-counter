"use client";

import { invoke } from "@tauri-apps/api/tauri";
import { RustFunctions } from "./enums";
import supabase from "@/utils/supabase";

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
      className="bg-white text-black text-lg font-semibold rounded p-4"
      onClick={handleClick}
    >
      Click to create a new hunt!
    </button>
  );
};

export default AddHuntButton;
