import { DateDTO } from 'app/types';
import * as format from 'date-fns/format';

export function convertDateForIos(dateString: DateDTO): Date {
  /** https://stackoverflow.com/questions/26657353/date-on-ios-device-returns-nan/26671796#comment76427981_26671796 */
  /** https://stackoverflow.com/questions/6427204/date-parsing-in-javascript-is-different-between-safari-and-chrome  */
  return new Date(dateString.replace(/-/g, '/').replace('T', ' ').replace(/\..*|\+.*/, ''));
}

export const buildDateAndTimeFormat = (
  dateString?: string,
): string => {
  if (!dateString) {
    return '';
  }
  const date: Date = convertDateForIos(dateString);
  const formatString: string = format(date, 'YYYY.MM.DD. HH:mm');
  return formatString;
};

export const buildOnlyDateFormat = (dateString?: string): string => {
  if (!dateString) {
    return '';
  }
  const date: Date = convertDateForIos(dateString);
  const formatString: string = format(date, 'YYYY.MM.DD.');
  return formatString;
};
