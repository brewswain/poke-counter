use postgrest::Postgrest;
use dotenv;

mod jwt_utils;
use jwt_utils::generate_jwt;

pub fn initialize_client() -> Postgrest {
    dotenv::dotenv().ok();

    let jwt_secret = dotenv::var("JWT_SECRET").unwrap();
    let jwt = generate_jwt(&jwt_secret);

    Postgrest::new(dotenv::var("SUPABASE_URL").unwrap())
        .insert_header("apikey", dotenv::var("SUPABASE_ANON_KEY").unwrap())
        .insert_header("Authorization", format!("Bearer {}", jwt))
}
