const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('../middleware/auth');

// Get all activities for a user
router.get('/', verifyToken, (req, res) => {
  const userId = req.userId;

  console.log('\n📋 FETCH ALL ACTIVITIES');
  console.log(`   User ID: ${userId}`);

  const query = 'SELECT * FROM activities WHERE user_id = ? ORDER BY activity_date DESC, activity_time DESC';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching activities:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log(`✅ Retrieved ${results.length} activities\n`);
    res.json(results || []);
  });
});

// Get single activity
router.get('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  console.log('\n📄 FETCH ACTIVITY BY ID');
  console.log(`   Activity ID: ${id}`);
  console.log(`   User ID: ${userId}`);

  const query = 'SELECT * FROM activities WHERE id = ? AND user_id = ?';
  
  db.query(query, [id, userId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching activity:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      console.warn('   ⚠️  Activity not found\n');
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    console.log(`✅ Activity found: ${results[0].activity_name}\n`);
    res.json(results[0]);
  });
});

// Create activity
router.post('/', verifyToken, (req, res) => {
  const { activity_name, activity_date, activity_time, description } = req.body;
  const userId = req.userId;

  console.log('\n➕ CREATE ACTIVITY');
  console.log(`   User ID: ${userId}`);
  console.log(`   Activity: ${activity_name}`);
  console.log(`   Date: ${activity_date}`);
  console.log(`   Time: ${activity_time}`);

  if (!activity_name || !activity_date || !activity_time) {
    console.warn('   ⚠️  Missing required fields');
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO activities (user_id, activity_name, activity_date, activity_time, description) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [userId, activity_name, activity_date, activity_time, description || ''], (err, result) => {
    if (err) {
      console.error('❌ Error creating activity:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    const activityId = result.insertId;
    console.log(`✅ Activity created successfully - ID: ${activityId}\n`);
    
    res.status(201).json({
      message: 'Activity created successfully',
      id: activityId,
    });
  });
});

// Update activity
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { activity_name, activity_date, activity_time, description } = req.body;
  const userId = req.userId;

  console.log('\n✏️  UPDATE ACTIVITY');
  console.log(`   Activity ID: ${id}`);
  console.log(`   User ID: ${userId}`);
  console.log(`   Activity: ${activity_name}`);

  if (!activity_name || !activity_date || !activity_time) {
    console.warn('   ⚠️  Missing required fields');
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'UPDATE activities SET activity_name = ?, activity_date = ?, activity_time = ?, description = ?, updated_at = NOW() WHERE id = ? AND user_id = ?';
  
  db.query(query, [activity_name, activity_date, activity_time, description || '', id, userId], (err, result) => {
    if (err) {
      console.error('❌ Error updating activity:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      console.warn('   ⚠️  Activity not found\n');
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    console.log(`✅ Activity updated successfully\n`);
    res.json({ message: 'Activity updated successfully' });
  });
});

// Delete activity
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  console.log('\n🗑️  DELETE ACTIVITY');
  console.log(`   Activity ID: ${id}`);
  console.log(`   User ID: ${userId}`);

  const query = 'DELETE FROM activities WHERE id = ? AND user_id = ?';
  
  db.query(query, [id, userId], (err, result) => {
    if (err) {
      console.error('❌ Error deleting activity:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      console.warn('   ⚠️  Activity not found\n');
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    console.log(`✅ Activity deleted successfully\n`);
    res.json({ message: 'Activity deleted successfully' });
  });
});

module.exports = router;