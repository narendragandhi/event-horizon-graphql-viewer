
import { Event } from '@/types/event';
import { EventCard } from './EventCard';

interface EventListProps {
  events: Event[];
}

export const EventList = ({ events }: EventListProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🎪</div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-600">Try adjusting your filters to see more events</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
