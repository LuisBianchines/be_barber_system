export interface AppointmentNotificationInput {
  clientName: string;
  clientEmail: string;
  barberName: string;
  serviceName: string;
  appointmentDate: string;
  startTime: string;
}

interface NotificationService {
  sendAppointmentCreated(input: AppointmentNotificationInput): Promise<void>;
  sendAppointmentCancelled(input: AppointmentNotificationInput): Promise<void>;
}

class ConsoleNotificationService implements NotificationService {
  async sendAppointmentCreated(input: AppointmentNotificationInput): Promise<void> {
    console.log(`[NOTIFICAÇÃO] Agendamento criado — Cliente: ${input.clientName} (${input.clientEmail}) | Barbeiro: ${input.barberName} | Serviço: ${input.serviceName} | ${input.appointmentDate} às ${input.startTime}`);
  }

  async sendAppointmentCancelled(input: AppointmentNotificationInput): Promise<void> {
    console.log(`[NOTIFICAÇÃO] Agendamento cancelado — Cliente: ${input.clientName} (${input.clientEmail}) | Barbeiro: ${input.barberName} | Serviço: ${input.serviceName} | ${input.appointmentDate} às ${input.startTime}`);
  }
}

export const notificationService: NotificationService = new ConsoleNotificationService();
