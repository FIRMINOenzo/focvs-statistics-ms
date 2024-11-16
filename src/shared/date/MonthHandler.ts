import { Months } from './Months';

type GetMonthOptions = {
  /**
   * If true, the month will be returned as a zero-based index (0 for January, 11 for December).
   * If false or undefined, the month will be returned as a one-based index (1 for January, 12 for December).
   */
  startsInZero?: boolean;
};

export abstract class MonthHandler {
  private static readonly orderedMonths: Months[] = [
    Months.JANUARY,
    Months.FEBRUARY,
    Months.MARCH,
    Months.APRIL,
    Months.MAY,
    Months.JUNE,
    Months.JULY,
    Months.AUGUST,
    Months.SEPTEMBER,
    Months.OCTOBER,
    Months.NOVEMBER,
    Months.DECEMBER,
  ];

  public static getMonth(
    month: number | string,
    options?: GetMonthOptions,
  ): Months {
    switch (typeof month) {
      case 'number':
        return this.getIntegerMonth(month, options);
      case 'string':
        return this.getStringMonth(month);
      default:
        throw new TypeError('Unsupported type');
    }
  }

  private static getIntegerMonth(
    month: number,
    options?: GetMonthOptions,
  ): Months {
    const zeroBased = options?.startsInZero ?? false;
    const monthIndex = zeroBased ? month : month - 1;

    if (monthIndex < 0 || monthIndex > 11) {
      throw new RangeError(
        'Month number must be between 0 and 11 for zero-based index or 1 and 12 for one-based index',
      );
    }

    return this.orderedMonths[monthIndex];
  }

  private static getStringMonth(month: string): Months {
    const monthIndex = this.orderedMonths.findIndex((month) =>
      month.toLowerCase().startsWith(month.toLowerCase()),
    );

    if (monthIndex === -1) {
      throw new RangeError(`Invalid month string: ${month}`);
    }

    return this.orderedMonths[monthIndex];
  }
}
