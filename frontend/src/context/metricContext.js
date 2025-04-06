import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const MetricContext = createContext();

export const MetricProvider = ({ children }) => {
  const [metrics, setMetrics] = useState([]);
  const [filteredMetrics, setFilteredMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    metricType: 'all',
    dateRange: 'all',
    sortBy: 'newest'
  });

  const getMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/metrics');
      setMetrics(res.data);
      applyFilters(res.data, filters);
    } catch (err) {
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const addMetric = async (metric) => {
    try {
      const res = await axios.post('/api/metrics', metric);
      setMetrics(prev => [res.data, ...prev]);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, errors: err.response?.data?.errors };
    }
  };

  const updateMetric = async (id, updatedMetric) => {
    try {
      const res = await axios.put(`/api/metrics/${id}`, updatedMetric);
      setMetrics(prev => prev.map(m => m._id === id ? res.data : m));
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, errors: err.response?.data?.errors };
    }
  };

  const deleteMetric = async (id) => {
    try {
      await axios.delete(`/api/metrics/${id}`);
      setMetrics(prev => prev.filter(m => m._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, errors: err.response?.data?.errors };
    }
  };

  const applyFilters = (metricsToFilter, filterSettings) => {
    let result = [...metricsToFilter];
    // Filtering logic here
    setFilteredMetrics(result);
  };

  useEffect(() => {
    getMetrics();
  }, [getMetrics]);

  return (
    <MetricContext.Provider value={{
      metrics,
      filteredMetrics,
      loading,
      filters,
      getMetrics,
      addMetric,
      updateMetric,
      deleteMetric,
      setFilters
    }}>
      {children}
    </MetricContext.Provider>
  );
};