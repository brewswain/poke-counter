import { invoke } from "@tauri-apps/api/tauri";

import { RustFunctions } from "@/rust-components/enums";

type RustFunctionReturnTypes = {
  [K in RustFunctions]: any; // Replace 'any' with specific return types if known
  // Demo types, sort this out later
  //   [RustFunctions.GetAvailableHunts]: Hunt[];
  //   [RustFunctions.AddHunt]: Hunt;
  //   [RustFunctions.Test]: string;
  //   [RustFunctions.GetCount]: number;
  //   [RustFunctions.UpdateCount]: number;
  //   [RustFunctions.GetPokemonList]: SearchPokemon[];
  //   [RustFunctions.GetPokemon]: SearchPokemon;
};

type RustFunctionArgs<T extends RustFunctions> = Parameters<typeof invoke>[1];

export function useRust<T extends RustFunctions>(functionName: T) {
  return async (args?: RustFunctionArgs<T>) => {
    const result = await invoke<string>(functionName, args);
    return JSON.parse(result);
  };
}
