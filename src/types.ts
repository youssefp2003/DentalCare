export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;  // Changed from phone to phoneNumber to match backend
  dateOfBirth: string;
  medicalHistory: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: string;
  notes: string;
}

export interface AppointmentDTO extends Appointment {
  patientFirstName: string;
  patientLastName: string;
}

export interface Treatment {
  id: string;
  patientId: string;
  date: string;
  procedure: string;
  notes: string;
  cost: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'practitioner' | 'assistant';
}