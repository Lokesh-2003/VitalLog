const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const HealthMetric = require('../models/HealthMetric');

// @route   GET api/metrics
// @desc    Get all metrics for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const metrics = await HealthMetric.find({ user: req.user.id }).sort({
      dateRecorded: -1,
    });
    res.json(metrics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/metrics
// @desc    Add new metric
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('metricType', 'Metric type is required').not().isEmpty(),
      check('value', 'Value is required').isNumeric(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      metricType,
      value,
      secondaryValue,
      unit,
      notes,
      dateRecorded,
    } = req.body;

    try {
      const newMetric = new HealthMetric({
        user: req.user.id,
        metricType,
        value,
        secondaryValue,
        unit,
        notes,
        dateRecorded: dateRecorded || Date.now(),
      });

      const metric = await newMetric.save();
      res.json(metric);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/metrics/:id
// @desc    Update metric
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const {
    metricType,
    value,
    secondaryValue,
    unit,
    notes,
    dateRecorded,
  } = req.body;

  // Build metric object
  const metricFields = {};
  if (metricType) metricFields.metricType = metricType;
  if (value) metricFields.value = value;
  if (secondaryValue) metricFields.secondaryValue = secondaryValue;
  if (unit) metricFields.unit = unit;
  if (notes) metricFields.notes = notes;
  if (dateRecorded) metricFields.dateRecorded = dateRecorded;

  try {
    let metric = await HealthMetric.findById(req.params.id);

    if (!metric) return res.status(404).json({ msg: 'Metric not found' });

    // Make sure user owns metric
    if (metric.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    metric = await HealthMetric.findByIdAndUpdate(
      req.params.id,
      { $set: metricFields },
      { new: true }
    );

    res.json(metric);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/metrics/:id
// @desc    Delete metric
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const metric = await HealthMetric.findById(req.params.id);

    if (!metric) return res.status(404).json({ msg: 'Metric not found' });

    // Make sure user owns metric
    if (metric.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await HealthMetric.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Metric removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;