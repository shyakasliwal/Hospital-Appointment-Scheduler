/**
 * Appointment Service
 *
 * This service provides an abstraction layer for accessing appointment data.
 * It's your data access layer - implement the methods to fetch and filter appointments.
 *
 * TODO for candidates:
 * 1. Implement getAppointmentsByDoctor
 * 2. Implement getAppointmentsByDoctorAndDate
 * 3. Implement getAppointmentsByDoctorAndDateRange (for week view)
 * 4. Consider adding helper methods for filtering, sorting, etc.
 * 5. Think about how to structure this for testability
 */

import type { Appointment, Doctor, Patient, PopulatedAppointment } from '@/types';
import {
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  MOCK_PATIENTS,
  getDoctorById,
  getPatientById,
} from '@/data/mockData';

/**
 * AppointmentService class
 *
 * Provides methods to access and manipulate appointment data.
 * This is where you abstract data access from your components.
 */
export class AppointmentService {
  /**
   * Get all appointments for a specific doctor
   *
   * TODO: Implement this method
   */
  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return MOCK_APPOINTMENTS.filter(appointment => appointment.doctorId === doctorId);
  }

  /**
   * Get appointments for a specific doctor on a specific date
   *
   * TODO: Implement this method
   * @param doctorId - The doctor's ID
   * @param date - The date to filter by
   * @returns Array of appointments for that doctor on that date
   */
  getAppointmentsByDoctorAndDate(doctorId: string, date: Date): Appointment[] {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return MOCK_APPOINTMENTS.filter(appointment => {
      if (appointment.doctorId !== doctorId) return false;
      
      const appointmentStart = new Date(appointment.startTime);
      return appointmentStart >= startOfDay && appointmentStart <= endOfDay;
    });
  }

  /**
   * Get appointments for a specific doctor within a date range (for week view)
   *
   * TODO: Implement this method
   * @param doctorId - The doctor's ID
   * @param startDate - Start of the date range
   * @param endDate - End of the date range
   * @returns Array of appointments within the date range
   */
  getAppointmentsByDoctorAndDateRange(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ): Appointment[] {
    return MOCK_APPOINTMENTS.filter(appointment => {
      if (appointment.doctorId !== doctorId) return false;
      
      const appointmentStart = new Date(appointment.startTime);
      return appointmentStart >= startDate && appointmentStart <= endDate;
    });
  }

  /**
   * Get a populated appointment (with patient and doctor objects)
   *
   * This is useful for display purposes where you need patient/doctor details
   *
   * TODO: Implement this helper method
   */
  getPopulatedAppointment(appointment: Appointment): PopulatedAppointment | null {
    const doctor = getDoctorById(appointment.doctorId);
    const patient = getPatientById(appointment.patientId);
    
    if (!doctor || !patient) {
      return null;
    }
    
    return {
      ...appointment,
      doctor,
      patient,
    };
  }

  /**
   * Get all doctors
   *
   * TODO: Implement this method
   */
  getAllDoctors(): Doctor[] {
    return MOCK_DOCTORS;
  }

  /**
   * Get doctor by ID
   *
   * TODO: Implement this method
   */
  getDoctorById(id: string): Doctor | undefined {
    return getDoctorById(id);
  }

  /**
   * Sort appointments by start time
   */
  sortAppointmentsByTime(appointments: Appointment[]): Appointment[] {
    return [...appointments].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }

  /**
   * Get appointments by type
   */
  getAppointmentsByType(appointments: Appointment[], type: string): Appointment[] {
    return appointments.filter(appointment => appointment.type === type);
  }

  /**
   * Check if two appointments overlap
   */
  appointmentsOverlap(appointment1: Appointment, appointment2: Appointment): boolean {
    const start1 = new Date(appointment1.startTime);
    const end1 = new Date(appointment1.endTime);
    const start2 = new Date(appointment2.startTime);
    const end2 = new Date(appointment2.endTime);
    
    return start1 < end2 && start2 < end1;
  }
}

/**
 * Singleton instance (optional pattern)
 *
 * You can either:
 * 1. Export a singleton instance: export const appointmentService = new AppointmentService();
 * 2. Or let consumers create their own instances: new AppointmentService()
 *
 * Consider which is better for your architecture and testing needs.
 */
export const appointmentService = new AppointmentService();
