import React, { useContext, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { MetricContext } from '../context/metricContext';
import { AuthContext } from '../context/authContext';
import MetricList from '../components/metrics/MetricList';
import MetricForm from '../components/metrics/MetricForm';
import MetricFilters from '../components/metrics/MetricFilters';
import MetricSummary from '../components/metrics/MetricSummary';
import MetricChart from '../components/charts/MetricChart';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const {
    metrics,
    filteredMetrics,
    loading,
    error,
    filters,
    updateFilters,
    getLatestMetric,
  } = useContext(MetricContext);
  const [openForm, setOpenForm] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);

  const handleEdit = (metric) => {
    setEditingMetric(metric);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingMetric(null);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
        Welcome, {user?.name}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <MetricSummary getLatestMetric={getLatestMetric} />

      <MetricChart metrics={metrics} />

      <MetricFilters filters={filters} updateFilters={updateFilters} />

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h6">Your Health Metrics</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenForm(true)}
          >
            Add Metric
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        <MetricList
          metrics={filteredMetrics}
          onEdit={handleEdit}
        />
      )}

      <MetricForm
        open={openForm}
        onClose={handleFormClose}
        metric={editingMetric}
      />
    </Container>
  );
};

export default Dashboard;