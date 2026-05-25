import { Request, Response, NextFunction } from 'express';
import * as reportsService from './reports.service';

export async function getSummaryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query as Record<string, string | undefined>;
    return res.json(await reportsService.getSummary(startDate, endDate));
  } catch (err) { return next(err); }
}
