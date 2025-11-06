const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'required task name'] },
  description: { type: String, default: '' },
  deadline: { type: Date, required: [true, 'deadline required'] },
  completed: { type: Boolean, default: false },
  assignedUser: { type: String, default: '' },
  assignedUserName: { type: String, default: 'unassigned' },
  dateCreated: { type: Date, default: Date.now, immutable: true },
});

module.exports = mongoose.model('Task', TaskSchema);
