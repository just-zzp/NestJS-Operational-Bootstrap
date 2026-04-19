import { ConfigService } from '@nestjs/config';

import * as Sentry from '@sentry/nestjs';
import { httpIntegration } from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import dotenv from 'dotenv';

dotenv.config();

const configService = new ConfigService();
const dsn = configService.get<string>('SENTRY_DSN');

if (dsn) {
    Sentry.init({
        dsn,
        integrations: [
            nodeProfilingIntegration(),
            httpIntegration({
                ignoreIncomingRequests: () => true,
                ignoreOutgoingRequests: () => true,
            }),
        ],
        // Tracing
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set sampling rate for profiling - this is relative to tracesSampleRate
        profilesSampleRate: 1.0,
    });
}
