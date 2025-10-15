/**
 * Date Utilities
 * 
 * Helper functions for date manipulation, time slot generation, and calendar calculations
 */

import { addDays, format, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import type { TimeSlot } from '@/types';

/**
 * Generate time slots for a given date
 * Creates 30-minute slots from 8 AM to 6 PM
 */
export function generateTimeSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  for (let hour = 8; hour < 18; hour++) {
    for (let minute of [0, 30]) {
      const start = new Date(date);
      start.setHours(hour, minute, 0, 0);
      
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 30);
      
      const label = format(start, 'h:mm a');
      
      slots.push({
        start,
        end,
        label,
      });
    }
  }
  
  return slots;
}

/**
 * Get the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
}

/**
 * Get the end of the week (Sunday) for a given date
 */
export function getWeekEnd(date: Date): Date {
  return endOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
}

/**
 * Get an array of 7 dates representing the week (Monday through Sunday)
 */
export function getWeekDays(weekStartDate: Date): Date[] {
  const days: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    days.push(addDays(weekStartDate, i));
  }
  
  return days;
}

/**
 * Check if an appointment overlaps with a time slot
 */
export function appointmentOverlapsSlot(
  appointmentStart: Date,
  appointmentEnd: Date,
  slotStart: Date,
  slotEnd: Date
): boolean {
  return appointmentStart < slotEnd && appointmentEnd > slotStart;
}

/**
 * Get appointments that overlap with a specific time slot
 */
export function getAppointmentsForSlot<T extends { startTime: string; endTime: string }>(
  appointments: T[],
  slotStart: Date,
  slotEnd: Date
): T[] {
  return appointments.filter(appointment => {
    const appointmentStart = new Date(appointment.startTime);
    const appointmentEnd = new Date(appointment.endTime);
    
    return appointmentOverlapsSlot(appointmentStart, appointmentEnd, slotStart, slotEnd);
  });
}

/**
 * Get appointments for a specific day
 */
export function getAppointmentsForDay<T extends { startTime: string }>(
  appointments: T[],
  date: Date
): T[] {
  return appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.startTime);
    return isSameDay(appointmentDate, date);
  });
}

/**
 * Calculate the position and height of an appointment in a time slot grid
 * Returns percentage values for CSS positioning
 */
export function calculateAppointmentPosition(
  appointmentStart: Date,
  appointmentEnd: Date,
  slotStart: Date,
  slotEnd: Date,
  slotHeight: number = 60 // Height of each time slot in pixels
): { top: number; height: number } {
  const slotDuration = slotEnd.getTime() - slotStart.getTime();
  const appointmentDuration = appointmentEnd.getTime() - appointmentStart.getTime();
  
  // Calculate how much of the appointment is before this slot
  const beforeSlot = Math.max(0, slotStart.getTime() - appointmentStart.getTime());
  
  // Calculate the top position as a percentage of the slot
  const top = (beforeSlot / slotDuration) * 100;
  
  // Calculate the height as a percentage of the slot
  const height = (appointmentDuration / slotDuration) * 100;
  
  return { top, height };
}

/**
 * Format a date for display in the calendar header
 */
export function formatDateForHeader(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Format a week range for display in the calendar header
 */
export function formatWeekRangeForHeader(weekStart: Date, weekEnd: Date): string {
  const startFormatted = format(weekStart, 'MMM d');
  const endFormatted = format(weekEnd, 'MMM d, yyyy');
  
  if (weekStart.getFullYear() === weekEnd.getFullYear()) {
    return `${startFormatted} - ${endFormatted}`;
  } else {
    return `${format(weekStart, 'MMM d, yyyy')} - ${endFormatted}`;
  }
}

/**
 * Get the current time as a percentage of the day (for current time indicator)
 */
export function getCurrentTimePercentage(): number {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(8, 0, 0, 0); // 8 AM
  
  const endOfDay = new Date(now);
  endOfDay.setHours(18, 0, 0, 0); // 6 PM
  
  const totalDayDuration = endOfDay.getTime() - startOfDay.getTime();
  const currentTimeFromStart = now.getTime() - startOfDay.getTime();
  
  return Math.max(0, Math.min(100, (currentTimeFromStart / totalDayDuration) * 100));
}
