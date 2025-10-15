/**
 * DayView Component
 *
 * Displays appointments for a single day in a timeline format.
 *
 * TODO for candidates:
 * 1. Generate time slots (8 AM - 6 PM, 30-minute intervals)
 * 2. Position appointments in their correct time slots
 * 3. Handle appointments that span multiple slots
 * 4. Display appointment details (patient, type, duration)
 * 5. Color-code appointments by type
 * 6. Handle overlapping appointments gracefully
 */

'use client';

import type { Appointment, Doctor, TimeSlot } from '@/types';
import { generateTimeSlots, getAppointmentsForSlot, formatDateForHeader } from '@/utils/dateUtils';
import { AppointmentCard } from './AppointmentCard';

interface DayViewProps {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  date: Date;
}

/**
 * DayView Component
 *
 * Renders a daily timeline view with appointments.
 *
 * TODO: Implement this component
 *
 * Architecture suggestions:
 * 1. Create a helper function to generate time slots
 * 2. Create a TimeSlotRow component for each time slot
 * 3. Create an AppointmentCard component for each appointment
 * 4. Calculate appointment positioning based on start/end times
 *
 * Consider:
 * - How to handle appointments that span multiple 30-min slots?
 * - How to show overlapping appointments?
 * - How to make the timeline scrollable if needed?
 * - How to highlight the current time?
 */
export function DayView({ appointments, doctor, date }: DayViewProps) {
  /**
   * Find appointments for a specific time slot
   *
   * Given a time slot, find all appointments that overlap with it
   */
  function getAppointmentsForTimeSlot(slot: TimeSlot): Appointment[] {
    return getAppointmentsForSlot(appointments, slot.start, slot.end);
  }

  const timeSlots = generateTimeSlots(date);

  return (
    <div className="day-view">
      {/* Day header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {formatDateForHeader(date)}
        </h3>
        {doctor && (
          <p className="text-sm text-gray-600">
            Dr. {doctor.name} - {doctor.specialty}
          </p>
        )}
      </div>

      {/* Timeline grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-100">
          {timeSlots.map((slot, index) => {
            const slotAppointments = getAppointmentsForTimeSlot(slot);
            
            return (
              <div key={index} className="flex min-h-[60px]">
                <div className="w-24 p-2 text-sm text-gray-600 bg-gray-50 border-r border-gray-200 flex items-center">
                  {slot.label}
                </div>
                <div className="flex-1 p-2 relative">
                  {slotAppointments.length > 0 ? (
                    <div className="space-y-1">
                      {slotAppointments.map(appointment => (
                        <AppointmentCard 
                          key={appointment.id} 
                          appointment={appointment}
                          className="w-full"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center">
                      <span className="text-gray-400 text-xs">Available</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {appointments.length === 0 && (
        <div className="mt-4 text-center text-gray-500 text-sm">
          No appointments scheduled for this day
        </div>
      )}
    </div>
  );
}

/**
 * TODO: Create an AppointmentCard component
 *
 * This should be a small, reusable component that displays
 * a single appointment with appropriate styling.
 *
 * Consider:
 * - Show patient name
 * - Show appointment type
 * - Show duration
 * - Color-code by appointment type (use APPOINTMENT_TYPE_CONFIG from types)
 * - Make it visually clear when appointments span multiple slots
 */
