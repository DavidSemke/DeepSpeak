type ValidationObject = {
    type: string
    value: string 
    msg: string
    path: string
    location: string
}

export class ArrayValidationError extends Error {
    validationObjects: ValidationObject[]

    constructor(
        validationObjects: ValidationObject[]
    ) {
        super('Validation failed')
        this.validationObjects = validationObjects
    }
}

export function isValidationObject(
    obj: unknown
): obj is ValidationObject {
    return (
        typeof obj === 'object'
        && obj !== null
        && 'type' in obj
        && 'value' in obj
        &&'msg' in obj 
        && 'path' in obj 
        && 'location' in obj
    );
}