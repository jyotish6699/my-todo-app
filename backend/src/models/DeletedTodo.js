const mongoose = require('mongoose')

const deletedTodoSchema = mongoose.Schema(
  {
    originalTodoId: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    deletedAt: {
        type: Date,
        default: Date.now
    },
    originalCreatedAt: {
        type: Date,
    },
    wasCompleted: {
        type: Boolean,
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('DeletedTodo', deletedTodoSchema)
