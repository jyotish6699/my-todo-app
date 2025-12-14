const mongoose = require('mongoose')

const todoSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    isImportant: {
        type: Boolean,
        default: false,
    },
    position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 }
    },
    color: { type: String, default: '' },
    fontSize: { type: String, default: '18px' },
    fontStyle: { type: String, default: 'sans-serif' }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Todo', todoSchema)
