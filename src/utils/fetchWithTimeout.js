/**
 * Fetch with timeout - wraps native fetch with automatic timeout.
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @param {number} timeout - Timeout in milliseconds (default 30000)
 * @returns {Promise<Response>} - The fetch response
 * @throws {Error} - Throws on timeout or fetch error
 */
export async function fetchWithTimeout(url, options = {}, timeout = 30000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out')
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}
