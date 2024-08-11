import { Hunt } from "@/types/interfaces";

import { useRouter } from "next/navigation";

import Count from "@/rust-components/Count";
import PokemonDetails from "@/rust-components/PokemonDetails";

const HuntCard = ({ hunt }: { hunt: Hunt }) => {
  console.log({ hunt });
  const router = useRouter();

  const encodedIncrementKeybind = encodeURIComponent(
    JSON.stringify(hunt.increment_keybind),
  );
  const encodedDecrementKeybind = encodeURIComponent(
    JSON.stringify(hunt.decrement_keybind),
  );
  return (
    <div
      className="flex max-w-[400px] cursor-pointer flex-col items-center rounded bg-white p-4"
      onClick={() =>
        router.push(
          `/hunt-details?huntId=${hunt.id}&pokemonId=${hunt.pokemon_id}&initial_count=${hunt.count}&incrementkeybind=${encodedIncrementKeybind}&decrementkeybind=${encodedDecrementKeybind}`,
        )
      }
    >
      <PokemonDetails pokemonId={hunt.pokemon_id.toString()} />
      <Count huntId={hunt.id} />
    </div>
  );
};

export default HuntCard;
