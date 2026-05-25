export interface CreateBarberInput {
  userId: string;
  bio?: string;
}

export interface UpdateBarberInput {
  bio?: string;
  active?: boolean;
}

export interface AvailabilityInput {
  weekday: number;
  startTime: string;
  endTime: string;
}
