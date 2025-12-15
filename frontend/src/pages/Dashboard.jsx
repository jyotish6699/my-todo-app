import { useEffect, useState, useContext, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, Reorder } from 'framer-motion'
import { FaStar, FaRegCircle, FaCheckCircle, FaStarHalfAlt, FaTimes, FaEdit, FaRandom, FaArrowLeft, FaEye } from 'react-icons/fa'
import AuthContext from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import TodoForm from '../components/TodoForm'
import Layout from '../components/Layout'
import todoService from '../features/todos/todoService'
import { getColorClass } from '../utils/colors'

function Dashboard() {
  const { user } = useContext(AuthContext)
  const { customColor } = useTheme()
  const [todos, setTodos] = useState([])
  const [showPanel, setShowPanel] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [viewingTodo, setViewingTodo] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState(null)
  const [panelTitle, setPanelTitle] = useState('All Notes'); 
  const containerRef = useRef(null)
  const todoFormRef = useRef(null)
  const [isReordering, setIsReordering] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(15);

  // Reset lazy load on filter/search change
  useEffect(() => {
    setVisibleCount(15)
  }, [filter, searchQuery])

  const handleScroll = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollHeight - scrollTop <= clientHeight + 50) {
          setVisibleCount(prev => prev + 10)
      }
  }

  useEffect(() => {
    if (user && user.token) {
      todoService.getTodos(user.token)
        .then(data => setTodos(data))
        .catch(err => console.error(err))
    } else {
        // Load Guest Todos from LocalStorage
        const localTodos = JSON.parse(localStorage.getItem('guestTodos') || '[]');
        setTodos(localTodos)
    }
  }, [user])

  // Save Guest Todos to LocalStorage
  useEffect(() => {
     if (!user) {
         localStorage.setItem('guestTodos', JSON.stringify(todos));
     }
  }, [todos, user]);

  const toggleReorder = () => {
      setIsReordering(!isReordering);
  }

  const handleDeleteClick = (id) => {
      setTodoToDelete(id)
      setShowDeleteModal(true)
  }

  const confirmDelete = () => {
      if (todoToDelete) {
          if (user) {
               todoService.deleteTodo(todoToDelete, user.token)
                .then(() => setTodos(todos.filter((todo) => todo._id !== todoToDelete)))
                .catch(err => console.error(err))
          } else {
              // Guest Delete
              setTodos(todos.filter((todo) => todo._id !== todoToDelete));
          }
           
          // Common cleanup
          if (editingTodo && editingTodo._id === todoToDelete) {
               setEditingTodo(null);
           }
      }
      setShowDeleteModal(false)
      setTodoToDelete(null)
  }

  const handleUpdate = (updatedTodo) => {
    if (user) {
        todoService.updateTodo(updatedTodo._id, updatedTodo, user.token)
        .then(data => {
            setTodos(todos.map(todo => todo._id === data._id ? data : todo));
            // Close edit mode if we were editing this todo (check ID to be safe)
            // But usually we are editing the one we updated.
            setEditingTodo(null);
        })
        .catch(err => console.error(err));
    } else {
        // Guest Update
        setTodos(todos.map(todo => todo._id === updatedTodo._id ? updatedTodo : todo));
        setEditingTodo(null);
    }
  };

  const handleTodoAdded = (newTodo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const handleFormUpdate = (updatedTodo) => {
    setTodos(prevTodos => prevTodos.map(todo => todo._id === updatedTodo._id ? updatedTodo : todo));
    setEditingTodo(null);
  };

  // Route-based filtering and Title Update
  useEffect(() => {
    if (location.pathname === '/today') {
        setPanelTitle('Today\'s Tasks');
    } else if (location.pathname === '/important') {
        setPanelTitle('Important Tasks');
    } else if (location.pathname === '/completed') {
        setPanelTitle('Completed Tasks');
    } else {
        setPanelTitle('All Notes');
    }
  }, [location.pathname]);

  let filteredTodos = todos;
  
  // Apply Route Filter
  if (location.pathname === '/today') {
      const today = new Date().toDateString(); // Compare dates only
      filteredTodos = filteredTodos.filter(todo => new Date(todo.createdAt).toDateString() === today);
  } else if (location.pathname === '/important') {
      filteredTodos = filteredTodos.filter(todo => todo.isImportant);
  } else if (location.pathname === '/completed') {
      filteredTodos = filteredTodos.filter(todo => todo.completed);
  }

  // Apply Search Filter
  filteredTodos = filteredTodos.filter(todo => {
    return todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  })
  
  const displayedTodos = isReordering ? filteredTodos : filteredTodos.slice(0, visibleCount);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row h-full overflow-hidden">
        
        {/* Canvas (Center/Left) - Interactive Board */}
        <div 
            className={`relative bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden shadow-sm transition-colors flex-col cursor-text
            ${showPanel ? 'hidden md:flex flex-1' : 'flex flex-1'}`}
            ref={containerRef}
            style={{ backgroundColor: customColor || undefined }}
            onClick={(e) => {
                // Focus input if clicking background
                if (e.target === containerRef.current || e.target.classList.contains('pointer-events-none')) {
                    todoFormRef.current?.focus();
                }
            }}
        >
            
            {/* Note Creation Area */}
            <div className={`flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col items-center justify-start min-h-0 relative z-0 ${showPanel ? 'pt-4' : 'pt-12'}`}>
                  <div className={`w-full ${showPanel ? 'max-w-2xl' : 'max-w-6xl'} w-full z-10 pointer-events-none transition-all duration-300`}>
                      <div className="pointer-events-auto">
                        <TodoForm 
                            ref={todoFormRef}
                            onTodoAdded={handleTodoAdded} 
                            editingTodo={editingTodo} 
                            onUpdateTodo={handleFormUpdate}
                            defaultSettings={user?.settings || JSON.parse(localStorage.getItem('guestSettings') || '{}')}
                            onCancelEdit={() => {
                                setEditingTodo(null)
                                setShowPanel(true)
                            }}
                        />
                      </div>
                  </div>
                  {!editingTodo && todos.length === 0 && (
                      <div className="text-center text-gray-400 mt-10 pointer-events-none select-none">
                          <FaEdit className="mx-auto text-4xl mb-4 opacity-20" />
                          <p className="text-lg font-medium">Click anywhere to start typing...</p>
                      </div>
                  )}
             </div>



             {/* Show Notes Button (Only visible when panel is hidden and on mobile) */}
             {!showPanel && (
                 <button 
                    onClick={() => setShowPanel(true)}
                    className="absolute top-6 right-6 z-30 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-xl shadow-md hover:bg-black dark:hover:bg-gray-600 hover:scale-105 transition-transform duration-200 font-semibold text-sm flex items-center gap-2 group"
                >
                    <span>Show Notes</span>
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                </button>
             )}


            <div className="absolute inset-0 z-0 opacity-5 dark:opacity-20 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>
             <div className="absolute inset-0 z-0 opacity-0 dark:opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            <div className="flex-1 relative flex items-center justify-center pointer-events-none text-gray-400 dark:text-gray-600 select-none">
                 <div className="text-center opacity-50">
                    <p className="text-4xl mb-2">✨</p>
                    <p>Select a note to edit or create a new one above</p>
                 </div>
            </div>
        </div>

        {/* Right Panel - All Notes List */}
        <div className={`w-full md:w-80 flex-shrink-0 bg-white dark:bg-dark-800 border-l border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden shadow-sm flex-col z-20 h-full ${showPanel ? 'flex' : 'hidden'}`}>

            <div className="p-4 border-b border-gray-100 dark:border-dark-700 font-bold text-gray-700 dark:text-gray-200 flex justify-between items-center bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm">
                <span>{panelTitle}</span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={toggleReorder}
                        className={`p-1.5 rounded-lg transition ${isReordering ? 'bg-brand-500 text-white hover:bg-brand-600' : 'text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-dark-700'}`}
                        title={isReordering ? "Done Reordering" : "Enable Drag & Drop Reordering"}
                    >
                        <FaRandom />
                    </button>
                    <button 
                        onClick={() => setShowPanel(false)}
                        className="p-2 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-full text-gray-600 dark:text-gray-300 transition flex items-center justify-center"
                        title="Close Panel"
                    >
                        <FaArrowLeft />
                    </button>
                </div>
            </div>
                <div 
                    ref={containerRef}
                    className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar smooth-scroll relative"
                    onScroll={handleScroll}
                >
               {/* Search Bar */}
               <div className="mb-2">
                   <input 
                      type="text" 
                      placeholder="Search notes..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-700 dark:text-gray-200"
                   />
               </div>

                {/* Dynamic Settings Classes */}
                {(() => {
                    // Get settings from User or LocalStorage (Guest)
                    const guestSettings = !user ? JSON.parse(localStorage.getItem('guestSettings') || '{}') : {};
                    const density = user?.settings?.viewDensity || guestSettings.viewDensity || 'comfortable';
                    const styleType = user?.settings?.cardStyle || guestSettings.cardStyle || 'modern';
                    
                    const groupSpacing = density === 'compact' ? 'space-y-1' : 'space-y-3';
                    const itemPadding = density === 'compact' ? 'p-2' : 'p-4';
                    
                    let itemStyle = 'shadow-sm border border-black/5'; // Modern (default)
                    if (styleType === 'minimal') itemStyle = 'border border-gray-200 dark:border-dark-700 shadow-none';
                    if (styleType === 'flat') itemStyle = 'bg-gray-50 dark:bg-dark-700 border-none shadow-none';

                    return (
                        <Reorder.Group axis="y" values={todos} onReorder={setTodos} className={groupSpacing} layoutScroll>
                         {displayedTodos.map((todo) => {
                            const boxColor = getColorClass(todo._id); 
                            return (
                                <Reorder.Item 
                                    key={todo._id} 
                                    value={todo}
                                    dragListener={isReordering}
                                    className={`${itemPadding} rounded-lg flex flex-col gap-2 transition-opacity group ${itemStyle} ${boxColor} ${isReordering ? 'cursor-grab active:cursor-grabbing hover:shadow-md' : ''}`}
                                    style={{ position: 'relative' }} 
                                >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleUpdate({...todo, completed: !todo.completed}); }}
                                        onPointerDownCapture={(e) => e.stopPropagation()}
                                        className="mt-0.5 text-gray-700 dark:text-gray-900 opacity-60 hover:opacity-100 hover:scale-110 transition"
                                        title="Toggle Status"
                                    >
                                        {todo.completed ? <FaCheckCircle /> : <FaRegCircle />}
                                    </button>
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
                                     <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            setViewingTodo(todo);
                                        }}
                                        onPointerDownCapture={(e) => e.stopPropagation()}
                                        className="mt-0.5 text-gray-700 dark:text-gray-900 opacity-60 hover:opacity-100 hover:scale-110 transition"
                                        title="View Details"
                                    >
                                        <FaEye />
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
                            <p 
                                className={`font-semibold text-gray-800 dark:text-gray-900 line-clamp-2 leading-snug break-words pointer-events-none text-left ${todo.completed ? 'opacity-50' : ''}`}
                                style={{ 
                                    color: todo.color || 'inherit',
                                    fontSize: todo.fontSize || '14px',
                                    fontFamily: todo.fontStyle || 'sans-serif'
                                }}
                            >
                                {todo.text}
                            </p>
                             <div className="flex items-center justify-between text-[10px] text-gray-600 dark:text-gray-800 font-medium uppercase tracking-wider pointer-events-none">
                                <span>{new Date(todo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>
                                {isReordering && <FaRandom className="text-gray-400 rotate-90" />}
                            </div>
                        </Reorder.Item>
                    )
                })}

                </Reorder.Group>
                );
            })()}

                {filteredTodos.length === 0 && (
                    <div className="p-4 text-center text-gray-400 text-sm">No tasks found.</div>
                )}
            </div>
        </div>

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

        {/* View Details Modal */}
        {viewingTodo && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setViewingTodo(null)}>
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 transform transition-all scale-100 border border-gray-100 dark:border-dark-700 relative" onClick={e => e.stopPropagation()}>
                    <button 
                        onClick={() => setViewingTodo(null)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors"
                    >
                        <FaTimes size={18} />
                    </button>
                    
                    <div className="mt-2">
                         <div className="flex items-center gap-2 mb-4">
                             {viewingTodo.isImportant && <FaStar className="text-yellow-500" />}
                             <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${viewingTodo.completed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                 {viewingTodo.completed ? 'Completed' : 'Active'}
                             </span>
                             <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                                 {new Date(viewingTodo.createdAt).toLocaleString()}
                             </span>
                         </div>
                    
                        <div 
                            className="text-lg text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap break-words max-h-[60vh] overflow-y-auto overflow-x-hidden custom-scrollbar p-1"
                            style={{ 
                                color: viewingTodo.color || 'inherit',
                                fontSize: viewingTodo.fontSize || '16px',
                                fontFamily: viewingTodo.fontStyle || 'sans-serif'
                            }}
                        >
                            {viewingTodo.text}
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={() => setViewingTodo(null)}
                            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl transition-colors shadow-md shadow-brand-500/20"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </Layout>
  )
}

export default Dashboard
