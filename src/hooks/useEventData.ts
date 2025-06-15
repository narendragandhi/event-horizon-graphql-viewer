
import { useState, useEffect } from 'react';
import { Event, EventFilters } from '@/types/event';
import { eventService } from '../services/eventService';

export const useEventData = (filters: EventFilters) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Transform EventFilters to match the service expected format
        const transformedFilters = {
          category: filters.eventType !== 'all-types' ? filters.eventType : undefined,
          location: filters.location !== 'all-locations' ? filters.location : undefined,
          searchTerm: filters.searchQuery || undefined,
          dateRange: filters.customDateRange ? {
            start: filters.customDateRange.start,
            end: filters.customDateRange.end
          } : undefined
        };
        
        const data = await eventService.getEvents(transformedFilters);
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  return { events, loading, error };
};
