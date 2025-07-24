import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Plus, Moon, Sun, Trash2, Edit3, Check, X } from 'lucide-react';
import './App.css';

// Define Task interface
interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

// Define filter types
type FilterType = 'all' | 'active' | 'completed';

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedTheme ? savedTheme === 'dark' : prefersDark);
  }, []);

  // Sync theme to document and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Memoized task operations
  const toggleTask = useCallback((id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const addTask = useCallback(() => {
    if (!newTask.trim()) return;
    const newTaskObj: Task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTaskObj, ...prev]);
    setNewTask('');
  }, [newTask]);

  const deleteTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const startEdit = useCallback((id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editText.trim() || editingId === null) return;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingId ? { ...task, text: editText.trim() } : task
      )
    );
    setEditingId(null);
    setEditText('');
  }, [editText, editingId]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditText('');
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }, []);

  // Memoized filtered tasks and stats
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === 'all' ? true :
        filter === 'active' ? !task.completed :
        task.completed;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchTerm, filter]);

  const taskStats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    active: tasks.filter((t) => !t.completed).length,
  }), [tasks]);

  return (
    <div className="todo-app">
      <div className="app-header">
        <div className="title-section">
          <h1>✨ My Tasks</h1>
          <p className="subtitle">Stay organized and productive</p>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode((prev) => !prev)}
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="stats-grid">
        {(['total', 'active', 'completed'] as const).map((stat) => (
          <div key={stat} className="stat-card">
            <span className="stat-number">{taskStats[stat]}</span>
            <span className="stat-label">{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
          </div>
        ))}
      </div>

      <div className="search-bar">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search tasks"
        />
      </div>

      <div className="add-task-form">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          aria-label="Add new task"
        />
        <button
          onClick={addTask}
          title="Add Task"
          disabled={!newTask.trim()}
          aria-label="Add task"
        >
          <Plus size={20} />
        </button>
      </div>

      {tasks.length > 0 && (
        <div className="filter-tabs">
          {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
            <button
              key={filterType}
              className={`filter-tab ${filter === filterType ? 'active' : ''}`}
              onClick={() => setFilter(filterType)}
              aria-label={`Show ${filterType} tasks`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              <span className="filter-count">
                {taskStats[filterType as keyof typeof taskStats]}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="task-list-container">
        {filteredTasks.length > 0 ? (
          <ul className="task-list" role="list">
            {filteredTasks.map(({ id, text, completed }) => (
              <li
                key={id}
                className={`task-item ${completed ? 'completed' : ''}`}
                role="listitem"
              >
                <div className="task-content">
                  <button
                    onClick={() => toggleTask(id)}
                    className={`checkbox ${completed ? 'checked' : ''}`}
                    aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {completed && <Check size={14} />}
                  </button>

                  {editingId === id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                        aria-label="Edit task"
                      />
                      <div className="edit-actions">
                        <button
                          onClick={saveEdit}
                          className="save-btn"
                          aria-label="Save edit"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="cancel-btn"
                          aria-label="Cancel edit"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span
                      className="task-text"
                      onDoubleClick={() => !completed && startEdit(id, text)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Edit task: ${text}`}
                    >
                      {text}
                    </span>
                  )}
                </div>

                {editingId !== id && (
                  <div className="task-actions">
                    {!completed && (
                      <button
                        onClick={() => startEdit(id, text)}
                        className="edit-btn"
                        title="Edit task"
                        aria-label="Edit task"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(id)}
                      className="delete-btn"
                      title="Delete task"
                      aria-label="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state" role="alert">
            <div className="empty-icon">📝</div>
            <p className="empty-title">
              {searchTerm
                ? 'No matching tasks'
                : filter === 'completed'
                ? 'No completed tasks'
                : filter === 'active'
                ? 'No active tasks'
                : 'No tasks yet'}
            </p>
            <p className="empty-subtitle">
              {searchTerm
                ? 'Try a different search term'
                : filter !== 'all'
                ? 'Switch to "All" to see other tasks'
                : 'Add your first task above to get started!'}
            </p>
          </div>
        )}
      </div>

      {taskStats.completed > 0 && (
        <div className="footer-actions">
          <button
            onClick={clearCompleted}
            className="clear-completed"
            aria-label={`Clear ${taskStats.completed} completed tasks`}
          >
            Clear completed ({taskStats.completed})
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoApp;