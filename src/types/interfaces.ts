export interface Hunt {
  count: number;
  created_at: string;
  id: string;
  is_successful: boolean;
  pokemon_id: number;
  updated_at: string;
  user_id: string;
  increment_keybind: string[];
  decrement_keybind: string[];
  pokemon_name: string;
  pokemon_sprite: string;
}

export interface CountChangeProps {
  huntId: string;
}

export interface SearchPokemon {
  name: string;
  sprite: string;
  pokemon_id: string;
}
