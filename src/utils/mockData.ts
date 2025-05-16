import { fetchRealWebsites, findEmailsForWebsites } from './dataServices';
import { WebsiteData } from '../types';

export const generateMockWebsites = async (
  count: number,
  industry: string,
  city: string = '',
  country: string = '',
  searchType: string = 'business'
): Promise<WebsiteData[]> => {
  return await fetchRealWebsites(industry, city, country, count, searchType);
};

export const extractEmailsFromWebsites = async (
  websites: WebsiteData[]
): Promise<WebsiteData[]> => {
  return await findEmailsForWebsites(websites);
};