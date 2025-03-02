import '@testing-library/jest-dom';
import { vi } from 'vitest';

const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation(() => {
  return {
    observe: vi.fn(),
    disconnect: vi.fn(),
    unobserve: vi.fn(),
  };
});

window.IntersectionObserver = mockIntersectionObserver;