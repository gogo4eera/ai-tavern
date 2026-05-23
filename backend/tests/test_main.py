from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from app.main import app, clean_response

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert "model" in response.json()


@patch("app.main.litellm.completion")
def test_chat_success(mock_completion):
    # Mocking LiteLLM response structure using MagicMock
    mock_response = MagicMock()
    mock_choice = MagicMock()
    mock_choice.message.content = "Welcome to the tavern, traveler! Have a seat."
    mock_response.choices = [mock_choice]
    mock_completion.return_value = mock_response

    response = client.post("/api/chat", json={"message": "Hello, Barnaby!"})
    assert response.status_code == 200
    assert response.json()["response"] == (
        "Welcome to the tavern, traveler! Have a seat."
    )
    mock_completion.assert_called_once()


def test_chat_empty_message():
    response = client.post("/api/chat", json={"message": ""})
    assert response.status_code == 400
    assert "Message cannot be empty" in response.json()["detail"]


def test_chat_reset():
    # Make sure reset endpoint works
    response = client.post("/api/chat/reset")
    assert response.status_code == 200
    assert response.json()["status"] == "reset"


def test_clean_response_helper():
    assert clean_response("Hello *wipes glass* traveler!") == "Hello traveler!"
    assert clean_response("Welcome [sighs] to the tavern.") == "Welcome to the tavern."
    assert (
        clean_response("What will you have? (grumbles slightly)")
        == "What will you have?"
    )
    assert clean_response("  Hey   there!  ") == "Hey there!"
