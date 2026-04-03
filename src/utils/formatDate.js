import dayjs from 'dayjs';

export const formatDate = (date, format = 'MMM DD, YYYY') => {
  return dayjs(date).format(format);
};

export const formatTime = (time) => {
  return dayjs(time).format('HH:mm');
};
