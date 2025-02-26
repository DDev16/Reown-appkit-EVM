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