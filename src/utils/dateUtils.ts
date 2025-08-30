export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseInputDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

export const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start && !end) return true;
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
};

export const getDateRange = (dates: Date[]): { min: Date; max: Date } | null => {
  if (dates.length === 0) return null;
  
  const validDates = dates.filter(date => !isNaN(date.getTime()));
  if (validDates.length === 0) return null;
  
  return {
    min: new Date(Math.min(...validDates.map(d => d.getTime()))),
    max: new Date(Math.max(...validDates.map(d => d.getTime())))n  };
};