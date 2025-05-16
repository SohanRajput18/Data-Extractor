import React, { useState } from 'react';
import Button from './ui/Button';
import { toast } from './ui/Toast';
import { WebsiteData } from '../types';
import { extractEmailsFromWebsites } from '../utils/mockData';

interface FetchEmailsProps {
  websites: WebsiteData[];
  onFetchComplete: (results: WebsiteData[]) => void;
  setIsLoading: (loading: boolean) => void;
  onFileUpload: () => void;
}

const FetchEmails: React.FC<FetchEmailsProps> = ({ 
  websites, 
  onFetchComplete,
  setIsLoading,
  onFileUpload
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile);
    onFileUpload();
  };

  const parseCSV = (content: string): WebsiteData[] => {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(header => 
      header.trim().replace(/^"/, '').replace(/"$/, '')
    );
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',').map(value => 
          value.trim().replace(/^"/, '').replace(/"$/, '')
        );
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || '';
          return obj;
        }, {} as WebsiteData);
      });
  };

  const handleFetchEmails = async () => {
    if (websites.length === 0 && !file) {
      toast({
        title: 'Input Error',
        message: 'Please fetch websites first or upload a CSV file',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let websitesToProcess: WebsiteData[] = websites;

      if (file) {
        const content = await file.text();
        websitesToProcess = parseCSV(content);
      }
      
      const results = await extractEmailsFromWebsites(websitesToProcess);
      onFetchComplete(results);
      
      toast({
        title: 'Success',
        message: `Found ${results.length} email contacts`,
        type: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        message: 'Failed to extract email contacts',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="mb-2">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-sm text-slate-500">
          Drop your CSV file here or{' '}
          <label className="text-blue-600 cursor-pointer hover:text-blue-800">
            browse files
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </p>
        {file && (
          <p className="mt-2 text-sm font-medium text-blue-600">
            {file.name}
          </p>
        )}
      </div>

      <Button 
        type="button" 
        onClick={handleFetchEmails}
        fullWidth
      >
        Fetch Email IDs
      </Button>
    </div>
  );
};

export default FetchEmails;