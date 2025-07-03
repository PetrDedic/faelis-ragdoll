/**
 * Utility functions for date handling
 */

/**
 * Converts a Date object to a YYYY-MM-DD string in local timezone
 * This prevents the timezone shift issue that occurs with toISOString()
 */
export function formatDateToLocalString(date: Date | null): string | null {
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Converts a date string (YYYY-MM-DD) to a Date object
 * This ensures the date is interpreted in local timezone
 */
export function parseDateString(dateString: string | null): Date | null {
  if (!dateString) return null;

  // Create date in local timezone by parsing the string
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}
