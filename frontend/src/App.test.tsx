import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

describe('App Component tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Clear global fetch mock
    if (global.fetch) {
      vi.spyOn(global, 'fetch').mockReset();
    }
  });

  it('renders initial welcome message and sprite', () => {
    render(<App />);
    expect(screen.getByText('The Rusty Flask')).toBeInTheDocument();
    expect(screen.getAllByText(/Welcome to the Rusty Flask/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId('npc-sprite')).toBeInTheDocument();
    expect(screen.getByTestId('speech-bubble')).toBeInTheDocument();
  });

  it('handles sending user message and receiving response', async () => {
    const mockResponse = { response: 'Indeed, traveler. A fine day for a pint.' };
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    render(<App />);
    const input = screen.getByPlaceholderText(/Talk to Barnaby/i);
    const sendButton = screen.getByTestId('send-btn');

    fireEvent.change(input, { target: { value: 'Hello Barnaby' } });
    fireEvent.click(sendButton);

    // Verify user message appears in log
    expect(screen.getByText('Hello Barnaby')).toBeInTheDocument();

    // Verify loading state renders thinking bubble
    expect(screen.getByTestId('thinking-bubble')).toBeInTheDocument();

    // Wait for the response to render
    await waitFor(() => {
      expect(
        screen.getAllByText('Indeed, traveler. A fine day for a pint.').length,
      ).toBeGreaterThan(0);
    });

    // Check fetch was called with correct endpoint
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Hello Barnaby' }),
      }),
    );
  });

  it('handles resetting dialogue', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'reset' }),
    } as Response);

    render(<App />);
    const resetButton = screen.getByTestId('reset-btn');

    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getAllByText(/Welcome back, traveler! Fresh start/i).length).toBeGreaterThan(0);
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/chat/reset',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });
});
