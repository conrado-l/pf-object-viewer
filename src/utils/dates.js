import moment from 'moment'
import dates from '@/consts/dates'
/**
 * Generates a short date format from unix time
 * @param {number} unixtime
 */
export function unixtimeToShortDate (unixtime) {
  return moment.unix(unixtime).format(dates.SHORT_DATE_FORMAT)
}
