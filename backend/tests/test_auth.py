# 인증 API 테스트 — 실행: cd backend && .venv/bin/pytest -v
# 준비물(client, auth_headers)은 conftest.py, 테스트마다 빈 sage_test DB 에서 시작한다.
# assert 에는 "실제로 나와야 하는 값"을 적는다 — 실패해야 정상인 경우는 에러 코드(401·409·422).


def test_signup_hides_password(client):
    res = client.post(
        "/api/auth/signup", json={"email": "a@example.com", "password": "password123"})
    assert res.status_code == 201
    body = res.json()
    assert body["email"] == "a@example.com"
    assert "hashed_password" not in body  # 응답에 비밀번호 해시가 없어야 한다(UserOut)


def test_signup_duplicate_email(client):
    payload = {"email": "a@example.com", "password": "password123"}
    client.post("/api/auth/signup", json=payload)
    assert client.post("/api/auth/signup", json=payload).status_code == 409  # 이미 있는 이메일과 충돌


def test_signup_short_password(client):
    res = client.post("/api/auth/signup",
                      json={"email": "a@example.com", "password": "short"})
    assert res.status_code == 422  # 8자 미만 — Pydantic 검증 실패


def test_login_wrong_password(client):
    client.post("/api/auth/signup",
                json={"email": "a@example.com", "password": "password123"})
    res = client.post(
        "/api/auth/login", data={"username": "a@example.com", "password": "wrong-pass"})
    assert res.status_code == 401


def test_me_without_token(client):
    assert client.get("/api/auth/me").status_code == 401


def test_me_with_bad_token(client):
    res = client.get(
        "/api/auth/me", headers={"Authorization": "Bearer not-a-real-token"})
    assert res.status_code == 401


def test_me_with_token(client, auth_headers):
    res = client.get("/api/auth/me", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["email"] == "me@example.com"


def test_update_level(client, auth_headers):
    res = client.patch(
        "/api/auth/me", json={"level": "advanced"}, headers=auth_headers)
    assert res.status_code == 200
    # 다시 조회해서 DB 에 실제로 저장됐는지 확인
    assert client.get("/api/auth/me", headers=auth_headers).json()["level"] == "advanced"


def test_update_level_invalid(client, auth_headers):
    res = client.patch(
        "/api/auth/me", json={"level": "expert"}, headers=auth_headers)
    assert res.status_code == 422  # 없는 레벨 — Pydantic 검증 실패


def test_signup_ignores_role(client):
    # role 은 요청으로 받지 않는다 — "admin" 을 보내도 일반 유저로 가입돼야 한다
    res = client.post(
        "/api/auth/signup",
        json={"email": "a@example.com", "password": "password123", "role": "admin"})
    assert res.status_code == 201
    assert res.json()["role"] == "user"
