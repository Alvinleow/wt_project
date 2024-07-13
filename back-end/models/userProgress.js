const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonStatuses: [{
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    status: { type: String, enum: ['viewed', 'not viewed'], default: 'not viewed' }
  }]
});

module.exports = mongoose.model('UserProgress', userProgressSchema);
