import type { ValidationOptions } from 'class-validator';

import { LocalDate } from '@js-joda/core';
import { registerDecorator } from 'class-validator';

export function IsLocalDate(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: 'IsLocalDate',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate: (value: unknown) => {
                    try {
                        if (value instanceof LocalDate) {
                            return true;
                        }
                        if (typeof value !== 'string') {
                            return false;
                        }
                        LocalDate.parse(value);
                        return true;
                    } catch {
                        return false;
                    }
                },
                defaultMessage: () =>
                    `${propertyName} must be a LocalDate string`,
            },
        });
    };
}
