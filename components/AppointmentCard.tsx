/**
 * AppointmentCard Component
 * 
 * A reusable component for displaying appointment information
 * with color coding and proper styling
 */

'use client';

import type { Appointment, PopulatedAppointment } from '@/types';
import { APPOINTMENT_TYPE_CONFIG } from '@/types';
import { appointmentService } from '@/services/appointmentService';

interface AppointmentCardProps {
  appointment: Appointment;
  compact?: boolean;
  className?: string;
}

/**
 * AppointmentCard Component
 * 
 * Displays appointment information with color coding based on appointment type
 */
export function AppointmentCard({ appointment, compact = false, className = '' }: AppointmentCardProps) {
  // Get populated appointment data
  const populatedAppointment = appointmentService.getPopulatedAppointment(appointment);
  
  if (!populatedAppointment) {
    return null;
  }

  const { patient, type } = populatedAppointment;
  const typeConfig = APPOINTMENT_TYPE_CONFIG[type];
  
  // Calculate duration
  const startTime = new Date(appointment.startTime);
  const endTime = new Date(appointment.endTime);
  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
  
  // Format time
  const timeString = startTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const baseClasses = `
    rounded-lg border-l-4 p-2 text-white text-xs
    transition-all duration-200 hover:shadow-md
    ${className}
  `;

  const compactClasses = compact ? 'p-1 text-xs' : 'p-2 text-sm';
  
  const cardClasses = `${baseClasses} ${compactClasses}`;

  return (
    <div
      className={cardClasses}
      style={{
        backgroundColor: typeConfig.color,
        borderLeftColor: typeConfig.color,
      }}
      title={`${patient.name} - ${typeConfig.label} (${durationMinutes} min)`}
    >
      <div className="font-semibold truncate">
        {patient.name}
      </div>
      
      {!compact && (
        <div className="text-xs opacity-90 mt-1">
          {typeConfig.label}
        </div>
      )}
      
      <div className="text-xs opacity-75 mt-1">
        {timeString} • {durationMinutes} min
      </div>
      
      {appointment.notes && !compact && (
        <div className="text-xs opacity-75 mt-1 truncate">
          {appointment.notes}
        </div>
      )}
    </div>
  );
}

/**
 * Compact version for week view
 */
export function CompactAppointmentCard({ appointment, className = '' }: AppointmentCardProps) {
  return (
    <AppointmentCard 
      appointment={appointment} 
      compact={true} 
      className={className}
    />
  );
}
