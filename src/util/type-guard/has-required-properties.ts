/**
 * @description 객체에 필요한 속성이 모두 있는지 확인합니다.
 * @param obj 확인할 객체
 * @param properties 필요한 속성 목록
 */
export const hasRequiredProperties = <T, K extends keyof T>(
    obj: T,
    properties: K[],
): obj is T & Required<Pick<T, K>> => {
    return properties.every((property) => obj[property] !== undefined);
};
