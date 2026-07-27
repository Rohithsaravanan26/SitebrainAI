from datetime import datetime, timezone, timedelta

def test_complete_projects_workflow(client):
    # 1. Register Admin User
    client.post("/api/v1/auth/register", json={
        "email": "pm.full@sitebrain.ai",
        "password": "FullPassword123!",
        "full_name": "Project Full Director",
        "role": "PROJECT_MANAGER"
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "pm.full@sitebrain.ai",
        "password": "FullPassword123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    start_date = datetime.now(timezone.utc).isoformat()
    end_date = (datetime.now(timezone.utc) + timedelta(days=365)).isoformat()

    # 2. Create Project
    create_res = client.post("/api/v1/projects", json={
        "code": "WST-MTR",
        "name": "Westfield Metro Station Underground",
        "location": "Parramatta",
        "start_date": start_date,
        "end_date": end_date,
        "budget": 82000000.0
    }, headers=headers)
    assert create_res.status_code == 201
    project_id = create_res.json()["id"]

    # 3. List Paginated Projects
    page_res = client.get("/api/v1/projects?page=1&limit=5", headers=headers)
    assert page_res.status_code == 200
    page_data = page_res.json()
    assert "items" in page_data
    assert "total" in page_data
    assert "page" in page_data

    # 4. Create Milestone Timeline
    milestone_res = client.post(f"/api/v1/projects/{project_id}/timeline", json={
        "name": "Diaphragm Wall Excavation",
        "target_date": (datetime.now(timezone.utc) + timedelta(days=60)).isoformat(),
        "status": "IN_PROGRESS",
        "progress_percent": 45.0
    }, headers=headers)
    assert milestone_res.status_code == 201

    timeline_res = client.get(f"/api/v1/projects/{project_id}/timeline", headers=headers)
    assert timeline_res.status_code == 200
    assert len(timeline_res.json()) >= 1

    # 5. Update Settings
    settings_res = client.patch(f"/api/v1/projects/{project_id}/settings", json={
        "name": "Westfield Metro Station Expansion",
        "budget": 85000000.0,
        "progress_percent": 42.0
    }, headers=headers)
    assert settings_res.status_code == 200
    assert settings_res.json()["name"] == "Westfield Metro Station Expansion"
    assert settings_res.json()["budget"] == 85000000.0
