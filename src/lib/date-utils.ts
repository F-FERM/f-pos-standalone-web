export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] as const
  
  export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const
  
  export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate()
  }
  
  export function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay()
  }
  
  export function generateYearRange(startYear?: number, endYear?: number): number[] {
    const currentYear = new Date().getFullYear()
    const start = startYear || currentYear - 100
    const end = endYear || currentYear + 10
  
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }
  
  export function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }
  
  export function isToday(date: Date): boolean {
    return isSameDay(date, new Date())
  }
  
  export function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  