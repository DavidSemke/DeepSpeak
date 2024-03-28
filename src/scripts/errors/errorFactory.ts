import { ResponseError } from "./responseError"


export function unexpectedStateError(stateVar: string, value: any) {
    return new Error(`State ${stateVar} is unexpectedly ${value}`)
}

export function authFailError(reason: string) {
    return new Error(`Authorization failed - ${reason}`)
}

export function resource404Error(resourceName: string) {
    const capitalizedName = resourceName[0].toUpperCase() 
        + resourceName.slice(1)

    return new ResponseError(
        404, 
        `${capitalizedName} either expired or never existed`
    )
}