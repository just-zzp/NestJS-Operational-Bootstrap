import { ValidationError } from '@nestjs/common';

export class CustomValidationError {
    property: string;
    value: unknown;
    constraints?: Constraint[];

    constructor(validationError: ValidationError) {
        this.property = validationError.property;
        this.value = validationError.value as unknown;
        if (validationError.constraints) {
            this.constraints = Object.entries(validationError.constraints).map(
                (entry) => new Constraint(entry),
            );
        }
    }
}

class Constraint {
    type: string;
    message: string;

    constructor([type, message]: [string, string]) {
        this.type = type;
        this.message = message;
    }
}
