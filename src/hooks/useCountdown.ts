import { useState, useEffect, useCallback } from 'react';
import type { CountdownEvent, TimeParts } from '../types';
import { getTimeRemaining, generateId } from '../utils/date';

const STORAGE_KEY = 'countdown-events';

export function useCountdown() {
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [times, setTimes] = useState<Record<string, TimeParts>>({});
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CountdownEvent[];
        setEvents(parsed);
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events, loaded]);

  // Update countdown times every second
  useEffect(() => {
    const updateTimes = () => {
      const newTimes: Record<string, TimeParts> = {};
      events.forEach((event) => {
        newTimes[event.id] = getTimeRemaining(event.targetDate);
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [events]);

  const addEvent = useCallback((event: Omit<CountdownEvent, 'id' | 'createdAt' | 'updatedAt' | 'isFinished'>) => {
    const now = new Date().toISOString();
    const newEvent: CountdownEvent = {
      ...event,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      isFinished: false,
    };
    setEvents((prev) => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CountdownEvent>) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
      )
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const reorderEvents = useCallback((newOrder: CountdownEvent[]) => {
    setEvents(newOrder);
  }, []);

  return {
    events,
    times,
    loaded,
    addEvent,
    updateEvent,
    deleteEvent,
    reorderEvents,
  };
}
