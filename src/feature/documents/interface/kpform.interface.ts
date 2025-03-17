// kpform.interface.ts

/**
 * Interface for KP Form 1 payload (Notice to Constitute the Lupon)
 */
export interface KPForm1Payload {
  // Common fields
  municipality?: string;
  barangay?: string;
  date?: Date | string;
  barangayHead?: string;

  // Form 1 specific fields
  year?: string;
  month?: string;
  lastDay?: string;
  luponMembers?: string[];
  appointedPersons?: Array<{ name: string }>;

  // Additional metadata
  currentDate?: Date;
}

/**
 * Interface for KP Form 2 payload (Appointment)
 */
export interface KPForm2Payload {
  // Common fields
  municipality?: string;
  barangay?: string;
  date?: Date | string;
  barangayHead?: string;

  // Form 2 specific fields
  appointmentTo?: string;
  barangaySecretary?: string;

  // Additional metadata
  currentDate?: Date;
}
