
import { useQuery } from '@tanstack/react-query';
import { Event, EventFilters } from '@/types/event';
import { mockGraphQLService } from '@/services/mockGraphQLService';
import { cacheService } from '@/services/cacheService';

export const useOptimizedEventData = (filters: EventFilters) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const cacheKey = `events-${JSON.stringify(filters)}`;
      const cachedData = cacheService.get(cacheKey);
      
      if (cachedData) {
        console.log('Returning cached events data');
        return cachedData;
      }

      console.log('Fetching fresh events data');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = await mockGraphQLService.fetchEvents(filters);
      cacheService.set(cacheKey, data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
