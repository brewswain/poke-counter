import SignOut from "@/components/auth/SignOut";
import PokemonDropdown from "@/components/pokemonList/PokemonDropdown";

import AvailableHunts from "@/rust-components/AvailableHunts";

const HuntsList = () => {
  return (
    <main className="min-h-dvh bg-slate-500 px-4">
      <div className="flex w-full justify-center">
        <SignOut />
      </div>

      <PokemonDropdown />
      <AvailableHunts />
    </main>
  );
};

export default HuntsList;
