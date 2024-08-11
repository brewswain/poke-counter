"use client";

const PokemonDetails = ({ name, sprite }: { name: string; sprite: string }) => {
  return (
    <>
      <div className="flex items-center justify-center">
        <img src={sprite} alt="" className="" />
        <h1 className="text-2xl text-black">{name}</h1>
      </div>
    </>
  );
};

export default PokemonDetails;
