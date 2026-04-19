/**
 * @description 값이 null 또는 undefined인지 확인합니다.
 * @param value
 */
export const isNotNil = <T>(value: T | null | undefined): value is T => {
    return value !== undefined && value !== null;
};
