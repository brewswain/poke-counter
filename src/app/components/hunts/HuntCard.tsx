import Count from "@/app/rust-components/Count";
import PokemonDetails from "@/app/rust-components/PokemonDetails";
import { Hunt } from "@/app/types/interfaces";
import { useRouter } from "next/navigation";

const HuntCard = ({ hunt }: { hunt: Hunt }) => {
  const router = useRouter();

  return (
    <div
      className="p-4 flex flex-col items-center bg-white rounded max-w-[400px] cursor-pointer"
      onClick={() =>
        router.push(
          `/hunt-details?huntId=${hunt.id}&pokemonId=${hunt.pokemon_id}&initial_count=${hunt.count}`
        )
      }
    >
      <PokemonDetails pokemonId={hunt.pokemon_id.toString()} />
      <Count initial_count={hunt.count} huntId={hunt.id} />
    </div>
  );
};

export default HuntCard;
