
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchBar = ({ searchQuery, onSearchChange }: SearchBarProps) => {
  return (
    <div className="relative max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      
      <Input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-10"
      />
      
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute inset-y-0 right-0 px-3 hover:bg-transparent"
          onClick={() => onSearchChange('')}
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </Button>
      )}
    </div>
  );
};
