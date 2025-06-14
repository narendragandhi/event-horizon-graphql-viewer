
import { Event } from '@/types/event';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CalendarIcon, MapPinIcon } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-200">
      {event.imageUrl && (
        <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg relative overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {event.eventType}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-lg leading-tight text-gray-900 line-clamp-2">
            {event.title}
          </h3>
          {event.price && (
            <Badge variant="outline" className="ml-2 whitespace-nowrap">
              {event.price.currency} {event.price.amount}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
            <span>
              {formatDate(event.date)} • {formatTime(event.date)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="w-4 h-4 mr-2 text-red-500" />
            <span className="truncate">
              {event.location.name}, {event.location.city}
            </span>
          </div>
        </div>

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {event.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {event.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{event.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="w-full flex justify-between items-center">
          <div className="text-xs text-gray-500">
            By {event.organizer}
          </div>
          <Button size="sm" className="ml-auto">
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
