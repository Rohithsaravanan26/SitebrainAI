import io

def test_list_vision_models(client):
    # 1. Register & Login to get token
    client.post("/api/v1/auth/register", json={
        "email": "vision.engineer@sitebrain.ai",
        "password": "VisionPassword123!",
        "full_name": "Vision Engineer",
        "role": "SITE_ENGINEER"
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "vision.engineer@sitebrain.ai",
        "password": "VisionPassword123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. List Models
    models_res = client.get("/api/v1/vision/models", headers=headers)
    assert models_res.status_code == 200
    models_data = models_res.json()
    assert len(models_data) > 0
    assert models_data[0]["name"] == "SiteBrain-Vision-Progress"
    assert models_data[0]["version"] == "v1.2.0-yolov8x"

def test_upload_and_predict_flow(client):
    # 1. Login
    client.post("/api/v1/auth/register", json={
        "email": "cv.user@sitebrain.ai",
        "password": "SecurePassword123!",
        "full_name": "CV User",
        "role": "SUPERVISOR"
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "cv.user@sitebrain.ai",
        "password": "SecurePassword123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create Dummy Image Bytes
    image_content = b"fake-image-bytes-header-for-sitebrain-cv-testing"
    file_payload = {
        "file": ("site_progress_lvl14.jpg", io.BytesIO(image_content), "image/jpeg")
    }

    # 3. Upload Image
    upload_res = client.post("/api/v1/vision/upload", files=file_payload, headers=headers)
    assert upload_res.status_code == 202
    job_data = upload_res.json()
    job_id = job_data["id"]
    assert job_id is not None
    assert job_data["filename"] == "site_progress_lvl14.jpg"

    # 4. Fetch Job Result directly (worker processes background task)
    result_res = client.get(f"/api/v1/vision/jobs/{job_id}/result", headers=headers)
    assert result_res.status_code == 200
    pred_data = result_res.json()
    assert pred_data["model_name"] == "SiteBrain-Vision-Progress"
    assert pred_data["model_version"] == "v1.2.0-yolov8x"
    assert pred_data["confidence_score"] >= 0.80
    assert pred_data["estimated_progress"] > 0
    assert len(pred_data["detected_classes"]) > 0

    # 5. Fetch Prediction History List
    history_res = client.get("/api/v1/vision/jobs", headers=headers)
    assert history_res.status_code == 200
    assert len(history_res.json()) >= 1
