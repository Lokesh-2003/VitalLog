const HealthMetric = require('../models/HealthMetric');

exports.createMetric = async (req, res, next) => {
  try {
    const metric = await HealthMetric.create({
      ...req.body,
      user: req.user.id
    });
    
    res.status(201).json({
      status: 'success',
      data: { metric }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMetrics = async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.query;
    const filter = { user: req.user.id };
    
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.recordedAt = {};
      if (startDate) filter.recordedAt.$gte = new Date(startDate);
      if (endDate) filter.recordedAt.$lte = new Date(endDate);
    }
    
    const metrics = await HealthMetric.find(filter)
      .sort('-recordedAt');
    
    res.status(200).json({
      status: 'success',
      results: metrics.length,
      data: { metrics }
    });
  } catch (err) {
    next(err);
  }
};

// Add updateMetric and deleteMetric similarly