import AddHuntButton from "./rust-components/AddHunt";
import DecrementCountButton from "./rust-components/DecrementCountButton";
import IncrementCountButton from "./rust-components/IncrementCountButton";
import PokemonDetails from "./rust-components/PokemonDetails";
import Test from "./rust-components/test";

export default function Home() {
  return (
    <main>
      <PokemonDetails />
      <Test />
      <AddHuntButton />
      <IncrementCountButton />
      <DecrementCountButton />
    </main>
  );
}
