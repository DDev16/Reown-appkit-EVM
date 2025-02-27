

/**
 * Format date string to human-readable format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "";
  }
};

/**
 * Format seconds to MM:SS format
 */
export const formatDuration = (seconds: number): string => {
  if (seconds === undefined || seconds === null) return "00:00";

  try {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  } catch (e) {
    console.error("Error formatting duration:", e);
    return "00:00";
  }
};

/**
 * Format minutes to human-readable time format
 */
export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Format datetime for display - accepts string or Date
 */
export const formatDateTime = (date: string | Date): string => {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error("Error formatting datetime:", e);
    return "";
  }
};

/**
 * Create a dateTimeFormatter for consistent date/time formatting
 */
export const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});