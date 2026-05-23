import re

import litellm
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.config import settings

app = FastAPI(title="AI Tavern NPC Backend", version="0.1.0")


# Setup CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = (
    "You are Barnaby, a warm-hearted but slightly cynical fantasy bartender "
    "in the AI Tavern. You wear a stained white apron and always hold a mug "
    "of foaming ale. You are 55 years old, weary of adventurers' tall tales, "
    "but you have a soft spot for good company. You speak in a gruff but friendly "
    "tone. Keep your responses short (1-3 sentences) and stay in character "
    "at all times. Do not break character.\n\n"
    "CRITICAL: Output ONLY the spoken dialogue. Do NOT include physical actions, "
    "gestures, descriptions, stage directions, or text in asterisks or brackets "
    "(e.g., do NOT write *wipes glass* or [sighs]). Speak directly as Barnaby."
)

conversation_history = [{"role": "system", "content": SYSTEM_PROMPT}]


def clean_response(text: str) -> str:
    # Remove text in asterisks (e.g. *wipes glass*)
    text = re.sub(r"\*.*?\*", "", text)
    # Remove text in square brackets (e.g. [sighs])
    text = re.sub(r"\[.*?\]", "", text)
    # Remove text in parentheses (e.g. (grumbles))
    text = re.sub(r"\(.*?\)", "", text)
    # Clean up double spaces or leading/trailing spaces
    text = re.sub(r"\s+", " ", text)
    return text.strip()


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@app.get("/api/health")
def health_check():
    return {"status": "ok", "model": settings.llm_model}


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    global conversation_history

    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    conversation_history.append({"role": "user", "content": request.message})

    api_key = None
    model_lower = settings.llm_model.lower()
    if "anthropic" in model_lower:
        api_key = settings.anthropic_api_key
    elif "gemini" in model_lower or "google" in model_lower:
        api_key = settings.gemini_api_key
    elif "openai" in model_lower:
        api_key = settings.openai_api_key

    try:
        response = litellm.completion(
            model=settings.llm_model,
            messages=conversation_history,
            api_key=api_key,
            api_base=settings.llm_api_base,
        )

        assistant_message = response.choices[0].message.content
        if not assistant_message:
            raise HTTPException(
                status_code=500, detail="Empty response from language model"
            )

        # Strip any physical actions or descriptions
        cleaned_message = clean_response(assistant_message)

        conversation_history.append({"role": "assistant", "content": cleaned_message})

        return ChatResponse(response=cleaned_message)

    except Exception as e:
        if conversation_history and conversation_history[-1]["role"] == "user":
            conversation_history.pop()
        raise HTTPException(
            status_code=500, detail=f"Failed to communicate with LLM: {e!s}"
        ) from e


@app.post("/api/chat/reset")
def reset_chat():
    global conversation_history
    conversation_history = [{"role": "system", "content": SYSTEM_PROMPT}]
    return {"status": "reset"}
