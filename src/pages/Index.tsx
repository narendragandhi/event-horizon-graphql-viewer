
import { useState } from 'react';
import { AccessibleEventCard } from '@/components/AccessibleEventCard';
import { FilterPanel } from '@/components/FilterPanel';
import { AccessibleSearchBar } from '@/components/AccessibleSearchBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SkipLink } from '@/components/SkipLink';
import { useOptimizedEventData } from '@/hooks/useOptimizedEventData';
import { EventFilters } from '@/types/event';

const Index = () => {
  const [filters, setFilters] = useState<EventFilters>({
    dateRange: 'all',
    location: 'all-locations',
    eventType: 'all-types',
    searchQuery: ''
  });
  
  const { data: events = [], isLoading, error } = useOptimizedEventData(filters);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SkipLink />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">EventHub</h1>
              <span className="ml-2 text-sm text-gray-500">Powered by AEM</span>
            </div>
            <div className="flex items-center space-x-4">
              <span 
                className="text-sm text-gray-600"
                aria-live="polite"
                role="status"
              >
                {events.length} events found
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <section className="mb-8 space-y-4" aria-label="Search and filter events">
          <AccessibleSearchBar
            searchQuery={filters.searchQuery}
            onSearchChange={(query) => setFilters(prev => ({ ...prev, searchQuery: query }))}
          />
          <FilterPanel 
            filters={filters}
            onFiltersChange={setFilters}
          />
        </section>

        {/* Main Content */}
        <main 
          id="main-content"
          className="flex flex-col lg:flex-row gap-8"
          tabIndex={-1}
          role="main"
        >
          {/* Events List */}
          <section className="flex-1" aria-label="Event listings">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center py-12" role="alert">
                <div className="text-red-500 text-lg font-medium mb-2">
                  Failed to load events
                </div>
                <p className="text-gray-600">Please try again later</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12" role="status">
                <div className="text-gray-400 text-6xl mb-4" aria-hidden="true">🎪</div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">No events found</h2>
                <p className="text-gray-600">Try adjusting your filters to see more events</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <AccessibleEventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
