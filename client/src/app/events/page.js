'use client';

import { useState, useEffect, useCallback } from 'react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      // Using /api/events will be proxied to Flask by Next.js
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-lg">Loading events...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-500">Error: {error}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      
      {events.length === 0 ? (
        <p>No events found. Add some events to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-2">{event.description}</p>
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-semibold">Location:</span> {event.location_name}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-semibold">Category:</span> {event.category}
              </div>
              <div className="text-lg font-bold text-blue-600 mt-2">
                {event.currency} {event.price}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(event.starts_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}