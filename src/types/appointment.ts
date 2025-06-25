export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'WAITING_APPOIMENT'
  | 'IN_APPOINTMENT'
  | 'FINISHED'
  | 'CANCELED'
  | 'GIVEN_UP'
  | 'NO_SHOW';

export interface Appointment {
  id?: string;
  patient_cpf: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  patient_birth_date: string;
  userId: string;
  examsTypeId: string;
  date_start: string;
  date_end: string;
  status: AppointmentStatus;
  details: string;
  createdAt?: string;
  updatedAt?: string;
  exam_start?: string;
  exam_end?: string;
  duration_minutes?: number;
  exam_type?: string;
}
