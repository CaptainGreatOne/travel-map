import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Validates that a URL is a Google Maps short URL.
 * Accepts: maps.app.goo.gl/*, goo.gl/maps/*
 */
function isValidShortUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.hostname === 'maps.app.goo.gl' ||
      (parsed.hostname === 'goo.gl' && parsed.pathname.startsWith('/maps'))
    )
  } catch {
    return false
  }
}

/**
 * Expands a short Google Maps URL by following redirects.
 * Returns the final expanded URL.
 */
async function expandUrl(shortUrl: string): Promise<string> {
  // Follow redirects manually to capture the final URL
  // Google's short URLs typically redirect through multiple hops
  let currentUrl = shortUrl
  const maxRedirects = 10

  for (let i = 0; i < maxRedirects; i++) {
    const response = await fetch(currentUrl, {
      method: 'GET',
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; URL Expander)',
      },
    })

    // Check for redirect status codes (301, 302, 303, 307, 308)
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (!location) {
        throw new Error('Redirect without location header')
      }

      // Handle relative redirects
      if (location.startsWith('/')) {
        const parsed = new URL(currentUrl)
        currentUrl = `${parsed.protocol}//${parsed.host}${location}`
      } else {
        currentUrl = location
      }
      continue
    }

    // If we get a 200, we've reached the final URL
    if (response.status === 200) {
      return currentUrl
    }

    // Any other status is an error
    throw new Error(`Unexpected status code: ${response.status}`)
  }

  throw new Error('Too many redirects')
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    const { url } = await req.json()

    // Validate request body
    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid url parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate it's a Google Maps short URL
    if (!isValidShortUrl(url)) {
      return new Response(
        JSON.stringify({ error: 'Invalid URL. Must be a maps.app.goo.gl or goo.gl/maps URL' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Expand the URL
    const expandedUrl = await expandUrl(url)

    return new Response(
      JSON.stringify({ expandedUrl }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error expanding URL:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to expand URL', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
