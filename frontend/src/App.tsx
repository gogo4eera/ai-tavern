import React, { useState, useEffect, useRef } from 'react';
import { NPCSprite } from './components/NPCSprite';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Welcome to the Rusty Flask, traveler! Sit down and let me pour you a pint. What brings you to this corner of the realm?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat log to bottom whenever messages change
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputValue.trim();
    if (!cleanInput || isThinking) return;

    setInputValue('');
    // Add user's message immediately to screen
    setMessages((prev) => [...prev, { role: 'user', content: cleanInput }]);
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: cleanInput }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry traveler, my old head is spinning. Can you speak up or say that again?',
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleReset = async () => {
    setIsThinking(true);
    try {
      const response = await fetch('/api/chat/reset', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reset conversation on server');
      }

      // Reset frontend state
      setMessages([
        {
          role: 'assistant',
          content: 'Welcome back, traveler! Fresh start, fresh mug. What is on your mind?',
        },
      ]);
    } catch (error) {
      console.error('Error resetting chat:', error);
    } finally {
      setIsThinking(false);
    }
  };

  // Determine speech bubble text
  const lastMessage = messages[messages.length - 1];
  const showSpeechBubble = lastMessage && lastMessage.role === 'assistant' && !isThinking;

  // Determine current mood for the sprite (happy/sad/calm/angry)
  let npcMood = 'calm';
  if (lastMessage && lastMessage.role === 'user') {
    npcMood = 'thinking';
  } else if (lastMessage && lastMessage.role === 'assistant') {
    const text = lastMessage.content.toLowerCase();
    if (text.includes('sorry') || text.includes('sad') || text.includes('weary')) {
      npcMood = 'sad';
    } else if (text.includes('welcome') || text.includes('happy') || text.includes('glad')) {
      npcMood = 'happy';
    } else if (text.includes('cynical') || text.includes('fool') || text.includes('bah')) {
      npcMood = 'angry';
    }
  }

  return (
    <div className="tavern-frame">
      {/* Header Panel */}
      <header className="tavern-header">
        <h1 className="tavern-title">The Rusty Flask</h1>
        <p className="tavern-subtitle">AI Tavern NPC Sandbox</p>
      </header>

      {/* Visual Viewport with Bartender Canvas */}
      <div className="tavern-viewport">
        <div className="sprite-container">
          {/* Render Speech Bubble Above Sprite */}
          {showSpeechBubble && (
            <div className="speech-bubble" data-testid="speech-bubble">
              {lastMessage.content}
            </div>
          )}

          {/* Render Thinking Bubble Above Sprite */}
          {isThinking && (
            <div className="thinking-bubble" data-testid="thinking-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}

          <NPCSprite
            name="Barnaby"
            age={55}
            role="bartender"
            mood={npcMood}
            isThinking={isThinking}
          />
        </div>
      </div>

      {/* Wooden Divider Line */}
      <div className="tavern-divider"></div>

      {/* Chat Area & Dialogue History */}
      <main className="rpg-chat">
        <div className="dialogue-log" data-testid="dialogue-log">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`} data-testid={`message-${msg.role}`}>
              <span className="message-sender">{msg.role === 'user' ? 'Traveler' : 'Barnaby'}</span>
              <span className="message-text">{msg.content}</span>
            </div>
          ))}
          {/* Scroll Target */}
          <div ref={logEndRef} />
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            className="chat-input"
            placeholder="Talk to Barnaby the Bartender..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isThinking}
            data-testid="chat-input"
          />
          <button
            type="submit"
            className="btn-fantasy"
            disabled={isThinking}
            data-testid="send-btn"
          >
            Send
          </button>
        </form>
      </main>

      {/* Controls Area */}
      <div className="controls-bar">
        <button
          onClick={handleReset}
          className="btn-fantasy btn-reset"
          disabled={isThinking}
          data-testid="reset-btn"
        >
          Reset Dialogue
        </button>
      </div>
    </div>
  );
}

export default App;
