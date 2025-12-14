const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    profilePic: {
        type: String,
        default: ""
    },
    settings: {
        defaultColor: { type: String, default: "" },
        defaultFontSize: { type: String, default: "18px" },
        defaultFontStyle: { type: String, default: "sans-serif" },
        dashboardColor: { type: String, default: "" }
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
