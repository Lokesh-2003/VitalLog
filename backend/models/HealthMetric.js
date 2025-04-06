const mongoose = require('mongoose');

const HealthMetricSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  metricType: {
    type: String,
    required: [true, 'Please select a metric type'],
    enum: [
      'weight',
      'blood-pressure',
      'blood-sugar',
      'heart-rate',
      'cholesterol',
      'temperature',
    ],
  },
  value: {
    type: Number,
    required: [true, 'Please add a value'],
  },
  secondaryValue: {
    type: Number,
    required: function () {
      return this.metricType === 'blood-pressure';
    },
  },
  unit: {
    type: String,
    required: [true, 'Please add a unit'],
    enum: ['kg', 'lbs', 'mmHg', 'mg/dL', 'bpm', '°C', '°F'],
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters'],
  },
  dateRecorded: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HealthMetric', HealthMetricSchema);