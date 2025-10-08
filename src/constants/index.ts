export const SORT_MODES = ['Hot', 'TimeDesc', 'OrderDesc', 'ProgressDesc'] as const;
export const FILTER_MODES = ['all', 'chinese', 'bsc'] as const;

export type SortMode = typeof SORT_MODES[number];
export type FilterMode = typeof FILTER_MODES[number];
