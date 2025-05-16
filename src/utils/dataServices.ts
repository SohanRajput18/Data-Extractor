import axios from 'axios';
import { WebsiteData } from '../types';

const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY;
const HUNTER_API_KEY = import.meta.env.VITE_HUNTER_API_KEY;

// Create axios instance with default config
const serpApi = axios.create({
  baseURL: '/api/serp',
  params: {
    api_key: SERPAPI_KEY
  }
});

const hunterApi = axios.create({
  baseURL: '/api/hunter',
  params: {
    api_key: HUNTER_API_KEY
  }
});

export const fetchRealWebsites = async (
  industry: string,
  city: string = '',
  country: string = '',
  count: number = 100,
  searchType: string = 'business'
): Promise<WebsiteData[]> => {
  try {
    // Log API key status (without exposing the actual key)
    console.log('SERP API Key status:', SERPAPI_KEY ? 'Present' : 'Missing');
    
    if (!SERPAPI_KEY) {
      throw new Error('SERP API key is missing. Please check your .env file.');
    }

    // Build a more specific search query based on search type
    let searchQuery = '';
    switch (searchType) {
      case 'ecommerce':
        searchQuery = `${industry} online store ${city} ${country}`.trim();
        break;
      case 'service':
        searchQuery = `${industry} service provider ${city} ${country}`.trim();
        break;
      default:
        searchQuery = `${industry} business ${city} ${country}`.trim();
    }

    console.log('Search Query:', searchQuery);

    const response = await serpApi.get('/search.json', {
      params: {
        q: searchQuery,
        num: count,
        engine: 'google',
        gl: country.toLowerCase(), // Set country for localized results
        hl: 'en', // Set language to English
        filter: 0, // Don't filter similar results
        safe: 'active', // Safe search
        google_domain: 'google.com', // Use Google.com domain
        num_results: count, // Explicitly set number of results
        page: 1 // Start from first page
      }
    });

    console.log('SERP API Response:', response.data);

    if (response.data.error) {
      throw new Error(`SERP API Error: ${response.data.error}`);
    }

    const organicResults = response.data.organic_results || [];
    console.log('Number of organic results:', organicResults.length);

    const websites = new Set<string>(); // Use Set to avoid duplicates
    
    const processedResults = organicResults
      .slice(0, count)
      .map((result: any) => {
        try {
          const url = new URL(result.link);
          return {
            website: url.hostname,
            email: ''
          };
        } catch (error) {
          console.log('Error processing URL:', result.link);
          return null;
        }
      })
      .filter((site: WebsiteData | null): site is WebsiteData => {
        if (!site) return false;
        // Filter out common non-business domains
        const excludedDomains = ['facebook.com', 'linkedin.com', 'twitter.com', 'instagram.com', 'youtube.com'];
        return !excludedDomains.some(domain => site.website.includes(domain));
      })
      .filter((site: WebsiteData) => {
        // Only add unique domains
        if (websites.has(site.website)) return false;
        websites.add(site.website);
        return true;
      });

    console.log('Final processed results:', processedResults);
    return processedResults;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('SERP API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(`SERP API Error: ${error.response?.data?.error || error.message}`);
    }
    console.error('Error fetching websites:', error);
    throw new Error('Failed to fetch websites. Please check your API key and try again.');
  }
};

export const findEmailsForWebsites = async (websites: WebsiteData[]): Promise<WebsiteData[]> => {
  const results: WebsiteData[] = [];

  // Log Hunter API key status
  console.log('Hunter API Key status:', HUNTER_API_KEY ? 'Present' : 'Missing');

  if (!HUNTER_API_KEY) {
    console.warn('Hunter API key is missing. Email addresses will not be fetched.');
    return websites;
  }

  for (const site of websites) {
    try {
      const response = await hunterApi.get('/v2/domain-search', {
        params: {
          domain: site.website,
          limit: 1, // Only get the most relevant email
          seniority: 'senior' // Try to get senior staff emails
        }
      });

      const emails = response.data.data.emails || [];
      const genericEmail = emails.find((e: { type: string }) => e.type === 'generic') || emails[0];

      results.push({
        website: site.website,
        email: genericEmail ? genericEmail.value : ''
      });

      // Rate limiting to avoid API throttling
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Hunter API Error for ${site.website}:`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      console.error(`Error finding email for ${site.website}:`, error);
      results.push({
        website: site.website,
        email: ''
      });
    }
  }

  return results;
};