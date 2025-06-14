
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  eventType: string;
  organizer: string;
  imageUrl?: string;
  price?: {
    amount: number;
    currency: string;
  };
  registrationUrl?: string;
  tags: string[];
  capacity?: number;
  attendeesCount?: number;
}

export interface EventFilters {
  dateRange: 'all' | 'today' | 'this-week' | 'this-month' | 'custom';
  location: string;
  eventType: string;
  searchQuery: string;
  customDateRange?: {
    start: string;
    end: string;
  };
}

export interface GraphQLEventResponse {
  eventList: {
    items: Event[];
  };
}
