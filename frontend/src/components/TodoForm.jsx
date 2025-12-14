import { useState, useEffect, useContext, useRef, forwardRef, useImperativeHandle } from 'react'
import AuthContext from '../context/AuthContext'
import todoService from '../features/todos/todoService'
import { FaPlus, FaCheck, FaTimes, FaTextHeight, FaFont } from 'react-icons/fa'

const TodoForm = forwardRef(({ onTodoAdded, editingTodo, onUpdateTodo, onCancelEdit, defaultSettings }, ref) => {
  const [text, setText] = useState('')
  const [textColor, setTextColor] = useState('') 
  const [fontSize, setFontSize] = useState('18px')
  const [fontStyle, setFontStyle] = useState('sans-serif')
  const { user } = useContext(AuthContext)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  useEffect(() => {
    if (editingTodo) {
        setText(editingTodo.text)
        setTextColor(editingTodo.color || '') 
        setFontSize(editingTodo.fontSize || '18px')
        setFontStyle(editingTodo.fontStyle || 'sans-serif')
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current.style.height = 'auto';
                inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
            }, 0);
        }
        inputRef.current?.focus()
    } else {
        setText('')
        // Use defaults if user has them (passed via props ideally, or just hardcoded for now if not passed)
        setTextColor(defaultSettings?.defaultColor || '')
        setFontSize(defaultSettings?.defaultFontSize || '18px')
        setFontStyle(defaultSettings?.defaultFontStyle || 'sans-serif')
        if (inputRef.current) inputRef.current.style.height = 'auto';
    }
  }, [editingTodo, defaultSettings])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    const todoData = {
        text,
        color: textColor,
        fontSize,
        fontStyle
    }

    if (editingTodo) {
        onUpdateTodo({ ...editingTodo, ...todoData })
    } else {
        if (user) {
            try {
                const created = await todoService.createTodo(todoData, user.token)
                onTodoAdded(created)
            } catch (error) {
                console.error(error)
            }
        } else {
            const newTodo = {
                _id: Date.now().toString(),
                ...todoData,
                completed: false,
                isImportant: false,
                createdAt: new Date().toISOString()
            }
            onTodoAdded(newTodo)
        }
    }
    setText('')
    // Keep styles or reset to defaults? Reset usually.
    if (!editingTodo) {
        setTextColor(defaultSettings?.defaultColor || '')
        setFontSize(defaultSettings?.defaultFontSize || '18px')
        setFontStyle(defaultSettings?.defaultFontStyle || 'sans-serif')
    }
  }

  const handleCancel = () => {
      onCancelEdit()
      setText('')
      setTextColor(defaultSettings?.defaultColor || '')
      setFontSize(defaultSettings?.defaultFontSize || '18px')
      setFontStyle(defaultSettings?.defaultFontStyle || 'sans-serif')
  }

  const toggleFontSize = () => {
      const sizes = ['14px', '18px', '24px', '30px'];
      const currentIdx = sizes.indexOf(fontSize);
      setFontSize(sizes[(currentIdx + 1) % sizes.length]);
  }

  const toggleFontStyle = () => {
      const styles = ['sans-serif', 'serif', 'monospace', 'cursive'];
      const currentIdx = styles.indexOf(fontStyle);
      setFontStyle(styles[(currentIdx + 1) % styles.length]);
  }

  return (
    <div 
        onClick={() => inputRef.current?.focus()}
        className="w-full p-4 flex flex-col"
    >
      <form onSubmit={onSubmit} className='flex flex-row items-start gap-3 relative'>
          
        {/* Left Controls group */}
        <div className="pt-2 flex flex-col gap-2">
            {/* Color Picker */}
            <label className="flex items-center justify-center p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition cursor-pointer" title="Pen Color">
                <div className="relative overflow-hidden w-6 h-6 rounded-full ring-1 ring-gray-300 dark:ring-gray-600">
                    <input 
                        type="color" 
                        value={textColor || '#000000'}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div 
                        className="w-full h-full"
                        style={{ backgroundColor: textColor || '#374151' }}
                    ></div>
                </div>
            </label>

            {/* Font Size Toggle */}
            <button
                type="button"
                onClick={toggleFontSize}
                className="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition"
                title={`Size: ${fontSize}`}
            >
                <FaTextHeight size={18} />
            </button>

             {/* Font Style Toggle */}
             <button
                type="button"
                onClick={toggleFontStyle}
                className="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition"
                title={`Font: ${fontStyle}`}
            >
                <FaFont size={16} />
            </button>
        </div>

        {/* Center: Text Input */}
        <textarea
            ref={inputRef}
            className='flex-1 bg-transparent border-none outline-none placeholder-gray-400 font-medium resize-none overflow-hidden py-3 text-lg min-h-[300px] caret-brand-500 transition-all duration-200'
            style={{ 
                color: textColor || undefined,
                fontSize: fontSize,
                fontFamily: fontStyle
            }}
            name='text'
            id='text'
            value={text}
            placeholder={editingTodo ? 'Update your note...' : 'Start writing...'}
            onChange={(e) => {
                setText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit(e);
                }
            }}
            title={!user ? "Guest Mode: Notes are saved locally" : ""}
          />
          
        {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
             {editingTodo && (
                <button 
                    type='button'
                    onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full"
                    title="Cancel"
                >
                    <FaTimes />
                </button>
             )}
             {(text.trim() || editingTodo) && (
             <button 
                type='submit'
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl shadow-md hover:bg-brand-600 transition-transform hover:scale-105"
                title={editingTodo ? 'Update' : 'Add Note'}
            >
                {editingTodo ? <FaCheck /> : <FaPlus />}
                <span className="text-sm font-semibold hidden md:inline">{editingTodo ? 'Update' : 'Add Note'}</span>
            </button>
             )}
          </div>

      </form>
    </div>
  )
})

export default TodoForm
