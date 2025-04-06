import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Box,
} from '@mui/material';
import {
  MonitorWeight,
  Favorite,
  Bloodtype,
} from '@mui/icons-material';

const MetricSummary = ({ getLatestMetric }) => {
  const latestWeight = getLatestMetric('weight');
  const latestBP = getLatestMetric('blood-pressure');
  const latestSugar = getLatestMetric('blood-sugar');
  const latestHR = getLatestMetric('heart-rate');

  const summaryItems = [
    {
      type: 'weight',
      icon: <MonitorWeight />,
      value: latestWeight
        ? `${latestWeight.value} ${latestWeight.unit}`
        : 'No data',
      color: '#4caf50',
    },
    {
      type: 'blood-pressure',
      icon: <Bloodtype />,
      value: latestBP
        ? `${latestBP.value}/${latestBP.secondaryValue} ${latestBP.unit}`
        : 'No data',
      color: '#f44336',
    },
    {
      type: 'blood-sugar',
      icon: <Bloodtype />,
      value: latestSugar
        ? `${latestSugar.value} ${latestSugar.unit}`
        : 'No data',
      color: '#9c27b0',
    },
    {
      type: 'heart-rate',
      icon: <Favorite />,
      value: latestHR
        ? `${latestHR.value} ${latestHR.unit}`
        : 'No data',
      color: '#2196f3',
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {summaryItems.map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item.type}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: item.color,
                    mr: 2,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Typography variant="h6" component="div">
                  {item.type
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Typography>
              </Box>
              <Typography variant="h5" component="div">
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Latest Reading
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricSummary;