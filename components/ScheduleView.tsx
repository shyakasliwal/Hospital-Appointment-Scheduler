/**
 * ScheduleView Component
 *
 * Main component that orchestrates the schedule display.
 * This component should compose smaller components together.
 *
 * TODO for candidates:
 * 1. Create the component structure (header, controls, calendar)
 * 2. Compose DoctorSelector, DayView, WeekView together
 * 3. Handle view switching (day vs week)
 * 4. Manage state or use the useAppointments hook
 * 5. Think about component composition and reusability
 */

'use client';

import { useState } from 'react';
import type { CalendarView } from '@/types';
import { DoctorSelector } from './DoctorSelector';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { useAppointments } from '@/hooks/useAppointments';
import { getWeekStart, getWeekEnd } from '@/utils/dateUtils';

interface ScheduleViewProps {
  selectedDoctorId: string;
  selectedDate: Date;
  view: CalendarView;
  onDoctorChange: (doctorId: string) => void;
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
}

/**
 * ScheduleView Component
 *
 * This is the main container component for the schedule interface.
 *
 * TODO: Implement this component
 *
 * Consider:
 * - How to structure the layout (header, controls, calendar)
 * - How to compose smaller components
 * - How to pass data down to child components
 * - How to handle user interactions (view switching, date changes)
 */
export function ScheduleView({
  selectedDoctorId,
  selectedDate,
  view,
  onDoctorChange,
  onDateChange,
  onViewChange,
}: ScheduleViewProps) {
  // Calculate date range for week view
  const weekStartDate = getWeekStart(selectedDate);
  const weekEndDate = getWeekEnd(selectedDate);

  // Use the useAppointments hook to fetch data
  const { appointments, doctor, loading, error } = useAppointments({
    doctorId: selectedDoctorId,
    date: selectedDate,
    startDate: view === 'week' ? weekStartDate : undefined,
    endDate: view === 'week' ? weekEndDate : undefined,
  });

  // Handle date navigation
  const handlePreviousDate = () => {
    const newDate = new Date(selectedDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    onDateChange(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(selectedDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading appointments</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header with doctor info and controls */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Doctor Schedule</h2>
            {doctor && (
              <p className="text-sm text-gray-600 mt-1">
                Dr. {doctor.name} - {doctor.specialty}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Doctor Selector */}
            <div className="w-full sm:w-64">
              <DoctorSelector
                selectedDoctorId={selectedDoctorId}
                onDoctorChange={onDoctorChange}
              />
            </div>

            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousDate}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                title={`Previous ${view === 'day' ? 'day' : 'week'}`}
              >
                ←
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Go to today"
              >
                Today
              </button>
              <button
                onClick={handleNextDate}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                title={`Next ${view === 'day' ? 'day' : 'week'}`}
              >
                →
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  view === 'day'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => onViewChange('day')}
              >
                Day
              </button>
              <button
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  view === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => onViewChange('week')}
              >
                Week
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="p-6">
        {view === 'day' ? (
          <DayView
            appointments={appointments}
            doctor={doctor}
            date={selectedDate}
          />
        ) : (
          <WeekView
            appointments={appointments}
            doctor={doctor}
            weekStartDate={weekStartDate}
          />
        )}
      </div>
    </div>
  );
}
