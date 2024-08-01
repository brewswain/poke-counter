use jsonwebtoken::{ encode, Header, EncodingKey, Algorithm };
use serde::{ Serialize, Deserialize };
use chrono;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

pub fn generate_jwt(secret: &str) -> String {
    let expiration = chrono::Utc
        ::now()
        .checked_add_signed(chrono::Duration::minutes(60))
        .expect("valid timestamp")
        .timestamp();

    let claims = Claims {
        sub: "user123".to_owned(),
        exp: expiration as usize,
    };

    let header = Header::new(Algorithm::HS256);
    encode(&header, &claims, &EncodingKey::from_secret(secret.as_bytes())).unwrap()
}
