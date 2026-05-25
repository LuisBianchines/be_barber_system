import { AppError } from '../../middlewares/app-error';
import * as usersRepository from './users.repository';
import { UpdateUserInput } from './users.types';

export async function getAll() {
  return usersRepository.findAll();
}

export async function getById(id: string) {
  const user = await usersRepository.findById(id);
  if (!user) throw new AppError('Usuário não encontrado.', 404);
  return user;
}

export async function update(id: string, data: UpdateUserInput) {
  await getById(id);
  return usersRepository.updateById(id, data);
}
