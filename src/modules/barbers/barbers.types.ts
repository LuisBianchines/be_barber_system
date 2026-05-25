export interface CreateBarberWithUserInput {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export interface UpdateBarberInput {
  bio?: string;
}

export interface AvailabilityItem {
  weekday: number;
  startTime: string;
  endTime: string;
  active: boolean;
}

export interface BulkAvailabilityInput {
  items: AvailabilityItem[];
}
