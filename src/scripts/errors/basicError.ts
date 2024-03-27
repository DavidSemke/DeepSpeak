export function unexpectedStateError(stateVar: string, value: any) {
    return new Error(`State ${stateVar} is unexpectedly ${value}`)
}

export function authFailError(reason: string) {
    return new Error(`Authorization failed - ${reason}`)
}