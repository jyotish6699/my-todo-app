const asyncHandler = require('express-async-handler')
const Todo = require('../models/Todo')
const User = require('../models/User') // Keep for validation if needed, but req.user is enough

// @desc    Get todos
// @route   GET /api/todos
// @access  Private
const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.user.id })
  res.status(200).json(todos)
})

// @desc    Set todo
// @route   POST /api/todos
// @access  Private
const setTodo = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a text field')
  }

  const todo = await Todo.create({
    text: req.body.text,
    user: req.user.id,
    color: req.body.color,
    fontSize: req.body.fontSize,
    fontStyle: req.body.fontStyle
  })

  res.status(200).json(todo)
})

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id)

  if (!todo) {
    res.status(404)
    throw new Error('Todo not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the todo user
  if (todo.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedTodo)
})


// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id)
  const DeletedTodo = require('../models/DeletedTodo') // Import here or at top

  if (!todo) {
    res.status(404)
    throw new Error('Todo not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the todo user
  if (todo.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  // Archive token before deletion
  await DeletedTodo.create({
      originalTodoId: todo._id,
      user: req.user.id,
      text: todo.text,
      originalCreatedAt: todo.createdAt,
      wasCompleted: todo.completed
  })

  await todo.deleteOne()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getTodos,
  setTodo,
  updateTodo,
  deleteTodo,
}
