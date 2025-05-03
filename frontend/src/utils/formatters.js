// frontend/src/utils/formatters.js

/**
 * Format seconds into mm:ss format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string (mm:ss)
 */
export const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format a timestamp into a human-readable string
 * @param {string|number|Date} timestamp - Date to format
 * @returns {string} Relative time string (e.g., "2 days ago")
 */
export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    // Time intervals in seconds
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    // Check each interval
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);

        if (interval >= 1) {
            return interval === 1
                ? `1 ${unit} ago`
                : `${interval} ${unit}s ago`;
        }
    }

    return 'just now';
};