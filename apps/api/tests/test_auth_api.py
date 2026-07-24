def test_register_and_login(client):
    # 1. Register User
    payload = {
        "email": "site.engineer@sitebrain.ai",
        "password": "SecurePassword123!",
        "full_name": "John Site Engineer",
        "role": "SITE_ENGINEER"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["message"] == "Registration successful. Please verify your email."
    verification_token = res_data["token"]
    assert verification_token is not None

    # 2. Verify Email
    verify_res = client.post("/api/v1/auth/verify-email", json={"token": verification_token})
    assert verify_res.status_code == 200

    # 3. Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": "site.engineer@sitebrain.ai",
        "password": "SecurePassword123!"
    })
    assert login_res.status_code == 200
    auth_data = login_res.json()
    assert "access_token" in auth_data
    assert "refresh_token" in auth_data
    assert auth_data["user"]["email"] == "site.engineer@sitebrain.ai"
    assert auth_data["user"]["role"] == "SITE_ENGINEER"
    assert auth_data["user"]["is_verified"] is True

    # 4. Fetch Me Profile
    access_token = auth_data["access_token"]
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {access_token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "site.engineer@sitebrain.ai"

    # 5. Refresh Token
    refresh_token = auth_data["refresh_token"]
    refresh_res = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_res.status_code == 200
    new_auth_data = refresh_res.json()
    assert "access_token" in new_auth_data

    # 6. Logout
    logout_res = client.post("/api/v1/auth/logout", json={"refresh_token": new_auth_data["refresh_token"]})
    assert logout_res.status_code == 200

def test_forgot_and_reset_password(client):
    # Register user first
    client.post("/api/v1/auth/register", json={
        "email": "supervisor@sitebrain.ai",
        "password": "OldPassword123!",
        "full_name": "Jane Supervisor",
        "role": "SUPERVISOR"
    })

    # Forgot password
    forgot_res = client.post("/api/v1/auth/forgot-password", json={"email": "supervisor@sitebrain.ai"})
    assert forgot_res.status_code == 200
    reset_token = forgot_res.json()["token"]
    assert reset_token is not None

    # Reset password
    reset_res = client.post("/api/v1/auth/reset-password", json={
        "token": reset_token,
        "new_password": "NewSuperPassword456!"
    })
    assert reset_res.status_code == 200

    # Login with new password
    login_res = client.post("/api/v1/auth/login", json={
        "email": "supervisor@sitebrain.ai",
        "password": "NewSuperPassword456!"
    })
    assert login_res.status_code == 200
