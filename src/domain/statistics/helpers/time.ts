import { startOfWeek, startOfMonth } from 'date-fns'

export const TimeHandler = {
  WEEK_INIT: startOfWeek(new Date(), { weekStartsOn: 0 }),
  MONTH_INIT: startOfMonth(new Date())
}
