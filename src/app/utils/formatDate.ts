import { DateDTO } from 'app/types';
import * as format from 'date-fns/format';

export const koreanDayOfWeek: string[] = ['일', '월', '화', '수', '목', '금', '토'];

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

export const buildKoreanDayDateFormat = (dateString?: string): string => {
  if (!dateString) {
    return '';
  }
  const date: Date = convertDateForIos(dateString);
  const formatString: string = format(date, 'YYYY년 MM월 DD일');
  const weekDayIndex: number = parseInt(format(date, 'd'), 10);
  return `${formatString}(${koreanDayOfWeek[weekDayIndex]})`;
};
