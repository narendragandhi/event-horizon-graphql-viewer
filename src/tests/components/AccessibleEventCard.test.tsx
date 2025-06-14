import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import { AccessibleEventCard } from '@/components/AccessibleEventCard';
import { Event } from '@/types/event';

const mockEvent: Event = {
  id: '1',
  title: 'Test Event',
  description: 'A test event description',
  date: '2024-07-15T09:00:00Z',
  location: {
    name: 'Test Venue',
    address: '123 Test St',
    city: 'Test City',
    country: 'Test Country'
  },
  eventType: 'Conference',
  organizer: 'Test Organizer',
  tags: ['test', 'event'],
  capacity: 100,
  attendeesCount: 50
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AccessibleEventCard', () => {
  it('should render event information correctly', () => {
    renderWithRouter(<AccessibleEventCard event={mockEvent} index={0} />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('A test event description')).toBeInTheDocument();
    expect(screen.getByText('Test Venue, Test City')).toBeInTheDocument();
    expect(screen.getByText('By Test Organizer')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderWithRouter(<AccessibleEventCard event={mockEvent} index={0} />);
    
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-labelledby', `event-title-${mockEvent.id}`);
    expect(article).toHaveAttribute('aria-describedby', `event-description-${mockEvent.id}`);
  });

  it('should display capacity information when available', () => {
    renderWithRouter(<AccessibleEventCard event={mockEvent} index={0} />);
    
    expect(screen.getByText('50 / 100 attendees')).toBeInTheDocument();
  });

  it('should display event tags', () => {
    renderWithRouter(<AccessibleEventCard event={mockEvent} index={0} />);
    
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('event')).toBeInTheDocument();
  });

  it('should have accessible button with proper label', () => {
    renderWithRouter(<AccessibleEventCard event={mockEvent} index={0} />);
    
    const button = screen.getByRole('button', { name: /view details for test event/i });
    expect(button).toBeInTheDocument();
  });
});
