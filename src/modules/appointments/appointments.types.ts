export interface CreateAppointmentInput {
  barberId: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
}

export interface RescheduleInput {
  appointmentDate: string;
  startTime: string;
}
