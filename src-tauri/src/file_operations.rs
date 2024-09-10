use serde_json::Value;
use std::fs;

pub fn read_json_file(path: &str) -> Result<Value, String> {
    let contents = fs::read_to_string(path).map_err(|e| e.to_string())?;
    serde_json::from_str(&contents).map_err(|e| e.to_string())
}

pub fn write_json_file(path: &str, data: &Value) -> Result<(), String> {
    let json_string = serde_json::to_string_pretty(data).map_err(|e| e.to_string())?;
    fs::write(path, json_string).map_err(|e| e.to_string())
}

pub fn ensure_directory(path: &str) -> Result<(), String> {
    fs::create_dir_all(path).map_err(|e| e.to_string())
}
