// src/utils/theme.ts
export const COLORS = {
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    subText: '#bbbbbb',
    border: '#333333',
    terran: '#3498db',
    zerg: '#9b59b6',
    protoss: '#f1c40f',
    primary: '#007AFF',
};

export const SIZES = {
    padding: 20,
    radius: 12,
    fontTitle: 24,
    fontMain: 16,
};

export const getRaceColor = (race: 'T' | 'Z' | 'P') => {
    if (race === 'T') return COLORS.terran;
    if (race === 'Z') return COLORS.zerg;
    return COLORS.protoss;
};