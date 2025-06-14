
import { useState, useEffect } from 'react';
import { EventList } from '@/components/EventList';
import { FilterPanel } from '@/components/FilterPanel';
import { SearchBar } from '@/components/SearchBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useEventData } from '@/hooks/useEventData';
import { EventFilters } from '@/types/event';

const Index = () => {
  const [filters, setFilters] = useState<EventFilters>({
    dateRange: 'all',
    location: '',
    eventType: '',
    searchQuery: ''
  });
  
  const { events, loading, error } = useEventData(filters);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">EventHub</h1>
              <span className="ml-2 text-sm text-gray-500">Powered by AEM</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {events.length} events found
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <SearchBar 
            searchQuery={filters.searchQuery}
            onSearchChange={(query) => setFilters(prev => ({ ...prev, searchQuery: query }))}
          />
          <FilterPanel 
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Events List */}
          <main className="flex-1">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg font-medium mb-2">
                  Failed to load events
                </div>
                <p className="text-gray-600">Please try again later</p>
              </div>
            ) : (
              <EventList events={events} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
