export function generateQuery(message: string, context: string) {
  return `
    Context: "${context}"

    User's Message: "${message}"

    Based on the provided context, please generate a response that takes the context into account.
  `
}
