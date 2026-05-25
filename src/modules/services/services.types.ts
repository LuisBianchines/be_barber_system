export interface CreateServiceInput {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  active?: boolean;
}
