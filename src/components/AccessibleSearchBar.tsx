
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { sanitizeInput } from '@/utils/security';
import { useId } from 'react';

interface AccessibleSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const AccessibleSearchBar = ({ searchQuery, onSearchChange }: AccessibleSearchBarProps) => {
  const searchId = useId();
  const resultsId = useId();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    onSearchChange(sanitizedValue);
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="relative max-w-md">
      <label htmlFor={searchId} className="sr-only">
        Search events by title, description, or tags
      </label>
      
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
      </div>
      
      <Input
        id={searchId}
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="pl-10 pr-10 focus:ring-2 focus:ring-blue-500"
        aria-describedby={resultsId}
        maxLength={100}
      />
      
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute inset-y-0 right-0 px-3 hover:bg-transparent focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={clearSearch}
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" aria-hidden="true" />
        </Button>
      )}
      
      <div id={resultsId} className="sr-only" aria-live="polite">
        {searchQuery ? `Searching for "${searchQuery}"` : ''}
      </div>
    </div>
  );
};
