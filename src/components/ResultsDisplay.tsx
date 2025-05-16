import React from 'react';
import Button from './ui/Button';
import Card from './ui/Card';
import { WebsiteData } from '../types';
import { exportToCsv } from '../utils/exportToCsv';
import { Download } from 'lucide-react';

interface ResultsDisplayProps {
  title: string;
  data: WebsiteData[];
  columns: (keyof WebsiteData)[];
  fileName: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  title,
  data, 
  columns,
  fileName
}) => {
  const handleExport = () => {
    exportToCsv(data, fileName);
  };

  return (
    <Card>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-slate-700">{title}</h3>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            Export to CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {data.slice(0, 10).map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  {columns.map((column) => (
                    <td
                      key={`${index}-${column}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-slate-700"
                    >
                      {item[column]}
                    </td>
                  ))}
                </tr>
              ))}
              {data.length > 10 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 text-center text-sm text-slate-500 italic"
                  >
                    {data.length - 10} more {data.length - 10 === 1 ? 'result' : 'results'}...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default ResultsDisplay;