import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock scrollIntoView since it is not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock Canvas getContext since it is not implemented in jsdom without canvas package
window.HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  fillStyle: '',
});
