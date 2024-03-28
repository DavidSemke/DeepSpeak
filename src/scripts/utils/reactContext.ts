import { createContext } from "react"


type ErrorSetter = 
  | unknown
  | null
  | ((error: unknown | null) => void)

export const ErrorContext = createContext({
  setError: (update: ErrorSetter) => {}
})
