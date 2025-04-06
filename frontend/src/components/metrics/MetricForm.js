import { useState, useContext } from 'react';
import { MetricContext } from '../../context/metricContext';
import { TextField, Select, MenuItem, Button, Grid } from '@mui/material';

function MetricForm({ metric = null, onClose }) {
  const { addMetric, updateMetric } = useContext(MetricContext);
  const [formData, setFormData] = useState({
    metricType: metric?.metricType || 'weight',
    value: metric?.value || '',
    unit: metric?.unit || 'kg',
    dateRecorded: metric?.dateRecorded || new Date().toISOString().slice(0, 16)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (metric) {
      await updateMetric(metric._id, formData);
    } else {
      await addMetric(formData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Select
            fullWidth
            value={formData.metricType}
            onChange={(e) => setFormData({...formData, metricType: e.target.value})}
          >
            <MenuItem value="weight">Weight</MenuItem>
            <MenuItem value="blood-pressure">Blood Pressure</MenuItem>
            <MenuItem value="blood-sugar">Blood Sugar</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Value"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({...formData, value: e.target.value})}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {metric ? 'Update' : 'Add'} Metric
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default MetricForm;