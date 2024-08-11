import { useCountStore } from "@/store/countStore";
import { Hunt } from "@/types/interfaces";

import { useRouter } from "next/navigation";

import Count from "@/rust-components/Count";
import PokemonDetails from "@/rust-components/PokemonDetails";

const HuntCard = ({ hunt }: { hunt: Hunt }) => {
  const router = useRouter();
  const { setIncrementKeybind, setDecrementKeybind } = useCountStore();

  return (
    <div
      className="flex max-w-[400px] cursor-pointer flex-col items-center rounded bg-white p-4"
      onClick={() => {
        setIncrementKeybind(hunt.increment_keybind);
        setDecrementKeybind(hunt.decrement_keybind);

        router.push(
          `/hunt-details?huntId=${hunt.id}&pokemonId=${hunt.pokemon_id}&initial_count=${hunt.count}&name=${hunt.pokemon_name}&sprite=${hunt.pokemon_sprite}`,
        );
      }}
    >
      <PokemonDetails name={hunt.pokemon_name} sprite={hunt.pokemon_sprite} />
      {/* <Count count={hunt.count} huntId={hunt.id} /> */}
    </div>
  );
};

export default HuntCard;
