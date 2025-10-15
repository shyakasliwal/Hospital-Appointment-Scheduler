/**
 * WeekView Component
 *
 * Displays appointments for a week (Monday - Sunday) in a grid format.
 *
 * TODO for candidates:
 * 1. Generate a 7-day grid (Monday through Sunday)
 * 2. Generate time slots for each day
 * 3. Position appointments in the correct day and time
 * 4. Make it responsive (may need horizontal scroll on mobile)
 * 5. Color-code appointments by type
 * 6. Handle overlapping appointments
 */

'use client';

import type { Appointment, Doctor } from '@/types';
import { generateTimeSlots, getWeekDays, getAppointmentsForDay, getAppointmentsForSlot, formatWeekRangeForHeader } from '@/utils/dateUtils';
import { CompactAppointmentCard } from './AppointmentCard';
import { format } from 'date-fns';

interface WeekViewProps {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  weekStartDate: Date; // Should be a Monday
}

/**
 * WeekView Component
 *
 * Renders a weekly calendar grid with appointments.
 *
 * TODO: Implement this component
 *
 * Architecture suggestions:
 * 1. Generate an array of 7 dates (Mon-Sun) from weekStartDate
 * 2. Generate time slots (same as DayView: 8 AM - 6 PM)
 * 3. Create a grid: rows = time slots, columns = days
 * 4. Position appointments in the correct cell (day + time)
 *
 * Consider:
 * - How to make the grid scrollable horizontally on mobile?
 * - How to show day names and dates in headers?
 * - How to handle appointments that span multiple hours?
 * - Should you reuse logic from DayView?
 */
export function WeekView({ appointments, doctor, weekStartDate }: WeekViewProps) {
  /**
   * Get appointments for a specific day and time slot
   */
  function getAppointmentsForDayAndSlot(date: Date, slotStart: Date, slotEnd: Date): Appointment[] {
    const dayAppointments = getAppointmentsForDay(appointments, date);
    return getAppointmentsForSlot(dayAppointments, slotStart, slotEnd);
  }

  const weekDays = getWeekDays(weekStartDate);
  const timeSlots = generateTimeSlots(weekStartDate);
  const weekEndDate = weekDays[6]; // Sunday

  return (
    <div className="week-view">
      {/* Week header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {formatWeekRangeForHeader(weekStartDate, weekEndDate)}
        </h3>
        {doctor && (
          <p className="text-sm text-gray-600">
            Dr. {doctor.name} - {doctor.specialty}
          </p>
        )}
      </div>

      {/* Week grid - may need horizontal scroll on mobile */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="w-20 p-2 text-xs bg-gray-50 border-r border-gray-200">Time</th>
              {weekDays.map((day, index) => (
                <th key={index} className="p-2 text-xs bg-gray-50 border-l border-gray-200 min-w-[120px]">
                  <div className="font-semibold text-gray-900">{format(day, 'EEE')}</div>
                  <div className="text-gray-600">{format(day, 'MMM d')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, slotIndex) => (
              <tr key={slotIndex} className="border-t border-gray-200">
                <td className="p-2 text-xs text-gray-600 bg-gray-50 border-r border-gray-200">
                  {slot.label}
                </td>
                {weekDays.map((day, dayIndex) => {
                  const slotAppointments = getAppointmentsForDayAndSlot(day, slot.start, slot.end);
                  
                  return (
                    <td key={dayIndex} className="p-1 border-l border-gray-200 align-top min-h-[60px]">
                      {slotAppointments.length > 0 ? (
                        <div className="space-y-1">
                          {slotAppointments.map(apt => (
                            <CompactAppointmentCard 
                              key={apt.id} 
                              appointment={apt}
                              className="w-full"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <span className="text-gray-300 text-xs">•</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {appointments.length === 0 && (
        <div className="mt-4 text-center text-gray-500 text-sm">
          No appointments scheduled for this week
        </div>
      )}
    </div>
  );
}

/**
 * TODO: Consider reusing the AppointmentCard component from DayView
 *
 * You might want to add a "compact" prop to make it smaller for week view
 */
