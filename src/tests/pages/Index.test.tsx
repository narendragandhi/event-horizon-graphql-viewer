
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import { ReactNode } from 'react';

// Mock the hooks
vi.mock('@/hooks/useOptimizedEventData', () => ({
  useOptimizedEventData: vi.fn()
}));

const mockUseOptimizedEventData = vi.mocked(
  await import('@/hooks/useOptimizedEventData')
).useOptimizedEventData;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Index Page', () => {
  it('should render header with title', () => {
    mockUseOptimizedEventData.mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    } as any);

    render(<Index />, { wrapper: createWrapper() });

    expect(screen.getByText('EventHub')).toBeInTheDocument();
    expect(screen.getByText('Powered by AEM')).toBeInTheDocument();
  });

  it('should show loading spinner when loading', () => {
    mockUseOptimizedEventData.mockReturnValue({
      data: [],
      isLoading: true,
      error: null
    } as any);

    render(<Index />, { wrapper: createWrapper() });

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should show error message when there is an error', () => {
    mockUseOptimizedEventData.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Test error')
    } as any);

    render(<Index />, { wrapper: createWrapper() });

    expect(screen.getByText('Failed to load events')).toBeInTheDocument();
    expect(screen.getByText('Please try again later')).toBeInTheDocument();
  });

  it('should show no events message when events list is empty', () => {
    mockUseOptimizedEventData.mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    } as any);

    render(<Index />, { wrapper: createWrapper() });

    expect(screen.getByText('No events found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters to see more events')).toBeInTheDocument();
  });

  it('should display events count', () => {
    const mockEvents = [
      { id: '1', title: 'Event 1' },
      { id: '2', title: 'Event 2' }
    ];

    mockUseOptimizedEventData.mockReturnValue({
      data: mockEvents,
      isLoading: false,
      error: null
    } as any);

    render(<Index />, { wrapper: createWrapper() });

    expect(screen.getByText('2 events found')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    mockUseOptimizedEventData.mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    } as any);

    render(<Index />, { wrapper: createWrapper() });

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByLabelText('Search and filter events')).toBeInTheDocument();
    expect(screen.getByLabelText('Event listings')).toBeInTheDocument();
  });
});
