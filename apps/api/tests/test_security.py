from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
)

def test_password_hashing():
    password = "SuperSecretPassword123!"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False

def test_jwt_access_token():
    user_id = "test-user-uuid-1234"
    role = "ADMIN"
    token = create_access_token(subject=user_id, role=role)
    payload = decode_token(token)
    assert payload is not None
    assert payload.get("sub") == user_id
    assert payload.get("role") == role
    assert payload.get("type") == "access"

def test_jwt_refresh_token():
    user_id = "test-user-uuid-5678"
    token = create_refresh_token(subject=user_id)
    payload = decode_token(token)
    assert payload is not None
    assert payload.get("sub") == user_id
    assert payload.get("type") == "refresh"
