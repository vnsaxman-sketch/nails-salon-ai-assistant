export type AppointmentStatus =
  | 'Scheduled'
  | 'Completed'
  | 'Cancelled'
  | 'No-show';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  visits: number;
  lastVisit: string;
  favoriteService: string;
  totalSpent: number;
  notes: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: AppointmentStatus;
  notes: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface SalonData {
  clients: Client[];
  appointments: Appointment[];
  services: Service[];
}
