
import { EventFilters } from '@/types/event';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FilterIcon, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FilterPanelProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
}

export const FilterPanel = ({ filters, onFiltersChange }: FilterPanelProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

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
    filters.location !== 'all-locations' || 
    filters.eventType !== 'all-types' ||
    filters.searchQuery !== '';

  const clearFilters = () => {
    onFiltersChange({
      dateRange: 'all',
      location: 'all-locations',
      eventType: 'all-types',
      searchQuery: ''
    });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleDateRangeChange = (value: string) => {
    if (value === 'custom') {
      onFiltersChange({ 
        ...filters, 
        dateRange: 'custom',
        customDateRange: startDate && endDate ? {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        } : undefined
      });
    } else {
      onFiltersChange({ ...filters, dateRange: value as EventFilters['dateRange'] });
    }
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    if (date && endDate) {
      onFiltersChange({
        ...filters,
        dateRange: 'custom',
        customDateRange: {
          start: date.toISOString(),
          end: endDate.toISOString()
        }
      });
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    if (startDate && date) {
      onFiltersChange({
        ...filters,
        dateRange: 'custom',
        customDateRange: {
          start: startDate.toISOString(),
          end: date.toISOString()
        }
      });
    }
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
            onValueChange={handleDateRangeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This week</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
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
              <SelectItem value="all-locations">All locations</SelectItem>
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
              <SelectItem value="all-types">All types</SelectItem>
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
                location: e.target.value ? `custom:${e.target.value}` : 'all-locations' 
              })
            }
          />
        </div>
      </div>

      {/* Custom Date Range Pickers */}
      {filters.dateRange === 'custom' && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateSelect}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateSelect}
                    initialFocus
                    disabled={(date) => startDate ? date < startDate : false}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {filters.dateRange !== 'all' && (
              <Badge variant="secondary">
                Date: {filters.dateRange === 'custom' 
                  ? `${startDate ? format(startDate, 'MMM dd') : 'Start'} - ${endDate ? format(endDate, 'MMM dd') : 'End'}`
                  : filters.dateRange.replace('-', ' ')
                }
              </Badge>
            )}
            {filters.location && filters.location !== 'all-locations' && (
              <Badge variant="secondary">
                Location: {filters.location.replace('custom:', '')}
              </Badge>
            )}
            {filters.eventType && filters.eventType !== 'all-types' && (
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
