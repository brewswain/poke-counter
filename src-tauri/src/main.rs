// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use dotenv;
use serde_json::json;
use tauri_plugin_oauth;
mod supabase_client;
use supabase_client::initialize_client;

// TODO: Create function to dump count to text file.

#[tauri::command]
async fn supabase_test() -> Result<String, String> {
    dotenv::dotenv().ok();

    let client = initialize_client();
    let response = client
        .from("test")
        .select("*")
        .execute().await
        .map_err(|e| e.to_string())?;

    let body = response.text().await.map_err(|e| e.to_string())?;

    Ok(body)
}

#[tauri::command]
async fn get_pokemon_list() -> Result<String, String> {
    let client = initialize_client();

    let response = client
        .from("pokemon")
        .select("name, sprites")
        .execute().await
        .map_err(|e| e.to_string())?;

    let body = response.text().await.map_err(|e| e.to_string())?;

    let parsed: Vec<serde_json::Value> = serde_json::from_str(&body).map_err(|e| e.to_string())?;

    let formatted_list: Vec<serde_json::Value> = parsed
        .into_iter()
        .map(|pokemon| {
            let name = pokemon["name"].as_str().unwrap_or("Unknown");
            let sprites = &pokemon["sprites"];
            let chosen_sprite = sprites["front_default"].as_str().unwrap_or("");

            json!({
            "name": name,
            "sprite": chosen_sprite
        })
        })
        .collect();

    Ok(serde_json::to_string(&formatted_list).map_err(|e| e.to_string())?)
}

#[tauri::command]
async fn get_pokemon(pokedex_id: &str) -> Result<String, String> {
    let client = initialize_client();

    let response = client
        .from("pokemon")
        .select("name, sprites")
        .eq("pokedex_id", pokedex_id)
        .single()
        .execute().await
        .map_err(|e| e.to_string())?;

    let body = response.text().await.map_err(|e| e.to_string())?;

    let pokemon: serde_json::Value = serde_json::from_str(&body).map_err(|e| e.to_string())?;

    let name = pokemon["name"].as_str().unwrap_or("Unknown");
    let sprites = &pokemon["sprites"];
    let chosen_sprite = sprites["front_default"].as_str().unwrap_or("");

    let formatted_pokemon = json!({
        "name": name,
        "sprite": chosen_sprite
    });

    Ok(serde_json::to_string(&formatted_pokemon).map_err(|e| e.to_string())?)
}

#[tauri::command]
async fn add_new_hunt(
    user_id: &str,
    pokemon_id: &str,
    access_token: &str
) -> Result<String, String> {
    let client = initialize_client();

    let json_value =
        json!({
        "user_id": user_id,
        "pokemon_id": pokemon_id,
        "count": 0,
        "is_successful": false
    });
    let json_string = json_value.to_string();

    let response = client
        .from("hunts")
        .auth(access_token)
        .insert(json_string)
        .execute().await
        .map_err(|e| e.to_string())?;

    let body = response.text().await.map_err(|e| e.to_string())?;

    Ok(body)
}

#[tauri::command]
async fn get_current_count(hunt_id: &str) -> Result<String, String> {
    let client = initialize_client();

    let count = client
        .from("hunts")
        .select("count")
        .eq("id", hunt_id)
        .execute().await
        .map_err(|e| e.to_string())?;

    let body = count.text().await.map_err(|e| e.to_string())?;

    Ok(body)
}

#[tauri::command]
async fn update_count(hunt_id: &str, count: &str, increment: bool) -> Result<String, String> {
    let client = initialize_client();

    let mut existing_count: i32 = client
        .from("hunts")
        .select("count")
        .eq("id", hunt_id)
        .execute().await
        .map_err(|e| e.to_string())?
        .text().await
        .map_err(|e| e.to_string())?
        .parse::<serde_json::Value>()
        .map_err(|e| e.to_string())?
        .as_array()
        .and_then(|arr| arr.first())
        .and_then(|obj| obj.get("count"))
        .and_then(|count| count.as_i64())
        .map(|count| count as i32)
        .unwrap_or(0);

    let parsed_count = count.parse::<i32>().expect("Failed to parse string to integer");

    existing_count = if increment {
        existing_count + parsed_count
    } else {
        existing_count - parsed_count
    };

    let json_value = json!({
        "count": existing_count
    });
    let json_string = json_value.to_string();

    let response = client
        .from("hunts")
        .update(json_string)
        .eq("id", hunt_id)
        .execute().await
        .map_err(|e| e.to_string())?;

    let body = response.text().await.map_err(|e| e.to_string())?;

    Ok(body)
}

fn main() {
    tauri::Builder
        ::default()
        .plugin(tauri_plugin_oauth::init())
        .invoke_handler(
            tauri::generate_handler![
                supabase_test,
                add_new_hunt,
                get_current_count,
                update_count,
                get_pokemon_list,
                get_pokemon
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
