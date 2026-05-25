import * as repo from './reports.repository';

export function getSummary(startDate?: string, endDate?: string) {
  const now = new Date();
  const start = startDate
    ? new Date(startDate)
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const end = endDate
    ? new Date(endDate)
    : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return repo.getSummary(start, end);
}
