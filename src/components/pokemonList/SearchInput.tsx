import { useSearchStore } from "@/store/searchStore";
import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

export const SearchInput: React.FC = () => {
  const { searchQuery, setSearchQuery, clearSearchQuery } = useSearchStore();

  return (
    <div className="relative p-2">
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 transform" />
      <input
        className="w-full pl-8 pr-8 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-950"
        placeholder="Search for pokémon"
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
      />
      {searchQuery.length > 0 && (
        <Cross1Icon
          className="absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer"
          onClick={clearSearchQuery}
        />
      )}
    </div>
  );
};
