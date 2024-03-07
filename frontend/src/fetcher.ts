// Get the base URL from environment variables
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

export const fetcher: typeof fetch = (input, init) =>
  fetch(`${baseUrl}${input}`, init);
