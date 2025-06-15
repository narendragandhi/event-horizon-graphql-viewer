
import { describe, it, expect, beforeEach } from 'vitest';
import { mockGraphQLService } from '@/services/mockGraphQLService';
import { EventFilters } from '@/types/event';

describe('MockGraphQLService', () => {
  describe('fetchEvents', () => {
    it('should return all events when no filters applied', async () => {
      const events = await mockGraphQLService.fetchEvents();
      expect(events).toHaveLength(5);
      expect(events[0]).toHaveProperty('id');
      expect(events[0]).toHaveProperty('title');
    });

    it('should filter events by search query', async () => {
      const filters: EventFilters = {
        dateRange: 'all',
        location: 'all-locations',
        eventType: 'all-types',
        searchQuery: 'React'
      };

      const events = await mockGraphQLService.fetchEvents(filters);
      expect(events).toHaveLength(1);
      expect(events[0].title).toContain('React');
    });

    it('should filter events by event type', async () => {
      const filters: EventFilters = {
        dateRange: 'all',
        location: 'all-locations',
        eventType: 'Conference',
        searchQuery: ''
      };

      const events = await mockGraphQLService.fetchEvents(filters);
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('Conference');
    });

    it('should filter events by location', async () => {
      const filters: EventFilters = {
        dateRange: 'all',
        location: 'New York',
        eventType: 'all-types',
        searchQuery: ''
      };

      const events = await mockGraphQLService.fetchEvents(filters);
      expect(events.length).toBeGreaterThan(0);
      events.forEach(event => {
        expect(event.location.city).toBe('New York');
      });
    });

    it('should filter events by custom location', async () => {
      const filters: EventFilters = {
        dateRange: 'all',
        location: 'custom:london',
        eventType: 'all-types',
        searchQuery: ''
      };

      const events = await mockGraphQLService.fetchEvents(filters);
      expect(events.length).toBeGreaterThan(0);
      events.forEach(event => {
        expect(event.location.city.toLowerCase()).toContain('london');
      });
    });

    it('should return empty array when no events match filters', async () => {
      const filters: EventFilters = {
        dateRange: 'all',
        location: 'all-locations',
        eventType: 'all-types',
        searchQuery: 'nonexistent-event'
      };

      const events = await mockGraphQLService.fetchEvents(filters);
      expect(events).toHaveLength(0);
    });
  });

  describe('getEvents', () => {
    it('should transform filters correctly', async () => {
      const filters = {
        category: 'Conference',
        location: 'New York',
        searchTerm: 'React'
      };

      const events = await mockGraphQLService.getEvents(filters);
      expect(events).toHaveLength(1);
      expect(events[0].title).toContain('React');
    });

    it('should handle undefined filters', async () => {
      const events = await mockGraphQLService.getEvents();
      expect(events).toHaveLength(5);
    });
  });

  describe('getEventById', () => {
    it('should return event by id', async () => {
      const event = await mockGraphQLService.getEventById('1');
      expect(event).toBeDefined();
      expect(event?.id).toBe('1');
      expect(event?.title).toBe('React Conference 2024');
    });

    it('should return null for non-existent id', async () => {
      const event = await mockGraphQLService.getEventById('999');
      expect(event).toBeNull();
    });
  });

  describe('getGraphQLQuery', () => {
    it('should return GraphQL query string', () => {
      const query = mockGraphQLService.getGraphQLQuery();
      expect(query).toContain('query GetEvents');
      expect(query).toContain('eventList');
    });
  });
});
