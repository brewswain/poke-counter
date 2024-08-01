// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use dotenv;

mod supabase_client;
use supabase_client::initialize_client;

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

// #[tauri::command]
// async fn add_new_hunt(user_id: &str) -> Result<T, E> {}
fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![supabase_test])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
