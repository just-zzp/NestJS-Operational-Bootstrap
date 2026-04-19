import Joi from 'joi';

export interface EnvironmentVariables {
    NODE_ENV: 'local' | 'test' | 'development' | 'production';
    PORT: number;
    SERVER_URL: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    DB_LOGGING: string;
    DB_MIGRATIONS_RUN: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    SWAGGER_AUTH_ID?: string;
    SWAGGER_AUTH_PW?: string;
    SWAGGER_PATH?: string;
    SENTRY_DSN?: string;
}

const envSchema = Joi.object<EnvironmentVariables>({
    NODE_ENV: Joi.string()
        .valid('local', 'test', 'development', 'production')
        .default('local'),
    PORT: Joi.number().default(3000),
    SERVER_URL: Joi.string().uri().default('http://localhost:3000'),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    DB_LOGGING: Joi.string().valid('true', 'false').default('false'),
    DB_MIGRATIONS_RUN: Joi.string().valid('true', 'false').default('false'),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('1d'),
    SWAGGER_AUTH_ID: Joi.string().optional(),
    SWAGGER_AUTH_PW: Joi.string().optional(),
    SWAGGER_PATH: Joi.string().optional(),
    SENTRY_DSN: Joi.string().optional().allow(''),
});

export function validateEnv(
    config: Record<string, unknown>,
): EnvironmentVariables {
    const { error, value } = envSchema.validate(config, {
        allowUnknown: true,
        abortEarly: true,
        convert: true,
    });

    if (error) {
        throw error;
    }

    return value;
}
