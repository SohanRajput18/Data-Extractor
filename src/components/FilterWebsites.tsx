import React, { useState } from 'react';
import Button from './ui/Button';
import Checkbox from './ui/Checkbox';
import { WebsiteData } from '../types';

interface FilterWebsitesProps {
  websites: WebsiteData[];
  onFilter: (filtered: WebsiteData[]) => void;
}

const FilterWebsites: React.FC<FilterWebsitesProps> = ({ websites, onFilter }) => {
  const [domainActive, setDomainActive] = useState(false);
  const [onlyShopify, setOnlyShopify] = useState(false);
  const [excludeList, setExcludeList] = useState('');

  const handleApplyFilters = () => {
    if (websites.length === 0) return;

    let filtered = [...websites];
    
    // Domain active filter
    if (domainActive) {
      filtered = filtered.filter(site => !site.website.includes('inactive'));
    }
    
    // Shopify filter
    if (onlyShopify) {
      filtered = filtered.filter(site => 
        site.website.includes('shopify') || 
        site.website.includes('myshopify')
      );
    }
    
    // Exclude list filter
    if (excludeList.trim()) {
      const excludes = excludeList.split(',').map(item => item.trim().toLowerCase());
      filtered = filtered.filter(site => 
        !excludes.some(exclude => site.website.toLowerCase().includes(exclude))
      );
    }
    
    onFilter(filtered);
  };
  
  const handleUploadCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const domains = lines
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'))
          .join(', ');
        setExcludeList(domains);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Checkbox 
          id="domainActive"
          checked={domainActive}
          onChange={() => setDomainActive(!domainActive)}
          label="Domain Active"
        />
        
        <Checkbox 
          id="onlyShopify"
          checked={onlyShopify}
          onChange={() => setOnlyShopify(!onlyShopify)}
          label="Only Shopify websites"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Exclude the websites
        </label>
        <div className="flex space-x-2">
          <textarea
            value={excludeList}
            onChange={(e) => setExcludeList(e.target.value)}
            className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-10"
            placeholder="domain1.com, domain2.com"
          />
          <div className="relative">
            <Button type="button" variant="outline" className="h-10">
              Upload CSV
            </Button>
            <input
              type="file"
              accept=".csv"
              onChange={handleUploadCsv}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      <Button 
        type="button" 
        onClick={handleApplyFilters}
        variant="secondary"
        fullWidth
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterWebsites;