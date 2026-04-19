import { FindOperator, ILike, Or } from 'typeorm';

import { wrapWithWildcard } from '@src/util/wrap-with-wildcard';

export const wrapWithOrILikeOperator = (
    value: string[],
): FindOperator<string> => {
    return Or(...value.map((item) => ILike(wrapWithWildcard(item))));
};
