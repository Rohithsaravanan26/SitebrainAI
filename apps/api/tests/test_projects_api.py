from datetime import datetime, timezone, timedelta

def test_project_crud_and_rbac(client):
    # 1. Register Admin User
    client.post("/api/v1/auth/register", json={
        "email": "pm.admin@sitebrain.ai",
        "password": "AdminPassword123!",
        "full_name": "Project Admin",
        "role": "PROJECT_MANAGER"
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "pm.admin@sitebrain.ai",
        "password": "AdminPassword123!"
    })
    pm_token = login_res.json()["access_token"]
    pm_headers = {"Authorization": f"Bearer {pm_token}"}

    # 2. Register Worker User (Restricted)
    client.post("/api/v1/auth/register", json={
        "email": "site.worker@sitebrain.ai",
        "password": "WorkerPassword123!",
        "full_name": "Site Worker",
        "role": "WORKER"
    })
    worker_login = client.post("/api/v1/auth/login", json={
        "email": "site.worker@sitebrain.ai",
        "password": "WorkerPassword123!"
    })
    worker_token = worker_login.json()["access_token"]
    worker_headers = {"Authorization": f"Bearer {worker_token}"}

    start_date = datetime.now(timezone.utc).isoformat()
    end_date = (datetime.now(timezone.utc) + timedelta(days=180)).isoformat()

    # 3. Worker tries to create project -> RBAC 403 Forbidden
    forbidden_res = client.post("/api/v1/projects", json={
        "code": "HCT-BLKC",
        "name": "Harbor City Tower Block C",
        "location": "Sydney CBD",
        "start_date": start_date,
        "end_date": end_date,
        "budget": 45000000.0
    }, headers=worker_headers)
    assert forbidden_res.status_code == 403

    # 4. PM creates project -> 201 Created
    create_res = client.post("/api/v1/projects", json={
        "code": "HCT-BLKC",
        "name": "Harbor City Tower Block C",
        "location": "Sydney CBD",
        "start_date": start_date,
        "end_date": end_date,
        "budget": 45000000.0
    }, headers=pm_headers)
    assert create_res.status_code == 201
    project_data = create_res.json()
    project_id = project_data["id"]
    assert project_data["code"] == "HCT-BLKC"

    # 5. List projects
    list_res = client.get("/api/v1/projects", headers=pm_headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # 6. Submit RFI
    rfi_res = client.post(f"/api/v1/projects/{project_id}/rfis", json={
        "title": "RFI #001 — Footing setdown depth query",
        "question": "Grid G-12 footing setdown conflicts with architectural drawings.",
        "priority": "HIGH",
        "due_date": (datetime.now(timezone.utc) + timedelta(days=3)).isoformat()
    }, headers=pm_headers)
    assert rfi_res.status_code == 201
    rfi_data = rfi_res.json()
    rfi_id = rfi_data["id"]
    assert rfi_data["status"] == "OPEN"

    # 7. Answer RFI
    answer_res = client.patch(f"/api/v1/projects/{project_id}/rfis/{rfi_id}", json={
        "answer": "Structural SK-STRUCT-C-187 Rev3 overrides. Maintain 450mm setdown."
    }, headers=pm_headers)
    assert answer_res.status_code == 200
    assert answer_res.json()["status"] == "ANSWERED"

    # 8. Register Project Document
    doc_res = client.post(f"/api/v1/projects/{project_id}/documents", json={
        "title": "SK-STRUCT-C-187_Rev3.pdf",
        "file_path": "storage/documents/SK-STRUCT-C-187_Rev3.pdf",
        "file_type": "pdf",
        "file_size_bytes": 2340000
    }, headers=pm_headers)
    assert doc_res.status_code == 201
    assert doc_res.json()["title"] == "SK-STRUCT-C-187_Rev3.pdf"
