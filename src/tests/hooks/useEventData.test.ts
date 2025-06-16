import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEventData } from '@/hooks/useEventData';
import { eventService } from '@/services/eventService';
import { EventFilters } from '@/types/event';

// Mock the eventService
vi.mock('@/services/eventService');

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

describe('useEventData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return loading state initially', () => {
    vi.mocked(eventService.getEvents).mockImplementation(() => new Promise(() => {}));
    
    const filters: EventFilters = {
      dateRange: 'all',
      location: 'all-locations',
      eventType: 'all-types',
      searchQuery: ''
    };

    const { result } = renderHook(() => useEventData(filters));

    expect(result.current.loading).toBe(true);
    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch and return events successfully', async () => {
    vi.mocked(eventService.getEvents).mockResolvedValue(mockEvents as any);
    
    const filters: EventFilters = {
      dateRange: 'all',
      location: 'all-locations',
      eventType: 'all-types',
      searchQuery: ''
    };

    const { result } = renderHook(() => useEventData(filters));

    // Fast forward past the simulated delay
    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual(mockEvents);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors', async () => {
    const errorMessage = 'Failed to fetch events';
    vi.mocked(eventService.getEvents).mockRejectedValue(new Error(errorMessage));
    
    const filters: EventFilters = {
      dateRange: 'all',
      location: 'all-locations',
      eventType: 'all-types',
      searchQuery: ''
    };

    const { result } = renderHook(() => useEventData(filters));

    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should transform filters correctly', async () => {
    vi.mocked(eventService.getEvents).mockResolvedValue(mockEvents as any);
    
    const filters: EventFilters = {
      dateRange: 'all',
      location: 'New York',
      eventType: 'Conference',
      searchQuery: 'React'
    };

    renderHook(() => useEventData(filters));

    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(eventService.getEvents).toHaveBeenCalledWith({
        category: 'Conference',
        location: 'New York',
        searchTerm: 'React',
        dateRange: undefined
      });
    });
  });

  it('should handle custom date range', async () => {
    vi.mocked(eventService.getEvents).mockResolvedValue(mockEvents as any);
    
    const filters: EventFilters = {
      dateRange: 'custom',
      location: 'all-locations',
      eventType: 'all-types',
      searchQuery: '',
      customDateRange: {
        start: '2024-01-01',
        end: '2024-12-31'
      }
    };

    renderHook(() => useEventData(filters));

    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(eventService.getEvents).toHaveBeenCalledWith({
        category: undefined,
        location: undefined,
        searchTerm: undefined,
        dateRange: {
          start: '2024-01-01',
          end: '2024-12-31'
        }
      });
    });
  });
});
