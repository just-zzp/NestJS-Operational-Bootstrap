import { AuthenticatedUser } from '@src/common/types/authenticated-user';

declare module 'express-serve-static-core' {
    interface Request {
        user?: AuthenticatedUser;
    }
}
