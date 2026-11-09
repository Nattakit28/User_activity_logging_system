const express = require('express');
const router = express.Router();

const Activity = require('../models/Activity');
const verifyToken = require('../middleware/auth');
const mongoose = require('mongoose');

router.use(verifyToken);

// Convert MongoDB document to frontend-compatible response
const formatActivity = (activity) => ({
  id: activity._id.toString(),
  user_id: activity.user_id.toString(),
  activity_name: activity.activity_name,
  activity_date: activity.activity_date,
  activity_time: activity.activity_time,
  description: activity.description,
  created_at: activity.created_at,
  updated_at: activity.updated_at
});

// Validate MongoDB ID
const validId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find({
      user_id: req.userId
    }).sort({
      activity_date: -1,
      activity_time: -1
    });

    res.json(activities.map(formatActivity));

  } catch (error) {
    console.error('Fetch activities error:', error.message);

    res.status(500).json({
      error: 'Database error'
    });
  }
});

// Get single activity
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    const activity = await Activity.findOne({
      _id: id,
      user_id: req.userId
    });

    if (!activity) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    res.json(formatActivity(activity));

  } catch (error) {
    console.error('Fetch activity error:', error.message);

    res.status(500).json({
      error: 'Database error'
    });
  }
});

// Create activity
router.post('/', async (req, res) => {
  try {
    const {
      activity_name,
      activity_date,
      activity_time,
      description
    } = req.body;

    if (!activity_name || !activity_date || !activity_time) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    const activity = await Activity.create({
      user_id: req.userId,
      activity_name,
      activity_date,
      activity_time,
      description: description || ''
    });

    res.status(201).json({
      message: 'Activity created successfully',
      id: activity._id.toString()
    });

  } catch (error) {
    console.error('Create activity error:', error.message);

    res.status(500).json({
      error: 'Database error'
    });
  }
});

// Update activity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      activity_name,
      activity_date,
      activity_time,
      description
    } = req.body;

    if (!validId(id)) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    if (!activity_name || !activity_date || !activity_time) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    const activity = await Activity.findOneAndUpdate(
      {
        _id: id,
        user_id: req.userId
      },
      {
        activity_name,
        activity_date,
        activity_time,
        description: description || ''
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!activity) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    res.json({
      message: 'Activity updated successfully'
    });

  } catch (error) {
    console.error('Update activity error:', error.message);

    res.status(500).json({
      error: 'Database error'
    });
  }
});

// Delete activity
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    const activity = await Activity.findOneAndDelete({
      _id: id,
      user_id: req.userId
    });

    if (!activity) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    res.json({
      message: 'Activity deleted successfully'
    });

  } catch (error) {
    console.error('Delete activity error:', error.message);

    res.status(500).json({
      error: 'Database error'
    });
  }
});

module.exports = router;