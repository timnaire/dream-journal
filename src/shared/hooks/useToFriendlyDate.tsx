import moment from 'moment';

export function useToFriendlyDate(date: string | Date, withTime = false) {
  let friendlyDateFormat = `ll ${withTime ? ' LT' : ''}`;
  let toFriendlyDate: string;
  if (typeof date === 'string') {
    toFriendlyDate = moment(date).format(friendlyDateFormat);
  } else {
    toFriendlyDate = moment(new Date(date).toISOString()).format(friendlyDateFormat);
  }

  return toFriendlyDate;
}
