import moment from 'moment-timezone';

export const getCurrentTime = () => {
  const date = new Date();
  let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const time = h + ':' + m;
  return time;
};
export const convertToYouTubeTimeFormat = (
  date: string,
  time: string,
  timeZone: string
) => {
  // Combine date and time into a single string
  const localDateTime = `${date} ${time}`;
  console.log(date, time, timeZone);

  // Convert to UTC using moment-timezone
  const utcTime = moment.tz(localDateTime, 'YYYY-MM-DD HH:mm', timeZone).utc();

  // Format the result in ISO 8601 with "Z" (Zulu time)
  return utcTime.format('YYYY-MM-DDTHH:mm:ss[Z]');
};
