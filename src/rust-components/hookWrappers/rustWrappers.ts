import { useRust } from "@/hooks/useRust";

import { RustFunctions } from "../enums";

export const useAddHunt = () => {
  const addHunt = useRust(RustFunctions.AddHunt);
  return ({
    userId,
    pokemonId,
    accessToken,
  }: {
    userId: string;
    pokemonId: string;
    accessToken: string;
  }) => addHunt({ userId, pokemonId, accessToken });
};

export const useGetAvailableHunts = () => {
  const getHunts = useRust(RustFunctions.GetAvailableHunts);
  return ({ accessToken }: { accessToken: string }) =>
    getHunts({ accessToken });
};

export const useGetCount = () => {
  const getCount = useRust(RustFunctions.GetCount);
  return ({ huntId, accessToken }: { huntId: string; accessToken: string }) =>
    getCount({ huntId, accessToken });
};

export const useDecrementCount = () => {
  const decrementCount = useRust(RustFunctions.UpdateCount);
  return ({
    huntId,
    accessToken,
    count,
  }: {
    huntId: string;
    accessToken: string;
    count: string;
  }) => decrementCount({ huntId, count, accessToken, increment: false });
};

export const useIncrementCount = () => {
  const incrementCount = useRust(RustFunctions.UpdateCount);
  return ({
    huntId,
    accessToken,
    count,
  }: {
    huntId: string;
    accessToken: string;
    count: string;
  }) => incrementCount({ huntId, count, accessToken, increment: true });
};

export const useGetPokemonList = () => {
  const getPokemonList = useRust(RustFunctions.GetPokemonList);
  return async () => {
    const result = await getPokemonList();
    return result;
  };
};

export const useGetPokemonDetails = () => {
  const getPokemonDetails = useRust(RustFunctions.GetPokemon);

  return ({ pokemonId }: { pokemonId: string }) =>
    getPokemonDetails({ pokemonId });
};

export const useUpdateHuntKeybinds = () => {
  const updateHuntKeybinds = useRust(RustFunctions.UpdateHuntKeybinds);

  return ({
    huntId,
    accessToken,
    incrementKeybind,
    decrementKeybind,
  }: {
    huntId: string;
    accessToken: string;
    incrementKeybind: string[];
    decrementKeybind: string[];
  }) => {
    updateHuntKeybinds({
      huntId,
      incrementKeybind,
      decrementKeybind,
      accessToken,
    });
  };
};
