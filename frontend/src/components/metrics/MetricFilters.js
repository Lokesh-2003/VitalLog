import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
} from '@mui/material';

const MetricFilters = ({ filters, updateFilters }) => {
  const handleFilterChange = (e) => {
    updateFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filter Metrics
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Metric Type</InputLabel>
            <Select
              name="metricType"
              value={filters.metricType}
              onChange={handleFilterChange}
              label="Metric Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="weight">Weight</MenuItem>
              <MenuItem value="blood-pressure">Blood Pressure</MenuItem>
              <MenuItem value="blood-sugar">Blood Sugar</MenuItem>
              <MenuItem value="heart-rate">Heart Rate</MenuItem>
              <MenuItem value="cholesterol">Cholesterol</MenuItem>
              <MenuItem value="temperature">Temperature</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              label="Date Range"
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              label="Sort By"
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="value-asc">Value (Low to High)</MenuItem>
              <MenuItem value="value-desc">Value (High to Low)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MetricFilters;