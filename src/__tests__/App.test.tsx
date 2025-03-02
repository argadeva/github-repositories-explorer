import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { QueryClient } from '@tanstack/react-query';

// Mock FindUsers component
vi.mock('../FindUsers', () => ({
  default: () => <div data-testid="find-users">Mock FindUsers Component</div>
}));

describe('App Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('should render FindUsers component', () => {
    render(<App />);
    const findUsers = screen.getByTestId('find-users');
    expect(findUsers).toBeInTheDocument();
    expect(findUsers.textContent).toBe('Mock FindUsers Component');
  });

  it('should be wrapped in QueryClientProvider', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should initialize QueryClient with default config', () => {
    const queryClientSpy = vi.spyOn(QueryClient.prototype, 'mount');
    render(<App />);
    expect(queryClientSpy).toHaveBeenCalled();
    queryClientSpy.mockRestore();
  });

  it('should maintain component structure', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByTestId('find-users')).toBeInTheDocument();
  });
});