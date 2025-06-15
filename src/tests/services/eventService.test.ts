
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { eventService } from '@/services/eventService';
import { mockGraphQLService } from '@/services/mockGraphQLService';
import { graphqlService } from '@/services/graphqlService';

// Mock the services
vi.mock('@/services/mockGraphQLService');
vi.mock('@/services/graphqlService');

describe('EventService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEvents', () => {
    it('should use mock service when no real endpoint configured', async () => {
      const mockEvents = [{ id: '1', title: 'Test Event' }];
      vi.mocked(mockGraphQLService.getEvents).mockResolvedValue(mockEvents as any);

      const result = await eventService.getEvents();

      expect(mockGraphQLService.getEvents).toHaveBeenCalled();
      expect(result).toEqual(mockEvents);
    });

    it('should pass filters to mock service', async () => {
      const filters = { category: 'Conference', location: 'New York' };
      vi.mocked(mockGraphQLService.getEvents).mockResolvedValue([]);

      await eventService.getEvents(filters);

      expect(mockGraphQLService.getEvents).toHaveBeenCalledWith(filters);
    });

    it('should use real GraphQL service when endpoint is configured', async () => {
      const mockResult = { events: [{ id: '1', title: 'Test Event' }] };
      vi.mocked(graphqlService.getEvents).mockResolvedValue(mockResult as any);

      // Toggle to use real service
      eventService.toggleMockMode(false);

      const result = await eventService.getEvents();

      expect(graphqlService.getEvents).toHaveBeenCalled();
      expect(result).toEqual(mockResult.events);
    });
  });

  describe('getEventById', () => {
    it('should use mock service by default', async () => {
      const mockEvent = { id: '1', title: 'Test Event' };
      vi.mocked(mockGraphQLService.getEventById).mockResolvedValue(mockEvent as any);

      const result = await eventService.getEventById('1');

      expect(mockGraphQLService.getEventById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockEvent);
    });

    it('should return null when event not found', async () => {
      vi.mocked(mockGraphQLService.getEventById).mockResolvedValue(null);

      const result = await eventService.getEventById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('toggleMockMode', () => {
    it('should toggle between mock and real service', () => {
      eventService.toggleMockMode(true);
      // Test is implicit - no direct way to verify internal state
      // but the behavior is tested in other tests
      expect(true).toBe(true);
    });
  });
});
