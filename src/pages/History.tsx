
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ResultCard from '@/components/ResultCard';
import { PredictionResponse, getPredictionHistory } from '@/utils/mockData';
import { motion } from 'framer-motion';
import { Home, Search, Filter, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortOrder = 'newest' | 'oldest';
type FilterType = 'all' | 'positive' | 'negative' | 'neutral';

const History = () => {
  const [history, setHistory] = useState<PredictionResponse[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<PredictionResponse[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get prediction history
    const predictionHistory = getPredictionHistory();
    
    // Convert timestamps to Date objects
    const formattedHistory = predictionHistory.map(prediction => ({
      ...prediction,
      timestamp: new Date(prediction.timestamp)
    }));
    
    setHistory(formattedHistory);
    setFilteredHistory(formattedHistory);
  }, []);

  useEffect(() => {
    let filtered = [...history];
    
    // Apply response type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.response === filterType);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.patientName.toLowerCase().includes(query) ||
        item.drugName.toLowerCase().includes(query) ||
        item.diseaseName.toLowerCase().includes(query)
      );
    }
    
    // Apply sort order
    filtered.sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }
    });
    
    setFilteredHistory(filtered);
  }, [history, filterType, sortOrder, searchQuery]);

  const clearFilters = () => {
    setFilterType('all');
    setSortOrder('newest');
    setSearchQuery('');
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">Prediction History</h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            New Prediction
          </button>
        </div>

        <div className="glass mb-8 p-4 rounded-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by patient, drug, or disease..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All responses</option>
                  <option value="positive">Positive only</option>
                  <option value="negative">Negative only</option>
                  <option value="neutral">Neutral only</option>
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon />
                </div>
              </div>
              
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  className="appearance-none px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>
          </div>
          
          {(filterType !== 'all' || sortOrder !== 'newest' || searchQuery) && (
            <div className="mt-3 flex items-center text-sm">
              <div className="text-muted-foreground mr-2">Active filters:</div>
              <div className="flex flex-wrap gap-2">
                {filterType !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {filterType} responses
                  </span>
                )}
                {sortOrder !== 'newest' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    oldest first
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    search: "{searchQuery}"
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground ml-2 flex items-center"
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No predictions found</h3>
            <p className="text-muted-foreground">
              {history.length === 0
                ? "You haven't made any predictions yet."
                : "No predictions match your current filters."
              }
            </p>
            {history.length > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
            {history.length === 0 && (
              <button
                onClick={() => navigate('/')}
                className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                New Prediction
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredHistory.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

// Simple chevron down icon component
const ChevronDownIcon = () => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 12 12" 
    xmlns="http://www.w3.org/2000/svg"
    className="text-muted-foreground"
  >
    <path 
      d="M2.5 4.5L6 8L9.5 4.5" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill="none"
    />
  </svg>
);

export default History;
