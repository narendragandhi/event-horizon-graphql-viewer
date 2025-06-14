
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { mockGraphQLService } from '@/services/mockGraphQLService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowLeftIcon, ClockIcon } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Get all events and find the one with matching ID
        const events = await mockGraphQLService.fetchEvents();
        const foundEvent = events.find(e => e.id === id);
        setEvent(foundEvent || null);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600">The event you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/')} 
          variant="outline" 
          className="mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Events
        </Button>

        <Card className="overflow-hidden">
          {event.imageUrl && (
            <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 relative">
              <img 
                src={event.imageUrl} 
                alt={event.title}
                className="w-full h-full object-cover"
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
                <div className="text-right">
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
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <CalendarIcon className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <div className="font-medium">{formatDate(event.date)}</div>
                    <div className="text-sm text-gray-500">
                      {formatTime(event.date)}
                      {event.endDate && ` - ${formatTime(event.endDate)}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-start text-gray-700">
                  <MapPinIcon className="w-5 h-5 mr-3 text-red-500 mt-0.5" />
                  <div>
                    <div className="font-medium">{event.location.name}</div>
                    <div className="text-sm text-gray-500">
                      {event.location.address}
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.location.city}, {event.location.country}
                    </div>
                  </div>
                </div>

                {event.capacity && (
                  <div className="flex items-center text-gray-700">
                    <UsersIcon className="w-5 h-5 mr-3 text-green-500" />
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
                    <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button size="lg" className="w-full">
                    Register for Event
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">About this event</h3>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetails;
