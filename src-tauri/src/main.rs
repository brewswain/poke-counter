// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use chrono::Utc;
use dotenv;
use serde_json::json;
use tauri_plugin_oauth;
use tokio;
use uuid::Uuid;

mod supabase_client;
use supabase_client::initialize_client;
mod file_operations;
use file_operations::{ensure_directory, read_json_file, write_json_file};

// TODO: Create function to dump count to text file.

#[tauri::command]
async fn supabase_test() -> Result<String, String> {
    dotenv::dotenv().ok();

    let client = initialize_client();
    let response = client
        .from("test")
        .select("*")
        .execute()
        .await
        .map_err(|e| e.to_string())?;

    let body = response.text().await.map_err(|e| e.to_string())?;

    Ok(body)
}

#[tauri::command]
async fn get_pokemon_list() -> Result<String, String> {
    let file_path = "pokemon_list.json";

    // potential problem area?
    if let Ok(data) = read_json_file(file_path) {
        return Ok(serde_json::to_string(&data).unwrap());
    }

    let client = initialize_client();

    let response = client
        .from("pokemon")
        .select("pokemon_id, name, sprites")
        .execute()
        .await
        .map_err(|e| e.to_string())?;

    let body = response.text().await.map_err(|e| e.to_string())?;

    let parsed: Vec<serde_json::Value> = serde_json::from_str(&body).map_err(|e| e.to_string())?;

    // let body = response.text().await.map_err(|e| e.to_string())?;
    // println!("Raw response from Supabase: {}", body);

    // let parsed: Vec<serde_json::Value> = serde_json::from_str(&body).map_err(|e| e.to_string())?;
    // println!("Parsed response: {:?}", parsed);

    let mut formatted_list: Vec<serde_json::Value> = parsed
        .into_iter()
        .map(|pokemon| {
            let pokemon_id = pokemon["pokemon_id"]
                .as_i64()
                .map(|id| id.to_string())
                .unwrap_or_else(|| "Unknown".to_string());
            let name = pokemon["name"].as_str().unwrap_or("Unknown");
            let sprites = &pokemon["sprites"];
            let chosen_sprite = sprites["front_default"].as_str().unwrap_or("");

            json!({
                "pokemon_id": pokemon_id,
                "name": name,
                "sprite": chosen_sprite
            })
        })
        .collect();

    formatted_list.sort_by(|a, b| {
        let name_a = a["name"].as_str().unwrap_or("").to_lowercase();
        let name_b = b["name"].as_str().unwrap_or("").to_lowercase();
        name_a.cmp(&name_b)
    });

    // let result = serde_json::to_string(&formatted_list).map_err(|e| e.to_string())?;
    // println!("Formatted list: {}", result);
    // Ok(result)

    // let result = serde_json::to_string(&formatted_list).map_err(|e| e.to_string())?;
    // Ok(result)
    let result = serde_json::to_string(&formatted_list).map_err(|e| e.to_string())?;
    // println!("Final formatted result: {}", result);
    Ok(result)
}

#[tauri::command]
async fn get_pokemon(pokemon_id: &str) -> Result<String, String> {
    let client = initialize_client();

    let response = client
        .from("pokemon")
        .select("name, sprites")
        .eq("pokemon_id", pokemon_id)
        .single()
        .execute()
        .await
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
async fn update_hunt_keybinds(
    hunt_id: &str,
    increment_keybind: Vec<String>,
    decrement_keybind: Vec<String>,
    access_token: &str,
) -> Result<String, String> {
    let client = initialize_client();

    let json_value = json!({
        "increment_keybind": increment_keybind,
        "decrement_keybind": decrement_keybind
    });
    let json_string = json_value.to_string();

    let response = client
        .from("hunts")
        .auth(access_token)
        .update(json_string)
        .eq("id", hunt_id)
        .execute()
        .await
        .map_err(|e| e.to_string())?;

    let body = response.text().await.map_err(|e| e.to_string())?;

    Ok(body)
}

#[tauri::command]
async fn get_available_hunts(access_token: &str) -> Result<String, String> {
    let client = initialize_client();

    let response = client
        .from("hunts")
        .auth(access_token)
        .select("*, pokemon(name, sprites)")
        .execute()
        .await
        .map_err(|e| e.to_string())?;

    let body = response.text().await.map_err(|e| e.to_string())?;

    let parsed: Vec<serde_json::Value> = serde_json::from_str(&body).map_err(|e| e.to_string())?;

    let formatted_hunts: Vec<serde_json::Value> = parsed
        .into_iter()
        .map(|hunt| {
            let pokemon = hunt["pokemon"].as_object().unwrap();
            let sprites = &pokemon["sprites"];
            let chosen_sprite = sprites["front_default"].as_str().unwrap_or("");

            json!({
                "id": hunt["id"],
                "user_id": hunt["user_id"],
                "pokemon_id": hunt["pokemon_id"],
                "count": hunt["count"],
                "is_successful": hunt["is_successful"],
                "created_at": hunt["created_at"],
                "updated_at": hunt["updated_at"],
                "increment_keybind": hunt["increment_keybind"],
                "decrement_keybind": hunt["decrement_keybind"],
                "pokemon_name": pokemon["name"],
                "pokemon_sprite": chosen_sprite
            })
        })
        .collect();

    Ok(serde_json::to_string(&formatted_hunts).map_err(|e| e.to_string())?)
}

#[tauri::command]
async fn add_new_hunt(
    user_id: &str,
    pokemon_id: &str,
    access_token: &str,
    name: &str,
    sprite: &str
) -> Result<String, String> {
    let client = initialize_client();
    let hunt_id = Uuid::new_v4().to_string();
    let file_path = format!("hunts/{}.json", hunt_id);
    let new_hunt = json!({
        "id": hunt_id,
        "user_id": user_id,
        "name": name,
        "sprite": sprite,
        "pokemon_id": pokemon_id.parse::<i32>().unwrap_or(0),
        "count": 0,
        "is_successful": null,
        "created_at": Utc::now().to_rfc3339(),
        "updated_at": Utc::now().to_rfc3339(),
        "increment_amount": 1,
        "increment_keybind": ["ArrowUp"],
        "decrement_keybind": ["ArrowDown"]
    });

    // Write the new hunt data to a local file
    write_json_file(&file_path, &new_hunt)?;

    // Clone access_token and new_hunt for use in the async closure
    let access_token = access_token.to_string();


    let hunt_supabase_payload = json!({
        "id": hunt_id,
        "user_id": user_id,
        "pokemon_id": pokemon_id.parse::<i32>().unwrap_or(0),
        "count": 0,
        "is_successful": null,
        "created_at": Utc::now().to_rfc3339(),
        "updated_at": Utc::now().to_rfc3339(),
        "increment_keybind": ["ArrowUp"],
        "decrement_keybind": ["ArrowDown"]
    }).to_string();

    // // Asynchronously add the hunt to Supabase
    // tokio::spawn(async move {
    //     let _ = client
    //         .from("hunts")
    //         .auth(&access_token)
    //         .insert(new_hunt_clone.to_string())
    //         .execute()
    //         .await;
    // });

    // Ok(serde_json::to_string(&new_hunt).map_err(|e| e.to_string())?)

        let response = client
        .from("hunts")
        .auth(access_token)
        .insert(hunt_supabase_payload)
        .execute()
        .await
        .map_err(|e| e.to_string())?;

    let body = response.text().await.map_err(|e| e.to_string())?;

    Ok(body)

    // let json_value = json!({
    //     "user_id": user_id,
    //     "pokemon_id": pokemon_id,
    //     "count": 0,
    //     "is_successful": false
    // });
    // let json_string = json_value.to_string();

    // let response = client
    //     .from("hunts")
    //     .auth(access_token)
    //     .insert(json_string)
    //     .execute()
    //     .await
    //     .map_err(|e| e.to_string())?;

    // let body = response.text().await.map_err(|e| e.to_string())?;

    // Ok(body)
}

#[tauri::command]
async fn get_current_count(hunt_id: &str, access_token: &str) -> Result<String, String> {
    let client = initialize_client();

    let count = client
        .from("hunts")
        .auth(access_token)
        .select("count")
        .eq("id", hunt_id)
        .execute()
        .await
        .map_err(|e| e.to_string())?;

    let body = count.text().await.map_err(|e| e.to_string())?;

    Ok(body)
}

#[tauri::command]
async fn update_count(
    hunt_id: &str,
    count: &str,
    increment: bool,
    access_token: &str,
) -> Result<String, String> {
    let client = initialize_client();

    let mut existing_count: i32 = client
        .from("hunts")
        .auth(access_token)
        .select("count")
        .eq("id", hunt_id)
        .execute()
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?
        .parse::<serde_json::Value>()
        .map_err(|e| e.to_string())?
        .as_array()
        .and_then(|arr| arr.first())
        .and_then(|obj| obj.get("count"))
        .and_then(|count| count.as_i64())
        .map(|count| count as i32)
        .unwrap_or(0);

    let parsed_count = count
        .parse::<i32>()
        .expect("Failed to parse string to integer");

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
        .auth(access_token)
        .update(json_string)
        .eq("id", hunt_id)
        .execute()
        .await
        .map_err(|e| e.to_string())?;

    let body = response.text().await.map_err(|e| e.to_string())?;

    Ok(body)
}

fn main() {
    ensure_directory("hunts").expect("Failed to create hunts directory");

    tauri::Builder::default()
        .plugin(tauri_plugin_oauth::init())
        .invoke_handler(tauri::generate_handler![
            supabase_test,
            add_new_hunt,
            get_current_count,
            update_hunt_keybinds,
            get_available_hunts,
            update_count,
            get_pokemon_list,
            get_pokemon
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
