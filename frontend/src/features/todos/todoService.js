import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_URL = `${BASE_URL}/todos/`;

const createTodo = async (todoData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, todoData, config)

  return response.data
}

const getTodos = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  return response.data
}

const deleteTodo = async (todoId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + todoId, config)

  return response.data
}

const updateTodo = async (todoId, todoData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.put(API_URL + todoId, todoData, config)
  return response.data
}


const todoService = {
  createTodo,
  getTodos,
  deleteTodo,
  updateTodo,
}

export default todoService
