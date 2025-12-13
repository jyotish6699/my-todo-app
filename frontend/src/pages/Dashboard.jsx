import { useEffect, useState, useContext, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { motion, Reorder } from 'framer-motion'
import { FaStar, FaRegCircle, FaCheckCircle, FaStarHalfAlt, FaTimes, FaEdit } from 'react-icons/fa'
import AuthContext from '../context/AuthContext'
import TodoForm from '../components/TodoForm'
import TodoItem from '../components/TodoItem'
import Layout from '../components/Layout'
import todoService from '../features/todos/todoService'
import { getColorClass } from '../utils/colors'

function Dashboard() {
  const location = useLocation()
  const { user } = useContext(AuthContext)
  const [todos, setTodos] = useState([])
  const [showPanel, setShowPanel] = useState(true)
  const [editingTodo, setEditingTodo] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState(null)
  const containerRef = useRef(null)
  const [panelTitle, setPanelTitle] = useState('All Notes'); // Added for panel header

  useEffect(() => {
    if (user && user.token) {
      todoService.getTodos(user.token)
        .then(data => setTodos(data))
        .catch(err => console.error(err))
    } else {
        setTodos([]) // Clear todos on logout/guest mode
    }
  }, [user])

  const handleDeleteClick = (id) => {
      setTodoToDelete(id)
      setShowDeleteModal(true)
  }

  const confirmDelete = () => {
      if (todoToDelete) {
          todoService.deleteTodo(todoToDelete, user.token)
            .then(() => setTodos(todos.filter((todo) => todo._id !== todoToDelete)))
            .catch(err => console.error(err))
          
          if (editingTodo && editingTodo._id === todoToDelete) {
              setEditingTodo(null);
          }
      }
      setShowDeleteModal(false)
      setTodoToDelete(null)
  }

  // Placeholder for handleUpdate and handleFormUpdate, assuming they exist elsewhere or will be added
  const handleUpdate = (updatedTodo) => {
    // Logic to update a todo
    console.log('Update todo:', updatedTodo);
    todoService.updateTodo(updatedTodo._id, updatedTodo, user.token)
      .then(data => setTodos(todos.map(todo => todo._id === data._id ? data : todo)))
      .catch(err => console.error(err));
  };

  const handleTodoAdded = (newTodo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const handleFormUpdate = (updatedTodo) => {
    setTodos(prevTodos => prevTodos.map(todo => todo._id === updatedTodo._id ? updatedTodo : todo));
    setEditingTodo(null);
  };

  let filteredTodos = todos;
  // ... (keep filtering logic) ...

  return (
    <Layout>
      <div className="flex h-[calc(100vh-100px)] gap-4 relative">
        
        {/* Canvas (Center/Left) - Interactive Board */}
        <div className="flex-1 relative bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden shadow-sm transition-colors" ref={containerRef}>
            
            <div className="absolute top-4 left-4 z-30 w-full max-w-sm pointer-events-auto">
                <TodoForm 
                    onTodoAdded={handleTodoAdded} 
                    editingTodo={editingTodo} 
                    onUpdateTodo={handleFormUpdate} 
                    onCancelEdit={() => setEditingTodo(null)}
                />
            </div>

             {/* Show Notes Button (Only visible when panel is hidden) */}
             {!showPanel && (
                 <button 
                    onClick={() => setShowPanel(true)}
                    className="absolute top-4 right-4 z-30 px-4 py-2 bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-dark-700 transition font-medium text-sm flex items-center gap-2"
                >
                    Show Notes
                </button>
             )}


            <div className="absolute inset-0 z-0 opacity-5 dark:opacity-20 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>
             <div className="absolute inset-0 z-0 opacity-0 dark:opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            <div className="w-full h-full relative">
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 dark:text-gray-600 select-none">
                     <div className="text-center">
                        <p className="text-4xl mb-2">📌</p>
                        <p>Drag notes here from the list</p>
                     </div>
                 </div>
            </div>
        </div>

        {/* Right Panel - All Notes List */}
        {showPanel && (
            <div className="w-80 flex-shrink-0 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden shadow-sm flex flex-col z-20">
                <div className="p-4 border-b border-gray-100 dark:border-dark-700 font-bold text-gray-700 dark:text-gray-200 flex justify-between items-center">
                    <span>{panelTitle}</span>
                    <button 
                        onClick={() => setShowPanel(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                        title="Hide Notes"
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar relative">
                    {filteredTodos.map((todo) => {
                        const boxColor = getColorClass(todo._id); 
                        return (
                            <div 
                                key={todo._id} 
                                className={`p-4 rounded-lg flex flex-col gap-2 hover:opacity-90 transition-opacity group shadow-sm border border-black/5 ${boxColor}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-2">
                                         {/* Status Button (Stat) */}
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleUpdate({...todo, completed: !todo.completed}); }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            className="mt-0.5 text-gray-700 dark:text-gray-900 opacity-60 hover:opacity-100 hover:scale-110 transition"
                                            title="Toggle Status"
                                        >
                                            {todo.completed ? <FaCheckCircle /> : <FaRegCircle />}
                                        </button>
                                        
                                        {/* Edit Button */}
                                         <button 
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setEditingTodo(todo);
                                            }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            className="mt-0.5 text-gray-700 dark:text-gray-900 opacity-60 hover:opacity-100 hover:scale-110 transition"
                                            title="Edit Note"
                                        >
                                            <FaEdit />
                                        </button>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleUpdate({...todo, isImportant: !todo.isImportant}); }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            className={`text-sm hover:scale-110 transition ${todo.isImportant ? 'text-yellow-600 dark:text-yellow-800' : 'text-gray-400 hover:text-yellow-500'}`}
                                            title="Toggle Important"
                                        >
                                            {todo.isImportant ? <FaStar /> : <FaStarHalfAlt />}
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(todo._id); }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            className="text-gray-400 hover:text-red-500 transition text-sm"
                                            title="Delete"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                </div>
                                
                                <p className={`text-sm font-semibold text-gray-800 dark:text-gray-900 line-clamp-2 leading-snug break-words pointer-events-none text-left ${todo.completed ? 'opacity-50' : ''}`}>
                                    {todo.text}
                                </p>
                                
                                <div className="flex items-center justify-between text-[10px] text-gray-600 dark:text-gray-800 font-medium uppercase tracking-wider pointer-events-none">
                                    <span>{new Date(todo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>
                                </div>
                            </div>
                        )
                    })}

                    {filteredTodos.length === 0 && (
                        <div className="p-4 text-center text-gray-400 text-sm">No tasks here.</div>
                    )}
                </div>
            </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {showDeleteModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100 border border-gray-100 dark:border-dark-700">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                            <FaTimes className="h-6 w-6 text-red-600 dark:text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Note?</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Are you sure you want to delete this note? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-red-200 dark:shadow-none"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </Layout>
  )
}

export default Dashboard
