const mongoose = require('mongoose')

const deletedUserSchema = mongoose.Schema(
  {
    originalId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    deletedAt: {
        type: Date,
        default: Date.now
    },
    reasons: {
        type: String,
        default: 'User requested deletion'
    },
    savedTodos: [{
        text: String,
        createdAt: Date,
        completed: Boolean
    }]
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('DeletedUser', deletedUserSchema)
