import { LocalDate } from '@js-joda/core';

export const compareForSorting = <T extends LocalDate>(
    a: T,
    b: T,
    sorting: 'DESC' | 'ASC' = 'ASC',
): -1 | 0 | 1 => {
    if (sorting === 'DESC') {
        if (a.isBefore(b)) {
            return 1;
        }
        return a.isAfter(b) ? -1 : 0;
    } else {
        if (a.isBefore(b)) {
            return -1;
        }
        return a.isAfter(b) ? 1 : 0;
    }
};
