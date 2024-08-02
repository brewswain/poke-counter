import IncrementAmount from "./components/IncrementAmount";
import AddHuntButton from "./rust-components/AddHunt";
import Count from "./rust-components/Count";
import DecrementCountButton from "./rust-components/DecrementCountButton";
import IncrementCountButton from "./rust-components/IncrementCountButton";
import PokemonDetails from "./rust-components/PokemonDetails";
import Test from "./rust-components/test";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-4 bg-gray-900 min-h-dvh">
      <PokemonDetails />

      <Count />
      <AddHuntButton />
      <IncrementAmount />
      <section className="flex gap-2">
        <IncrementCountButton />
        <DecrementCountButton />
      </section>
    </main>
  );
}
