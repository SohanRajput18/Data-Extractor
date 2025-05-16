import React, { useState } from 'react';
import { Search } from 'lucide-react';
import FetchWebsites from './FetchWebsites';
import FilterWebsites from './FilterWebsites';
import FetchEmails from './FetchEmails';
import ResultsDisplay from './ResultsDisplay';
import Card from './ui/Card';
import { WebsiteData } from '../types';
import { toast } from './ui/Toast';

const DataExtractor = () => {
  const [websiteResults, setWebsiteResults] = useState<WebsiteData[]>([]);
  const [emailResults, setEmailResults] = useState<WebsiteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWebsiteResults, setShowWebsiteResults] = useState(false);
  const [showEmailResults, setShowEmailResults] = useState(false);

  const handleWebsitesFetched = (results: WebsiteData[]) => {
    if (results.length === 0) {
      toast({
        title: 'No Results',
        message: 'No websites found for the given criteria',
        type: 'info'
      });
      return;
    }
    setWebsiteResults(results);
    setShowWebsiteResults(true);
    setShowEmailResults(false);
  };

  const handleEmailsFetched = (results: WebsiteData[]) => {
    if (results.length === 0) {
      toast({
        title: 'No Results',
        message: 'No email addresses found',
        type: 'info'
      });
      return;
    }
    setEmailResults(results);
    setShowEmailResults(true);
  };

  const handleFileUpload = () => {
    setShowWebsiteResults(false);
    setShowEmailResults(false);
  };

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Search className="h-6 w-6 mr-2 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-800">E-Com Data Finder</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <div className="p-5">
            <h3 className="text-lg font-medium text-slate-700 mb-4">Fetch Websites</h3>
            <FetchWebsites 
              onFetchComplete={handleWebsitesFetched}
              setIsLoading={setIsLoading}
            />
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <h3 className="text-lg font-medium text-slate-700 mb-4">Filter Websites</h3>
            <FilterWebsites 
              websites={websiteResults}
              onFilter={(filtered) => {
                setWebsiteResults(filtered);
                setShowWebsiteResults(true);
                setShowEmailResults(false);
              }}
            />
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <h3 className="text-lg font-medium text-slate-700 mb-4">Fetch Email IDs</h3>
            <FetchEmails 
              websites={websiteResults}
              onFetchComplete={handleEmailsFetched}
              setIsLoading={setIsLoading}
              onFileUpload={handleFileUpload}
            />
          </div>
        </Card>
      </div>

      {showWebsiteResults && websiteResults.length > 0 && (
        <div className="mt-8">
          <ResultsDisplay 
            title="Websites Results"
            data={websiteResults} 
            columns={['website', 'email']}
            fileName="Websites_Export"
          />
        </div>
      )}

      {showEmailResults && emailResults.length > 0 && (
        <div className="mt-8">
          <ResultsDisplay 
            title="Email Results"
            data={emailResults} 
            columns={['website', 'email']}
            fileName="Emails_Export"
          />
        </div>
      )}
    </div>
  );
};

export default DataExtractor;