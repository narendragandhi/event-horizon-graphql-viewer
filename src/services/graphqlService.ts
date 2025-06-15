
import { graphqlConfig, getAuthHeaders } from '../config/graphql';
import { Event } from '../types/event';

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: any;
  }>;
}

export class GraphQLService {
  private endpoint: string;
  
  constructor() {
    this.endpoint = graphqlConfig.endpoint;
  }

  async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message);
      }

      if (!result.data) {
        throw new Error('No data returned from GraphQL query');
      }

      return result.data;
    } catch (error) {
      console.error('GraphQL query error:', error);
      throw error;
    }
  }

  // Event-specific queries
  async getEvents(filters?: {
    category?: string;
    location?: string;
    dateRange?: { start: string; end: string };
    searchTerm?: string;
  }): Promise<{ events: Event[] }> {
    const query = `
      query GetEvents($filters: EventFilters) {
        events(filters: $filters) {
          id
          title
          description
          date
          time
          location
          category
          price
          capacity
          imageUrl
          organizer
          tags
          isVirtual
        }
      }
    `;

    return this.query(query, { filters });
  }

  async getEventById(id: string): Promise<{ event: Event }> {
    const query = `
      query GetEvent($id: ID!) {
        event(id: $id) {
          id
          title
          description
          date
          time
          location
          category
          price
          capacity
          imageUrl
          organizer
          tags
          isVirtual
        }
      }
    `;

    return this.query(query, { id });
  }
}

export const graphqlService = new GraphQLService();
