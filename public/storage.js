// localStorage data layer - replaces Express API for static hosting
const Storage = (() => {
  const KEYS = {
    todos: 'featureDisplay_todos',
    notes: 'featureDisplay_notes',
    settings: 'featureDisplay_settings',
  };

  const DEFAULT_TODOS = [
    { id: 1, text: 'Learn about automated testing', completed: false, priority: 'high' },
    { id: 2, text: 'Build a demo application', completed: true, priority: 'medium' },
    { id: 3, text: 'Test agent navigation', completed: false, priority: 'low' },
  ];

  const DEFAULT_NOTES = [
    { id: 1, title: 'Meeting Notes', content: 'Discuss project timeline', category: 'work', created: '2024-01-15' },
    { id: 2, title: 'Shopping List', content: 'Milk, eggs, bread', category: 'personal', created: '2024-01-16' },
    { id: 3, title: 'Ideas', content: 'New feature concepts', category: 'work', created: '2024-01-17' },
  ];

  const DEFAULT_SETTINGS = {
    theme: 'light',
    notifications: true,
    language: 'en',
    fontSize: 'medium',
    autoSave: true,
  };

  function _get(key, defaults) {
    try {
      const data = localStorage.getItem(key);
      if (data !== null) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
    // Seed defaults on first visit
    _set(key, defaults);
    return JSON.parse(JSON.stringify(defaults));
  }

  function _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error writing localStorage:', e);
    }
  }

  // Todos
  function getTodos() {
    return _get(KEYS.todos, DEFAULT_TODOS);
  }

  function addTodo({ text, priority }) {
    const todos = getTodos();
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      priority: priority || 'medium',
    };
    todos.push(newTodo);
    _set(KEYS.todos, todos);
    return newTodo;
  }

  function updateTodo(id, updates) {
    const todos = getTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) {
      Object.assign(todo, updates);
      _set(KEYS.todos, todos);
      return todo;
    }
    return null;
  }

  function deleteTodo(id) {
    const todos = getTodos().filter(t => t.id !== id);
    _set(KEYS.todos, todos);
  }

  // Notes
  function getNotes() {
    return _get(KEYS.notes, DEFAULT_NOTES);
  }

  function addNote({ title, content, category }) {
    const notes = getNotes();
    const newNote = {
      id: Date.now(),
      title,
      content: content || '',
      category: category || 'general',
      created: new Date().toISOString().split('T')[0],
    };
    notes.push(newNote);
    _set(KEYS.notes, notes);
    return newNote;
  }

  function deleteNote(id) {
    const notes = getNotes().filter(n => n.id !== id);
    _set(KEYS.notes, notes);
  }

  // Settings
  function getSettings() {
    return _get(KEYS.settings, DEFAULT_SETTINGS);
  }

  function updateSettings(updates) {
    const settings = getSettings();
    Object.assign(settings, updates);
    _set(KEYS.settings, settings);
    return settings;
  }

  return {
    getTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    getNotes,
    addNote,
    deleteNote,
    getSettings,
    updateSettings,
  };
})();
