export interface AuthenticatedUser {
    [key: string]: unknown;
    sub: string | number;
    role?: string;
    roles?: string[];
}
