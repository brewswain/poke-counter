"use client";

import { invoke } from "@tauri-apps/api/tauri";
import { RustFunctions } from "./enums";

const AddHuntButton = () => {
  const handleClick = async () => {
    try {
      await invoke<string>(RustFunctions.AddHunt, {
        userId: "814acd2f-e7d0-474e-a956-91dc334b748f",
        pokemonId: "246",
      });
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
