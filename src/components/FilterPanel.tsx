
import { EventFilters } from '@/types/event';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FilterIcon } from 'lucide-react';

interface FilterPanelProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
}

export const FilterPanel = ({ filters, onFiltersChange }: FilterPanelProps) => {
  const eventTypes = [
    'Conference',
    'Workshop',
    'Meetup',
    'Webinar',
    'Festival',
    'Concert',
    'Sports',
    'Networking'
  ];

  const locations = [
    'New York',
    'San Francisco',
    'London',
    'Berlin',
    'Tokyo',
    'Sydney',
    'Toronto',
    'Paris'
  ];

  const hasActiveFilters = 
    filters.dateRange !== 'all' || 
    filters.location !== '' || 
    filters.eventType !== '' ||
    filters.searchQuery !== '';

  const clearFilters = () => {
    onFiltersChange({
      dateRange: 'all',
      location: '',
      eventType: '',
      searchQuery: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FilterIcon className="w-4 h-4" />
          <h3 className="font-medium text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <Select
            value={filters.dateRange}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, dateRange: value as EventFilters['dateRange'] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This week</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Select
            value={filters.location}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, location: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Event Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <Select
            value={filters.eventType}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, eventType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Location Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Location
          </label>
          <Input
            placeholder="Enter location..."
            value={filters.location.startsWith('custom:') ? filters.location.replace('custom:', '') : ''}
            onChange={(e) => 
              onFiltersChange({ 
                ...filters, 
                location: e.target.value ? `custom:${e.target.value}` : '' 
              })
            }
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {filters.dateRange !== 'all' && (
              <Badge variant="secondary">
                Date: {filters.dateRange.replace('-', ' ')}
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary">
                Location: {filters.location.replace('custom:', '')}
              </Badge>
            )}
            {filters.eventType && (
              <Badge variant="secondary">
                Type: {filters.eventType}
              </Badge>
            )}
            {filters.searchQuery && (
              <Badge variant="secondary">
                Search: "{filters.searchQuery}"
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
