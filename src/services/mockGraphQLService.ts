
import { Event, EventFilters, GraphQLEventResponse } from '@/types/event';

// Mock data representing AEM Content Fragments
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'React Conference 2024',
    description: 'Join us for the biggest React conference of the year. Learn about the latest features, best practices, and network with fellow developers.',
    date: '2024-07-15T09:00:00Z',
    endDate: '2024-07-17T18:00:00Z',
    location: {
      name: 'Convention Center',
      address: '123 Tech Street',
      city: 'San Francisco',
      country: 'USA'
    },
    eventType: 'Conference',
    organizer: 'React Team',
    imageUrl: '/placeholder.svg',
    price: { amount: 299, currency: 'USD' },
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    capacity: 1000,
    attendeesCount: 756
  },
  {
    id: '2',
    title: 'Design Thinking Workshop',
    description: 'Learn the fundamentals of design thinking and how to apply them to solve complex problems in your organization.',
    date: '2024-06-20T14:00:00Z',
    location: {
      name: 'Innovation Hub',
      address: '456 Creative Ave',
      city: 'New York',
      country: 'USA'
    },
    eventType: 'Workshop',
    organizer: 'Design Academy',
    imageUrl: '/placeholder.svg',
    price: { amount: 149, currency: 'USD' },
    tags: ['Design', 'UX', 'Innovation', 'Problem Solving'],
    capacity: 50,
    attendeesCount: 32
  },
  {
    id: '3',
    title: 'AI & Machine Learning Meetup',
    description: 'Monthly meetup for AI enthusiasts. This month we\'re discussing the latest developments in LLMs and their practical applications.',
    date: '2024-06-25T19:00:00Z',
    location: {
      name: 'Tech Hub',
      address: '789 Innovation Blvd',
      city: 'London',
      country: 'UK'
    },
    eventType: 'Meetup',
    organizer: 'AI London',
    tags: ['AI', 'Machine Learning', 'Data Science', 'Technology'],
    capacity: 100,
    attendeesCount: 87
  },
  {
    id: '4',
    title: 'Startup Pitch Night',
    description: 'Watch promising startups pitch their ideas to a panel of investors. Great networking opportunity for entrepreneurs and investors.',
    date: '2024-06-30T18:30:00Z',
    location: {
      name: 'Innovation Center',
      address: '321 Startup Lane',
      city: 'Berlin',
      country: 'Germany'
    },
    eventType: 'Networking',
    organizer: 'Berlin Startup Hub',
    imageUrl: '/placeholder.svg',
    tags: ['Startup', 'Entrepreneurship', 'Investing', 'Networking'],
    capacity: 150,
    attendeesCount: 143
  },
  {
    id: '5',
    title: 'Summer Music Festival',
    description: 'Three days of amazing music featuring local and international artists across multiple genres.',
    date: '2024-08-02T16:00:00Z',
    endDate: '2024-08-04T23:00:00Z',
    location: {
      name: 'Central Park',
      address: 'Park Avenue',
      city: 'New York',
      country: 'USA'
    },
    eventType: 'Festival',
    organizer: 'Music Events Co',
    imageUrl: '/placeholder.svg',
    price: { amount: 89, currency: 'USD' },
    tags: ['Music', 'Festival', 'Entertainment', 'Summer'],
    capacity: 5000,
    attendeesCount: 4200
  }
];

class MockGraphQLService {
  async fetchEvents(filters?: EventFilters): Promise<Event[]> {
    // Simulate GraphQL query to AEM
    console.log('Fetching events with filters:', filters);
    
    let filteredEvents = [...mockEvents];

    if (filters) {
      // Apply search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // Apply event type filter
      if (filters.eventType) {
        filteredEvents = filteredEvents.filter(event => 
          event.eventType === filters.eventType
        );
      }

      // Apply location filter
      if (filters.location) {
        const location = filters.location.replace('custom:', '').toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
          event.location.city.toLowerCase().includes(location) ||
          event.location.country.toLowerCase().includes(location) ||
          event.location.name.toLowerCase().includes(location)
        );
      }

      // Apply date range filter
      if (filters.dateRange !== 'all') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.date);
          
          switch (filters.dateRange) {
            case 'today':
              return eventDate >= today && eventDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
            case 'this-week':
              const weekStart = new Date(today);
              weekStart.setDate(today.getDate() - today.getDay());
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekStart.getDate() + 7);
              return eventDate >= weekStart && eventDate < weekEnd;
            case 'this-month':
              const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
              const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);
              return eventDate >= monthStart && eventDate < monthEnd;
            default:
              return true;
          }
        });
      }
    }

    // Sort by date
    filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return filteredEvents;
  }

  // Example GraphQL query that would be used with AEM
  getGraphQLQuery() {
    return `
      query GetEvents($filters: EventFiltersInput) {
        eventList(filter: $filters, sort: "date_ASC") {
          items {
            id
            title
            description
            date
            endDate
            location {
              name
              address
              city
              country
            }
            eventType
            organizer
            imageUrl
            price {
              amount
              currency
            }
            registrationUrl
            tags
            capacity
            attendeesCount
          }
        }
      }
    `;
  }
}

export const mockGraphQLService = new MockGraphQLService();
