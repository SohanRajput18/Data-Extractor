import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { toast } from './ui/Toast';
import { WebsiteData } from '../types';
import { generateMockWebsites } from '../utils/mockData';

interface FetchWebsitesProps {
  onFetchComplete: (results: WebsiteData[]) => void;
  setIsLoading: (loading: boolean) => void;
}

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'in', label: 'India' },
];

const searchTypeOptions = [
  { value: 'business', label: 'Business Websites' },
  { value: 'ecommerce', label: 'E-commerce Stores' },
  { value: 'service', label: 'Service Providers' },
];

const industrySuggestions = {
  'Restaurant': ['Restaurant', 'Cafe', 'Bistro', 'Diner', 'Food Service'],
  'Retail': ['Clothing Store', 'Fashion Boutique', 'Shoe Store', 'Accessories Shop'],
  'Technology': ['Software Company', 'IT Services', 'Digital Agency', 'Tech Support'],
  'Health': ['Medical Clinic', 'Dental Office', 'Fitness Center', 'Wellness Center'],
  'Education': ['School', 'Training Center', 'Tutoring Service', 'Educational Institute']
};

const FetchWebsites: React.FC<FetchWebsitesProps> = ({ onFetchComplete, setIsLoading }) => {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [industry, setIndustry] = useState('');
  const [searchType, setSearchType] = useState('business');
  const [count, setCount] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFetchWebsites = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!country) {
      toast({
        title: 'Input Error',
        message: 'Please select a country',
        type: 'error',
      });
      return;
    }

    if (!industry) {
      toast({
        title: 'Input Error',
        message: 'Please enter an industry keyword',
        type: 'error',
      });
      return;
    }

    // Validate and clean inputs
    const cleanIndustry = industry.trim();
    const cleanCity = city.trim();

    setIsLoading(true);
    setIsSubmitting(true);
    
    try {
      // Check if API key is configured
      const serpApiKey = import.meta.env.VITE_SERPAPI_KEY;
      if (!serpApiKey) {
        throw new Error('SERP API key is not configured. Please add your API key to the .env file.');
      }

      // Log the first few characters of the API key to verify it's loaded
      console.log('SERP API Key loaded:', serpApiKey.substring(0, 4) + '...');
      
      console.log('Starting search with parameters:', {
        industry: cleanIndustry,
        city: cleanCity,
        country,
        searchType,
        count
      });
      
      const results = await generateMockWebsites(count, cleanIndustry, cleanCity, country, searchType);
      
      if (results.length === 0) {
        toast({
          title: 'No Results',
          message: 'Try adjusting your search criteria or using different keywords',
          type: 'info',
        });
      } else {
        onFetchComplete(results);
        toast({
          title: 'Success',
          message: `Found ${results.length} websites`,
          type: 'success',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch websites';
      console.error('Search error:', error);
      toast({
        title: 'Error',
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFetchWebsites}>
      <div className="space-y-4">
        <div>
          <label htmlFor="searchType" className="block text-sm font-medium text-slate-700 mb-1">
            Search Type
          </label>
          <Select
            id="searchType"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            options={searchTypeOptions}
            placeholder="Select search type"
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1">
            Country
          </label>
          <Select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            options={countryOptions}
            placeholder="Select country"
          />
        </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
            City/State/Location
          </label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. New York, London, Toronto"
          />
          <p className="mt-1 text-xs text-slate-500">
            Enter city name only (e.g., "New York" not "New York, USA")
          </p>
        </div>
        
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-slate-700 mb-1">
            Industry/Business Type
          </label>
          <Input
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g. Restaurant, Clothing Store, Digital Marketing"
            required
          />
          <p className="mt-1 text-xs text-slate-500">
            Try specific terms like "Italian Restaurant" or "Women's Clothing Store"
          </p>
        </div>
        
        <div>
          <label htmlFor="count" className="block text-sm font-medium text-slate-700 mb-1">
            Number of Results
          </label>
          <Input
            id="count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 10)}
          />
          <p className="mt-1 text-xs text-slate-500">
            Maximum 100 results per search
          </p>
        </div>
        
        <Button 
          type="submit" 
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Searching...' : 'Search Websites'}
        </Button>
      </div>
    </form>
  );
};

export default FetchWebsites;