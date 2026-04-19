/**
 * @description 주어진 값을 와일드카드로 감싸서 반환합니다.
 * @param value 와일드카드로 감쌀 값
 */
export const wrapWithWildcard = (value: string): string => {
    return `%${value}%`;
};
