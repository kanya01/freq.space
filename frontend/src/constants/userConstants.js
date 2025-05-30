// These should match the backend enums exactly
export const USER_TYPES = {
    ARTIST: 'Artist',
    PRODUCER: 'Producer',
    ENGINEER: 'Engineer',
    SONGWRITER: 'Songwriter',
    VOCALIST: 'Vocalist',
    SESSION_MUSICIAN: 'Session Musician',
    VIDEO_PRODUCER: 'Video Producer'
};

export const EXPERIENCE_LEVELS = {
    HOBBYIST: 'Hobbyist',
    PART_TIME: 'Part-time',
    PRO: 'Pro',
    MAESTRO: 'Maestro'
};

export const EXPERIENCE_ICONS = {
    [EXPERIENCE_LEVELS.HOBBYIST]: '🌱',
    [EXPERIENCE_LEVELS.PART_TIME]: '⚡',
    [EXPERIENCE_LEVELS.PRO]: '🎯',
    [EXPERIENCE_LEVELS.MAESTRO]: '👑'
};