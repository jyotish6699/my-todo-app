import { useRef } from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaRegStar, FaEdit } from 'react-icons/fa'
import { getColorClass } from '../utils/colors'

function TodoItem({ todo, onDelete, onUpdate, onEdit, onDragEnd, constraintsRef }) {
  
  const colorClass = getColorClass(todo._id);

  // Default position if not set
  const initialX = todo.position?.x || 50 + Math.random() * 200;
  const initialY = todo.position?.y || 50 + Math.random() * 200;

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.1}
      dragMomentum={false}
      whileDrag={{ scale: 1.1, zIndex: 100, shadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
      whileHover={{ scale: 1.02, zIndex: 50 }}
      initial={{ x: initialX, y: initialY }}
      className={`absolute w-64 h-64 p-5 shadow-md rounded-lg ${colorClass} flex flex-col justify-between transition-colors`}
      style={{ cursor: 'grab' }}
      onDragEnd={(e, info) => onDragEnd && onDragEnd(todo, info.point)}
    >
      {/* Important Marker (Star) placed at top right or prominent */}
      <button 
        onClick={(e) => { e.stopPropagation(); onUpdate({...todo, isImportant: !todo.isImportant}); }}
        className="absolute top-2 right-2 p-2 text-yellow-600 dark:text-yellow-300 hover:scale-110 transition-transform z-10"
        onPointerDownCapture={e => e.stopPropagation()}
        title="Mark as Important"
      >
          {todo.isImportant ? <FaStar className="text-xl" /> : <FaRegStar className="text-xl opacity-50 hover:opacity-100" />}
      </button>

      {/* Decorative Tape */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-white/30 rotate-1 shadow-sm border border-white/10"></div>

      <div className="flex-1 overflow-y-auto mt-6 custom-scrollbar pointer-events-auto onmousedown={(e) => e.stopPropagation()}">
        {/* Enforce text-left for alignment */}
        <p className={`text-lg font-medium text-gray-800 dark:text-gray-900 font-handwriting leading-relaxed text-left break-words ${todo.completed ? 'opacity-50' : ''}`}>
          {todo.text}
        </p>
      </div>

      <div className="mt-2 pt-2 border-t border-black/10 dark:border-black/20 flex items-center justify-between pointer-events-auto">
        <span className="text-xs font-bold text-gray-600 dark:text-gray-800">
           {new Date(todo.createdAt).toLocaleDateString()}
        </span>

        <div className="flex gap-2">
           <button 
             onClick={(e) => onUpdate && onUpdate({...todo, completed: !todo.completed})}
             className="w-8 h-8 flex items-center justify-center rounded-full bg-white/40 hover:bg-white text-gray-800 transition shadow-sm border border-white/20"
             title="Toggle Complete"
             onPointerDownCapture={e => e.stopPropagation()}
           >
              {todo.completed ? '↩️' : '✅'}
           </button>
           <button 
             onClick={(e) => {
                 e.stopPropagation();
                 onEdit && onEdit(todo);
             }}
             className="w-8 h-8 flex items-center justify-center rounded-full bg-white/40 hover:bg-white text-gray-800 transition shadow-sm border border-white/20"
             title="Edit"
             onPointerDownCapture={e => e.stopPropagation()}
           >
              <FaEdit />
           </button>
           <button 
             onClick={(e) => onDelete && onDelete(todo._id)}
             className="w-8 h-8 flex items-center justify-center rounded-full bg-white/40 hover:bg-red-500 hover:text-white text-gray-800 transition shadow-sm border border-white/20"
             title="Delete"
             onPointerDownCapture={e => e.stopPropagation()}
           >
             🗑️
           </button>
        </div>
      </div>
    </motion.div>
  )
}

export default TodoItem
