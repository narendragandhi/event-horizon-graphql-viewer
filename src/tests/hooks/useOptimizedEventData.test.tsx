
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOptimizedEventData } from '@/hooks/useOptimizedEventData';
import { mockGraphQLService } from '@/services/mockGraphQLService';
import { cacheService } from '@/services/cacheService';
import { EventFilters } from '@/types/event';
import { ReactNode } from 'react';

// Mock the services
vi.mock('@/services/mockGraphQLService');
vi.mock('@/services/cacheService');

const mockEvents = [
  {
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    date: '2024-07-15T09:00:00Z',
    location: { name: 'Test Venue', address: '123 Test St', city: 'Test City', country: 'Test Country' },
    eventType: 'Conference',
    organizer: 'Test Organizer',
    tags: ['test'],
    capacity: 100,
    attendeesCount: 50
  }
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return function TestWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

describe('useOptimizedEventData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return cached data when available', async () => {
    const filters: EventFilters = {
      dateRange: 'all',
      location: 'all-locations',
      eventType: 'all-types',
      searchQuery: ''
    };

    vi.mocked(cacheService.get).mockReturnValue(mockEvents);

    const { result } = renderHook(() => useOptimizedEventData(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockEvents);
    const expectedCacheKey = 'events-' + JSON.stringify(filters);
    expect(cacheService.get).toHaveBeenCalledWith(expectedCacheKey);
    expect(mockGraphQLService.fetchEvents).not.toHaveBeenCalled();
  });

  it('should fetch fresh data when cache is empty', async () => {
    const filters: EventFilters = {
      dateRange: 'all',
      location: 'all-locations',
      eventType: 'all-types',
      searchQuery: ''
    };

    vi.mocked(cacheService.get).mockReturnValue(null);
    vi.mocked(mockGraphQLService.fetchEvents).mockResolvedValue(mockEvents as any);

    const { result } = renderHook(() => useOptimizedEventData(filters), {
      wrapper: createWrapper(),
    });

    // Fast forward past the simulated delay
    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockEvents);
    expect(mockGraphQLService.fetchEvents).toHaveBeenCalledWith(filters);
    const expectedCacheKey = 'events-' + JSON.stringify(filters);
    expect(cacheService.set).toHaveBeenCalledWith(expectedCacheKey, mockEvents);
  });

  it('should handle loading state', () => {
    const filters: EventFilters = {
      dateRange: 'all',
      location: 'all-locations',
      eventType: 'all-types',
      searchQuery: ''
    };

    vi.mocked(cacheService.get).mockReturnValue(null);
    vi.mocked(mockGraphQLService.fetchEvents).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useOptimizedEventData(filters), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle errors', async () => {
    const filters: EventFilters = {
      dateRange: 'all',
      location: 'all-locations',
      eventType: 'all-types',
      searchQuery: ''
    };

    vi.mocked(cacheService.get).mockReturnValue(null);
    vi.mocked(mockGraphQLService.fetchEvents).mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => useOptimizedEventData(filters), {
      wrapper: createWrapper(),
    });

    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('should use different cache keys for different filters', async () => {
    const filters1: EventFilters = {
      dateRange: 'all',
      location: 'all-locations',
      eventType: 'all-types',
      searchQuery: ''
    };

    const filters2: EventFilters = {
      dateRange: 'all',
      location: 'New York',
      eventType: 'Conference',
      searchQuery: 'React'
    };

    vi.mocked(cacheService.get).mockReturnValue(null);
    vi.mocked(mockGraphQLService.fetchEvents).mockResolvedValue(mockEvents as any);

    const { rerender } = renderHook(
      ({ filters }) => useOptimizedEventData(filters),
      {
        wrapper: createWrapper(),
        initialProps: { filters: filters1 }
      }
    );

    rerender({ filters: filters2 });

    const expectedCacheKey1 = 'events-' + JSON.stringify(filters1);
    const expectedCacheKey2 = 'events-' + JSON.stringify(filters2);
    expect(cacheService.get).toHaveBeenCalledWith(expectedCacheKey1);
    expect(cacheService.get).toHaveBeenCalledWith(expectedCacheKey2);
  });
});
