export function generateUser(length = 8) {
  let result = ""
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  const totalChars = chars.length

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * totalChars))
  }

  return result
}
