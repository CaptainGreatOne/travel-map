import { describe, it, expect } from 'vitest';
import {
  parseGoogleMapsUrl,
  parseGoogleMapsCoordinates,
  parseGoogleMapsUrlAsync,
  parseGoogleMapsCountry,
  isValidGoogleMapsUrl
} from './parseGoogleMapsUrl';

describe('isValidGoogleMapsUrl', () => {
  describe('valid Google Maps URLs', () => {
    it('accepts google.com/maps/place URLs', () => {
      const result = isValidGoogleMapsUrl('https://www.google.com/maps/place/Eiffel+Tower');
      expect(result).toEqual({ valid: true });
    });

    it('accepts google.com/maps URLs', () => {
      const result = isValidGoogleMapsUrl('https://www.google.com/maps?q=40.7128,-74.0060');
      expect(result).toEqual({ valid: true });
    });

    it('accepts maps.google.com URLs', () => {
      const result = isValidGoogleMapsUrl('https://maps.google.com/maps?q=test');
      expect(result).toEqual({ valid: true });
    });

    it('accepts goo.gl/maps short URLs', () => {
      const result = isValidGoogleMapsUrl('https://goo.gl/maps/abc123xyz');
      expect(result).toEqual({ valid: true });
    });

    it('accepts maps.app.goo.gl short URLs', () => {
      const result = isValidGoogleMapsUrl('https://maps.app.goo.gl/abc123xyz');
      expect(result).toEqual({ valid: true });
    });

    it('accepts HTTP URLs', () => {
      const result = isValidGoogleMapsUrl('http://www.google.com/maps/place/Test');
      expect(result).toEqual({ valid: true });
    });
  });

  describe('invalid inputs', () => {
    it('rejects empty string', () => {
      const result = isValidGoogleMapsUrl('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });

    it('rejects null', () => {
      const result = isValidGoogleMapsUrl(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });

    it('rejects undefined', () => {
      const result = isValidGoogleMapsUrl(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });

    it('rejects whitespace-only string', () => {
      const result = isValidGoogleMapsUrl('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });

    it('rejects random text that is not a URL', () => {
      const result = isValidGoogleMapsUrl('this is not a url');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });
  });

  describe('non-Google domains', () => {
    it('rejects evil.com/maps URLs', () => {
      const result = isValidGoogleMapsUrl('https://evil.com/maps/place/Test');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });

    it('rejects google.com.evil.com domain spoofing', () => {
      const result = isValidGoogleMapsUrl('https://google.com.evil.com/maps');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });

    it('rejects maps.google.evil.com domain spoofing', () => {
      const result = isValidGoogleMapsUrl('https://maps.google.evil.com/maps');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });

    it('rejects random websites', () => {
      const result = isValidGoogleMapsUrl('https://example.com/some/path');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });
  });

  describe('dangerous protocols', () => {
    it('rejects javascript: protocol', () => {
      const result = isValidGoogleMapsUrl('javascript:alert(1)');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });

    it('rejects data: protocol', () => {
      const result = isValidGoogleMapsUrl('data:text/html,<script>alert(1)</script>');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });

    it('rejects file: protocol', () => {
      const result = isValidGoogleMapsUrl('file:///etc/passwd');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });
  });

  describe('google.com without maps path', () => {
    it('rejects google.com without maps path', () => {
      const result = isValidGoogleMapsUrl('https://www.google.com/search?q=test');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });

    it('rejects google.com root', () => {
      const result = isValidGoogleMapsUrl('https://www.google.com/');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Google Maps URL');
    });
  });

  describe('error message is user-friendly', () => {
    it('provides helpful error message for invalid input', () => {
      const result = isValidGoogleMapsUrl('not-a-url');
      expect(result.error).toBe('Please enter a valid Google Maps URL');
      // Should NOT contain technical details like "URL parsing failed" or "invalid protocol"
      expect(result.error).not.toMatch(/parse|protocol|domain|regex|error/i);
    });
  });
});

describe('parseGoogleMapsCountry', () => {
  describe('Location, City, Country pattern', () => {
    it('extracts country from "Location, City, Country" pattern', () => {
      const result = parseGoogleMapsCountry('Eiffel Tower, Paris, France');
      expect(result).toEqual({ country: 'France', countryCode: 'FR' });
    });

    it('extracts country from "Location, City, State, Country" pattern', () => {
      const result = parseGoogleMapsCountry('Empire State Building, New York, NY, United States');
      expect(result).toEqual({ country: 'United States', countryCode: 'US' });
    });
  });

  describe('Location, Country pattern', () => {
    it('extracts country from "Location, Country" pattern', () => {
      const result = parseGoogleMapsCountry('Mount Fuji, Japan');
      expect(result).toEqual({ country: 'Japan', countryCode: 'JP' });
    });
  });

  describe('Common countries map to ISO codes', () => {
    it('maps France to FR', () => {
      const result = parseGoogleMapsCountry('Louvre Museum, Paris, France');
      expect(result?.countryCode).toBe('FR');
    });

    it('maps Japan to JP', () => {
      const result = parseGoogleMapsCountry('Tokyo Tower, Tokyo, Japan');
      expect(result?.countryCode).toBe('JP');
    });

    it('maps United States to US', () => {
      const result = parseGoogleMapsCountry('Central Park, New York, United States');
      expect(result?.countryCode).toBe('US');
    });

    it('maps USA to US', () => {
      const result = parseGoogleMapsCountry('Hollywood Sign, Los Angeles, USA');
      expect(result?.countryCode).toBe('US');
    });

    it('maps United Kingdom to GB', () => {
      const result = parseGoogleMapsCountry('Big Ben, London, United Kingdom');
      expect(result?.countryCode).toBe('GB');
    });

    it('maps UK to GB', () => {
      const result = parseGoogleMapsCountry('Tower Bridge, London, UK');
      expect(result?.countryCode).toBe('GB');
    });

    it('maps Australia to AU', () => {
      const result = parseGoogleMapsCountry('Sydney Opera House, Sydney, Australia');
      expect(result?.countryCode).toBe('AU');
    });
  });

  describe('Unknown countries', () => {
    it('returns country name with null code for unknown countries', () => {
      const result = parseGoogleMapsCountry('Some Place, Unknown Country');
      expect(result).toEqual({ country: 'Unknown Country', countryCode: null });
    });
  });

  describe('No country info', () => {
    it('returns null for single segment (no commas)', () => {
      const result = parseGoogleMapsCountry('Eiffel Tower');
      expect(result).toBeNull();
    });

    it('returns null for empty string', () => {
      const result = parseGoogleMapsCountry('');
      expect(result).toBeNull();
    });

    it('returns null for null input', () => {
      const result = parseGoogleMapsCountry(null);
      expect(result).toBeNull();
    });

    it('returns null for undefined input', () => {
      const result = parseGoogleMapsCountry(undefined);
      expect(result).toBeNull();
    });
  });
});

describe('parseGoogleMapsUrl', () => {
  describe('existing /place/ pattern (should still work)', () => {
    it('extracts location name from standard place URL', () => {
      const url = 'https://www.google.com/maps/place/Eiffel+Tower/@48.8584,2.2945,15z';
      expect(parseGoogleMapsUrl(url)).toBe('Eiffel Tower');
    });

    it('handles URL-encoded characters', () => {
      const url = 'https://www.google.com/maps/place/Caf%C3%A9+de+Flore/@48.8540,2.3325,15z';
      // decodeURIComponent preserves the actual Unicode character
      expect(parseGoogleMapsUrl(url)).toBe('Café de Flore');
    });

    it('returns null for invalid URLs', () => {
      expect(parseGoogleMapsUrl('not-a-url')).toBeNull();
      expect(parseGoogleMapsUrl('')).toBeNull();
    });
  });

  describe('search result URLs (NEW)', () => {
    it('extracts search term from /search/ URL', () => {
      const url = 'https://www.google.com/maps/search/Eiffel+Tower';
      expect(parseGoogleMapsUrl(url)).toBe('Eiffel Tower');
    });

    it('extracts search term with special characters', () => {
      const url = 'https://www.google.com/maps/search/restaurants+near+me';
      expect(parseGoogleMapsUrl(url)).toBe('restaurants near me');
    });

    it('extracts search term from URL with coordinates after', () => {
      const url = 'https://www.google.com/maps/search/coffee+shops/@48.8584,2.2945,15z';
      expect(parseGoogleMapsUrl(url)).toBe('coffee shops');
    });

    it('handles URL-encoded search terms', () => {
      const url = 'https://www.google.com/maps/search/Caf%C3%A9s+in+Paris';
      // decodeURIComponent preserves the actual Unicode character
      expect(parseGoogleMapsUrl(url)).toBe('Cafés in Paris');
    });
  });
});

describe('parseGoogleMapsCoordinates', () => {
  describe('existing patterns (should still work)', () => {
    it('extracts coordinates from !8m2!3d...!4d format', () => {
      const url = 'https://www.google.com/maps/place/Test/@48.8584,2.2945,15z/data=!8m2!3d50.6949825!4d-2.243119';
      const coords = parseGoogleMapsCoordinates(url);
      expect(coords).toEqual({ lat: 50.6949825, lng: -2.243119 });
    });

    it('extracts coordinates from !3d...!4d format', () => {
      const url = 'https://www.google.com/maps/place/Test/!3d40.7128!4d-74.0060';
      const coords = parseGoogleMapsCoordinates(url);
      expect(coords).toEqual({ lat: 40.7128, lng: -74.0060 });
    });

    it('extracts coordinates from ll= parameter', () => {
      const url = 'https://maps.google.com/?ll=40.7128,-74.0060';
      const coords = parseGoogleMapsCoordinates(url);
      expect(coords).toEqual({ lat: 40.7128, lng: -74.0060 });
    });

    it('extracts coordinates from @ format as fallback', () => {
      const url = 'https://www.google.com/maps/@40.7128,-74.0060,15z';
      const coords = parseGoogleMapsCoordinates(url);
      expect(coords).toEqual({ lat: 40.7128, lng: -74.0060 });
    });
  });

  describe('mobile web URLs with q= parameter (NEW)', () => {
    it('extracts coordinates from q= parameter with coordinate pair', () => {
      const url = 'https://www.google.com/maps?q=40.7128,-74.0060';
      const coords = parseGoogleMapsCoordinates(url);
      expect(coords).toEqual({ lat: 40.7128, lng: -74.0060 });
    });

    it('extracts coordinates from maps.google.com with q= parameter', () => {
      const url = 'https://maps.google.com/maps?q=48.8584,2.2945';
      const coords = parseGoogleMapsCoordinates(url);
      expect(coords).toEqual({ lat: 48.8584, lng: 2.2945 });
    });

    it('handles negative coordinates in q= parameter', () => {
      const url = 'https://www.google.com/maps?q=-33.8688,151.2093';
      const coords = parseGoogleMapsCoordinates(url);
      expect(coords).toEqual({ lat: -33.8688, lng: 151.2093 });
    });
  });

  describe('coordinate validation', () => {
    it('returns null for latitude out of range', () => {
      const url = 'https://www.google.com/maps/@91.0,0.0,15z';
      expect(parseGoogleMapsCoordinates(url)).toBeNull();
    });

    it('returns null for longitude out of range', () => {
      const url = 'https://www.google.com/maps/@0.0,181.0,15z';
      expect(parseGoogleMapsCoordinates(url)).toBeNull();
    });

    it('accepts boundary values', () => {
      const url = 'https://www.google.com/maps/@90.0,-180.0,15z';
      const coords = parseGoogleMapsCoordinates(url);
      expect(coords).toEqual({ lat: 90.0, lng: -180.0 });
    });
  });
});

describe('parseGoogleMapsUrlAsync', () => {
  describe('search URLs (NEW)', () => {
    it('extracts name from search URL', async () => {
      const url = 'https://www.google.com/maps/search/Eiffel+Tower';
      const result = await parseGoogleMapsUrlAsync(url);
      expect(result.name).toBe('Eiffel Tower');
      expect(result.isShortUrl).toBe(false);
    });

    it('extracts coordinates from search URL with location', async () => {
      const url = 'https://www.google.com/maps/search/restaurants/@48.8584,2.2945,15z';
      const result = await parseGoogleMapsUrlAsync(url);
      expect(result.name).toBe('restaurants');
      expect(result.lat).toBe(48.8584);
      expect(result.lng).toBe(2.2945);
    });
  });

  describe('mobile URLs (NEW)', () => {
    it('extracts coordinates from mobile URL with q= parameter', async () => {
      const url = 'https://www.google.com/maps?q=40.7128,-74.0060';
      const result = await parseGoogleMapsUrlAsync(url);
      expect(result.lat).toBe(40.7128);
      expect(result.lng).toBe(-74.0060);
    });
  });

  describe('country extraction in async results', () => {
    it('includes country and countryCode in result for place with country', async () => {
      const url = 'https://www.google.com/maps/place/Eiffel+Tower,+Paris,+France/@48.8584,2.2945,15z';
      const result = await parseGoogleMapsUrlAsync(url);
      expect(result.name).toBe('Eiffel Tower, Paris, France');
      expect(result.country).toBe('France');
      expect(result.countryCode).toBe('FR');
    });

    it('includes country and countryCode for Japanese location', async () => {
      const url = 'https://www.google.com/maps/place/Tokyo+Tower,+Tokyo,+Japan/@35.6586,139.7454,15z';
      const result = await parseGoogleMapsUrlAsync(url);
      expect(result.country).toBe('Japan');
      expect(result.countryCode).toBe('JP');
    });

    it('fetches country via reverse geocoding when not in place name', async () => {
      const url = 'https://www.google.com/maps/place/Central+Park/@40.7829,-73.9654,15z';
      const result = await parseGoogleMapsUrlAsync(url);
      expect(result.name).toBe('Central Park');
      // Reverse geocoding should find US
      expect(result.countryCode).toBe('US');
    });

    it('fetches country via reverse geocoding for coordinates-only URL', async () => {
      const url = 'https://www.google.com/maps?q=40.7128,-74.0060';
      const result = await parseGoogleMapsUrlAsync(url);
      // Coordinates-only URL gets country from reverse geocoding
      expect(result.countryCode).toBe('US');
    });
  });
});
