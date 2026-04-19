import type { ValidationOptions } from 'class-validator';

import { ZonedDateTime } from '@js-joda/core';
import { registerDecorator } from 'class-validator';

export function IsZonedDateTime(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: 'IsZonedDateTime',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate: (value: unknown) => {
                    try {
                        if (value instanceof ZonedDateTime) {
                            return true;
                        }
                        if (typeof value !== 'string') {
                            return false;
                        }
                        ZonedDateTime.parse(value);
                        return true;
                    } catch {
                        return false;
                    }
                },
                defaultMessage: () =>
                    `${propertyName} must be a ZonedDateTime string`,
            },
        });
    };
}
