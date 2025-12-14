const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      settings: user.settings,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email or name
  const user = await User.findOne({ 
      $or: [
          { email: email }, 
          { name: email }
      ] 
  })

  if (!user) {
    res.status(400)
    throw new Error('User does not exist. Please Sign Up first.')
  }

  if (await bcrypt.compare(password, user.password)) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      settings: user.settings,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  if (user) {
    user.name = req.body.name !== undefined ? req.body.name : user.name
    user.email = req.body.email !== undefined ? req.body.email : user.email
    user.profilePic = req.body.profilePic !== undefined ? req.body.profilePic : user.profilePic
    
    if (req.body.settings) {
        // Ensure settings object exists
        if (!user.settings) user.settings = {};
        
        // Manual update to ensure Mongoose detects changes
        if (req.body.settings.defaultColor !== undefined) user.settings.defaultColor = req.body.settings.defaultColor;
        if (req.body.settings.defaultFontSize !== undefined) user.settings.defaultFontSize = req.body.settings.defaultFontSize;
        if (req.body.settings.defaultFontStyle !== undefined) user.settings.defaultFontStyle = req.body.settings.defaultFontStyle;
        if (req.body.settings.dashboardColor !== undefined) user.settings.dashboardColor = req.body.settings.dashboardColor;
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(req.body.password, salt)
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      settings: updatedUser.settings,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Delete user data
// @route   DELETE /api/users/me
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    const Todo = require('../models/Todo')
    const DeletedUser = require('../models/DeletedUser')
    const DeletedTodo = require('../models/DeletedTodo')

    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    // 1. Get all their ACTIVE todos
    const userTodos = await Todo.find({ user: user._id })
    
    // 2. Get all their TRASHED (previously deleted) todos
    const trashedTodos = await DeletedTodo.find({ user: user._id })

    // 3. Combine them for the archive
    const allTodosToArchive = [
        ...userTodos.map(t => ({
            text: t.text,
            createdAt: t.createdAt,
            completed: t.completed
        })),
        ...trashedTodos.map(t => ({
            text: t.text + ' [Deleted]',
            createdAt: t.originalCreatedAt,
            completed: t.wasCompleted
        }))
    ]

    // 4. Archive everything in 'deletedusers' collection
    await DeletedUser.create({
        originalId: user._id,
        name: user.name,
        email: user.email,
        savedTodos: allTodosToArchive
    })

    // 5. Delete actual data from both collections
    await Todo.deleteMany({ user: user._id })
    await DeletedTodo.deleteMany({ user: user._id })
    await User.findByIdAndDelete(req.user.id)

    res.status(200).json({ id: req.user.id, message: "User archived and deleted" })
})

// @desc    Restore archived user
// @route   POST /api/users/restore
// @access  Public
const restoreArchivedUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const DeletedUser = require('../models/DeletedUser')
    const Todo = require('../models/Todo')

    // If no email provided, and we are looking for 'jyotish', try to find him?
    // But better to enforce email.
    if (!email) {
        res.status(400)
        throw new Error('Please provide email to restore')
    }

    const deletedUser = await DeletedUser.findOne({ 
        email: { $regex: email, $options: 'i' } 
    }).sort({ createdAt: -1 });

    if (!deletedUser) {
        res.status(404)
        throw new Error('No archived user found with that email')
    }

    const existingUser = await User.findOne({ email: deletedUser.email });
    let userId;
    let passwordMsg = "";

    if (existingUser) {
        userId = existingUser._id;
        passwordMsg = "User account already exists. Restored data to it.";
    } else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash('password123', salt)
        
        const newUser = await User.create({
            _id: deletedUser.originalId,
            name: deletedUser.name,
            email: deletedUser.email,
            password: hashedPassword
        })
        userId = newUser._id;
        passwordMsg = "Account restored. Temporary password: 'password123'";
    }

    if (deletedUser.savedTodos && deletedUser.savedTodos.length > 0) {
        const todosToInsert = deletedUser.savedTodos.map(t => ({
            user: userId,
            text: t.text,
            completed: t.completed,
            createdAt: t.createdAt
        }));
        await Todo.insertMany(todosToInsert);
    }

    res.status(200).json({ 
        message: `Success! ${passwordMsg}. Restored ${deletedUser.savedTodos?.length || 0} todos.`,
        email: deletedUser.email
    })
})

module.exports = {
  registerUser,
  loginUser,
  getMe,
  deleteUser,
  updateUser,
  restoreArchivedUser,
}
