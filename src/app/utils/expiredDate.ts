import { differenceInDays, differenceInMinutes, parse } from 'date-fns';

export function getExpiredDate(BookExpiredDate: string, NextBillDate?: string) {
  const currentDate = new Date();
  const bookEndDate = parse(BookExpiredDate);
  let differenceMinutes: number = differenceInMinutes(BookExpiredDate, currentDate);

  if (NextBillDate) {
    const endDate: Date = parse(NextBillDate);
    differenceMinutes = differenceInMinutes(endDate, currentDate);

    // 만료일이 25일 이상일 때는 표시 안해줘도 됨
    if (differenceInDays(bookEndDate, currentDate) > 25) {
      return '';
    }
  }

  // 1일: 1440분, 1시간: 60분
  const expiredDays = Math.floor(differenceMinutes / 1440);
  const expiredHours = Math.floor((differenceMinutes % 1440) / 60);
  const expiredMinutes = Math.floor((differenceMinutes % 1440) % 60);

  const expiredDate = `${expiredDays}일 ${expiredHours}시간 ${expiredMinutes}분 남음`;

  return expiredDate;
}
