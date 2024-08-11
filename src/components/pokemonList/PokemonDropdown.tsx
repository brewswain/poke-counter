"use client";

import { useSearchStore } from "@/store/searchStore";
import { SearchPokemon } from "@/types/interfaces";
import Fuse from "fuse.js";
import { FixedSizeList as List } from "react-window";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { SearchInput } from "./SearchInput";

const PokemonDropdown = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    searchQuery,
    setSearchQuery,
    pokemonList,
    addSelectedPokemon,
    selectedPokemon,
    filteredResults,
    setFilteredResults,
    fuse,
    setFuse,
  } = useSearchStore();

  useEffect(() => {
    if (pokemonList.length > 0 && !fuse) {
      const fuseOptions = {
        keys: ["name"],
        threshold: 0.3,
      };
      setFuse(new Fuse(pokemonList, fuseOptions));
    }
  }, [pokemonList, fuse, setFuse]);

  useEffect(() => {
    if (fuse && searchQuery) {
      const results = fuse.search(searchQuery);
      setFilteredResults(results.map((result) => result.item));
    } else {
      setFilteredResults(pokemonList);
    }
  }, [searchQuery, fuse, pokemonList, setFilteredResults]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchQuery]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePokemonSelect = useCallback(
    (pokemon: SearchPokemon) => {
      setSearchQuery(pokemon.name);
      addSelectedPokemon(pokemon);
      setIsOpen(false);
    },
    [setSearchQuery, addSelectedPokemon],
  );

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const pokemon = filteredResults[index];
      return (
        <li
          style={style}
          className="px-3 py-2 hover:bg-slate-100 list-none cursor-pointer capitalize"
          onClick={() => handlePokemonSelect(pokemon)}
        >
          {pokemon.name}
        </li>
      );
    },
    [filteredResults, handlePokemonSelect],
  );

  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`PokemonDropdown rendered ${renderCount.current} times`);
  });

  return (
    <div className="relative w-[280px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 flex justify-between items-center"
      >
        <span className="capitalize">
          {selectedPokemon.name || "Choose your pokémon"}
        </span>
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
            fillRule="evenodd"
          ></path>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
          <SearchInput />
          <List
            height={200}
            itemCount={filteredResults.length}
            itemSize={35}
            width="100%"
          >
            {Row}
          </List>
        </div>
      )}
    </div>
  );
};

export default PokemonDropdown;
