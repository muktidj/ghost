import dayjs from 'dayjs';

export const responseDate = (date: Date, timezone: number | null = null) => {
  if (timezone) dayjs(date).add(timezone, 'hour').toDate();

  return dayjs(date).add(7, 'hour').toDate();
};

export const todayDate = () => {
  return dayjs().toDate();
};
