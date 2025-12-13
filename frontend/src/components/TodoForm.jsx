import { useState, useEffect, useContext, useRef } from 'react'
import AuthContext from '../context/AuthContext'
import todoService from '../features/todos/todoService'
import { FaPlus, FaCheck, FaTimes } from 'react-icons/fa'

function TodoForm({ onTodoAdded, editingTodo, onUpdateTodo, onCancelEdit }) {
  const [text, setText] = useState('')
  const { user } = useContext(AuthContext)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editingTodo) {
        setText(editingTodo.text)
        inputRef.current?.focus()
    } else {
        setText('')
    }
  }, [editingTodo])

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!text) return;

    if (!user) {
        alert("Please Sign Up or Log In first to save your notes!");
        return;
    }

    if (editingTodo) {
        onUpdateTodo(editingTodo._id, { ...editingTodo, text })
        setText('')
    } else {
        try {
            const newTodo = await todoService.createTodo({ text }, user.token)
            onTodoAdded(newTodo)
            setText('')
        } catch (error) {
            console.error(error)
        }
    }
  }

  const handleCancel = () => {
      setText('')
      onCancelEdit()
  }

  return (
    <div className={`mb-8 bg-gray-50 dark:bg-dark-800 rounded-xl p-2 transition-all duration-200 border ${isFocused ? 'border-brand-500 bg-white dark:bg-dark-700 ring-4 ring-brand-50 dark:ring-brand-900/20' : 'border-transparent'}`}>
      <form onSubmit={onSubmit} className='flex items-center gap-3'>
        <div className={`p-3 transition-colors ${editingTodo ? 'text-brand-500' : 'text-gray-400'}`}>
            {editingTodo ? <FaCheck /> : <FaPlus />}
        </div>
        <input
            ref={inputRef}
            type='text'
            className='flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed'
            name='text'
            id='text'
            value={text}
            placeholder={user ? (editingTodo ? 'Update your note...' : 'Add a new task') : 'Log in to create tasks'}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete="off"
            disabled={!user}
            title={!user ? "Guest users cannot create tasks" : ""}
          />
          {editingTodo && (
               <button 
                type='button'
                onClick={handleCancel}
                className="px-3 py-2 text-gray-500 hover:text-red-500 transition-colors"
                title="Cancel Edit"
                >
                  <FaTimes />
              </button>
          )}
          {text && (
              <button 
                type='submit'
                className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors"
                >
                  {editingTodo ? 'Update' : 'Add Task'}
              </button>
          )}
      </form>
    </div>
  )
}

export default TodoForm
