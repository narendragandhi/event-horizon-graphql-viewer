
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Event } from '@/types/event';
import { mockGraphQLService } from '@/services/mockGraphQLService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowLeftIcon } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SkipLink } from '@/components/SkipLink';
import { sanitizeImageUrl, validateEventId } from '@/utils/security';
import { useAccessibleFocus } from '@/hooks/useAccessibleFocus';
import { useState } from 'react';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const focusRef = useAccessibleFocus(true);

  const isValidId = id && validateEventId(id);

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => mockGraphQLService.fetchEvents(),
    enabled: isValidId,
    staleTime: 5 * 60 * 1000,
  });

  const event = events.find(e => e.id === id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  const handleImageError = () => {
    setImageError(true);
  };

  if (!isValidId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <SkipLink />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="mb-6 focus:ring-2 focus:ring-blue-500"
            aria-label="Return to events list"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Events
          </Button>
          <div className="text-center py-12" role="alert">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Event ID</h1>
            <p className="text-gray-600">The event ID provided is not valid.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <SkipLink />
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <SkipLink />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="mb-6 focus:ring-2 focus:ring-blue-500"
            aria-label="Return to events list"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Events
          </Button>
          <div className="text-center py-12" role="alert">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600">The event you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const sanitizedImageUrl = sanitizeImageUrl(event.imageUrl || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SkipLink />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/')} 
          variant="outline" 
          className="mb-6 focus:ring-2 focus:ring-blue-500"
          aria-label="Return to events list"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Events
        </Button>

        <main id="main-content" tabIndex={-1} ref={focusRef}>
          <Card className="overflow-hidden">
            {sanitizedImageUrl && !imageError && (
              <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 relative">
                <img 
                  src={sanitizedImageUrl}
                  alt={`Event image for ${event.title}`}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {event.eventType}
                  </Badge>
                </div>
              </div>
            )}

            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Organized by {event.organizer}
                  </p>
                </div>
                {event.price && (
                  <div className="text-right" aria-label={`Price: ${event.price.currency} ${event.price.amount} per ticket`}>
                    <div className="text-2xl font-bold text-green-600">
                      {event.price.currency} {event.price.amount}
                    </div>
                    <div className="text-sm text-gray-500">per ticket</div>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4" role="list" aria-label="Event details">
                  <div className="flex items-center text-gray-700" role="listitem">
                    <CalendarIcon className="w-5 h-5 mr-3 text-blue-500" aria-hidden="true" />
                    <div>
                      <div className="font-medium">
                        <time dateTime={event.date}>{formatDate(event.date)}</time>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(event.date)}
                        {event.endDate && ` - ${formatTime(event.endDate)}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start text-gray-700" role="listitem">
                    <MapPinIcon className="w-5 h-5 mr-3 text-red-500 mt-0.5" aria-hidden="true" />
                    <address className="not-italic">
                      <div className="font-medium">{event.location.name}</div>
                      <div className="text-sm text-gray-500">
                        {event.location.address}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.location.city}, {event.location.country}
                      </div>
                    </address>
                  </div>

                  {event.capacity && (
                    <div className="flex items-center text-gray-700" role="listitem">
                      <UsersIcon className="w-5 h-5 mr-3 text-green-500" aria-hidden="true" />
                      <div>
                        <div className="font-medium">
                          {event.attendeesCount || 0} / {event.capacity} attendees
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.capacity - (event.attendeesCount || 0)} spots remaining
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {event.tags.length > 0 && (
                    <div>
                      <h2 className="font-medium text-gray-900 mb-2">Tags</h2>
                      <div className="flex flex-wrap gap-2" role="list" aria-label="Event tags">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" role="listitem">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button 
                      size="lg" 
                      className="w-full focus:ring-2 focus:ring-blue-500"
                      aria-label={`Register for ${event.title}`}
                    >
                      Register for Event
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-medium text-gray-900 mb-3">About this event</h2>
                <p className="text-gray-700 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default EventDetails;
