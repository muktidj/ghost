import { Request, Response } from 'express';
import dayjs from 'dayjs';

export const healthcheck = (req: Request, res: Response) => {
  const data = {
    message: 'Ok',
    uptime: dayjs()
      .subtract(process.uptime(), 'second')
      .format('YYYY-MM-DD HH:mm:ss'),
    date: dayjs().format('YYYY-MM-DD HH:mm:ss')
  };

  res.status(200).send(data);
};
