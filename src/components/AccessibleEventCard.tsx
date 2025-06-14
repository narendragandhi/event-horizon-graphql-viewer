
import { Event } from '@/types/event';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CalendarIcon, MapPinIcon, UsersIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sanitizeImageUrl } from '@/utils/security';
import { memo, useState } from 'react';

interface AccessibleEventCardProps {
  event: Event;
  index: number;
}

export const AccessibleEventCard = memo(({ event, index }: AccessibleEventCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

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

  const handleViewDetails = () => {
    navigate(`/event/${event.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const sanitizedImageUrl = sanitizeImageUrl(event.imageUrl || '');

  return (
    <article 
      className="h-full flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500"
      role="article"
      aria-labelledby={`event-title-${event.id}`}
      aria-describedby={`event-description-${event.id}`}
    >
      {sanitizedImageUrl && !imageError && (
        <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg relative overflow-hidden">
          <img 
            src={sanitizedImageUrl}
            alt={`Event image for ${event.title}`}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading={index > 2 ? 'lazy' : 'eager'}
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
          <h3 
            id={`event-title-${event.id}`}
            className="font-bold text-lg leading-tight text-gray-900 line-clamp-2"
          >
            {event.title}
          </h3>
          {event.price && (
            <Badge 
              variant="outline" 
              className="ml-2 whitespace-nowrap"
              aria-label={`Price: ${event.price.currency} ${event.price.amount}`}
            >
              {event.price.currency} {event.price.amount}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <p 
          id={`event-description-${event.id}`}
          className="text-gray-600 text-sm mb-4 line-clamp-3"
        >
          {event.description}
        </p>

        <div className="space-y-2" role="list" aria-label="Event details">
          <div className="flex items-center text-sm text-gray-500" role="listitem">
            <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" aria-hidden="true" />
            <time dateTime={event.date}>
              {formatDate(event.date)} • {formatTime(event.date)}
            </time>
          </div>
          
          <div className="flex items-center text-sm text-gray-500" role="listitem">
            <MapPinIcon className="w-4 h-4 mr-2 text-red-500" aria-hidden="true" />
            <address className="truncate not-italic">
              {event.location.name}, {event.location.city}
            </address>
          </div>

          {event.capacity && (
            <div className="flex items-center text-sm text-gray-500" role="listitem">
              <UsersIcon className="w-4 h-4 mr-2 text-green-500" aria-hidden="true" />
              <span aria-label={`${event.attendeesCount || 0} out of ${event.capacity} attendees`}>
                {event.attendeesCount || 0} / {event.capacity} attendees
              </span>
            </div>
          )}
        </div>

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3" role="list" aria-label="Event tags">
            {event.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs" role="listitem">
                {tag}
              </Badge>
            ))}
            {event.tags.length > 3 && (
              <Badge 
                variant="secondary" 
                className="text-xs"
                aria-label={`${event.tags.length - 3} more tags`}
                role="listitem"
              >
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
          <Button 
            size="sm" 
            className="ml-auto focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
            onClick={handleViewDetails}
            aria-label={`View details for ${event.title}`}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </article>
  );
});

AccessibleEventCard.displayName = 'AccessibleEventCard';
