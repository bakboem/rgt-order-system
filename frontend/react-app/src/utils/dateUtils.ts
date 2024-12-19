
import {
  format,
  parse,
  addDays,
  subDays,
  differenceInDays,
  isBefore,
  isAfter,
  isSameDay,
} from "date-fns";

class DateUtils {

  static formatDate(
    date: Date | string,
    dateFormat: string = "yyyy-MM-dd"
  ): string {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return format(parsedDate, dateFormat);
  }


  static parseDate(
    dateString: string,
    dateFormat: string = "yyyy-MM-dd"
  ): Date {
    return parse(dateString, dateFormat, new Date());
  }


  static compareDates(date1: Date, date2: Date): number {
    if (isSameDay(date1, date2)) return 0;
    return isBefore(date1, date2) ? -1 : 1;
  }


  static differenceInDays(date1: Date, date2: Date): number {
    return differenceInDays(date1, date2);
  }


  static addDaysToDate(date: Date, days: number): Date {
    return addDays(date, days);
  }


  static subtractDaysFromDate(date: Date, days: number): Date {
    return subDays(date, days);
  }


  static isBefore(date1: Date, date2: Date): boolean {
    return isBefore(date1, date2);
  }

  
  static isAfter(date1: Date, date2: Date): boolean {
    return isAfter(date1, date2);
  }

  static calculateAge(birthDate: Date | string): number {
    if (!(birthDate instanceof Date)) {
      birthDate = new Date(birthDate); 
    }

    if (typeof birthDate === "string") {
      birthDate = new Date(birthDate);
    }

    if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
      throw new Error("Invalid date provided for birthDate");
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  }
}

export default DateUtils;
