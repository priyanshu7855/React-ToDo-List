import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaCheck, FaSort, FaFilter } from 'react-icons/fa';
import './ToDoList.css';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const [error, setError] = useState('');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError('');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError('Task cannot be empty');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleClearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOrder === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOrder === 'alphabetical') return a.text.localeCompare(b.text);
    return 0;
  });

  const remainingTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className="todo-container">
      <h1>My To-Do List</h1>
      
      <form onSubmit={handleAddTask} className="task-form">
        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Add a new task..."
            className={error ? 'error' : ''}
          />
          <button type="submit" className="add-button">
            <FaPlus />
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>

      <div className="controls">
        <div className="filter-controls">
          <div className="filter-group">
            <label><FaFilter /> Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="sort-group">
            <label><FaSort /> Sort:</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">Default</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={handleClearCompleted} 
          className="clear-button"
          disabled={!tasks.some(task => task.completed)}
        >
          Clear Completed
        </button>
      </div>

      <div className="task-list">
        {sortedTasks.length === 0 ? (
          <p className="empty-message">No tasks found. Add one above!</p>
        ) : (
          sortedTasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item ${task.completed ? 'completed' : ''}`}
            >
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                />
                <span className="task-text">{task.text}</span>
              </div>
              <button 
                onClick={() => handleDeleteTask(task.id)} 
                className="delete-button"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="stats">
        <p>{remainingTasks} {remainingTasks === 1 ? 'task' : 'tasks'} remaining</p>
        <p>Total tasks: {tasks.length}</p>
      </div>
    </div>
  );
};

export default ToDoList;