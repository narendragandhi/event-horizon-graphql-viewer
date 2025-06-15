
import { graphqlService } from './graphqlService';
import { mockGraphQLService } from './mockGraphQLService';
import { graphqlConfig } from '../config/graphql';
import { Event } from '../types/event';

class EventService {
  private useMockData: boolean;

  constructor() {
    // Use mock data if no real endpoint is configured
    this.useMockData = !graphqlConfig.endpoint || graphqlConfig.endpoint.includes('localhost:4000');
  }

  async getEvents(filters?: {
    category?: string;
    location?: string;
    dateRange?: { start: string; end: string };
    searchTerm?: string;
  }): Promise<Event[]> {
    if (this.useMockData) {
      return mockGraphQLService.getEvents(filters);
    }

    const result = await graphqlService.getEvents(filters);
    return result.events;
  }

  async getEventById(id: string): Promise<Event | null> {
    if (this.useMockData) {
      return mockGraphQLService.getEventById(id);
    }

    const result = await graphqlService.getEventById(id);
    return result.event;
  }

  toggleMockMode(useMock: boolean) {
    this.useMockData = useMock;
  }
}

export const eventService = new EventService();
