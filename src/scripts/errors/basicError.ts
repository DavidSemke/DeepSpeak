export function unexpectedStateError(stateVar: string, value: any) {
    return new Error(`State ${stateVar} is unexpectedly ${value}`)
}