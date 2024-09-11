# Poke-Counter

A (WIP and incomplete) Next.js project with Tauri integration for desktop application usage, for counting and managing Pokémon.

## Features

- Search functionality for Pokémon
- JWT authentication
- Supabase integration
- Tauri-based desktop application

## Getting Started

To run the development server:

```bash
pnpm dev
```
Open http://localhost:3000 in your browser to see the result.

## Project Structure
- `src/`: Contains the Next.js frontend code
- `src-tauri/`: Contains the Tauri backend code
- `src/components/`: React components, including the SearchInput for Pokémon
- `src-tauri/src/supabase_client/`: Supabase client integration

## Technologies Used
-Next.js
-Tauri
-Rust
-TypeScript
-Supabase
-JWT for authentication
