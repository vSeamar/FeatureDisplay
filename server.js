const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// In-memory data store for API endpoints
let todos = [
  { id: 1, text: 'Learn about automated testing', completed: false, priority: 'high' },
  { id: 2, text: 'Build a demo application', completed: true, priority: 'medium' },
  { id: 3, text: 'Test agent navigation', completed: false, priority: 'low' },
];

let notes = [
  { id: 1, title: 'Meeting Notes', content: 'Discuss project timeline', category: 'work', created: '2024-01-15' },
  { id: 2, title: 'Shopping List', content: 'Milk, eggs, bread', category: 'personal', created: '2024-01-16' },
  { id: 3, title: 'Ideas', content: 'New feature concepts', category: 'work', created: '2024-01-17' },
];

let settings = {
  theme: 'light',
  notifications: true,
  language: 'en',
  fontSize: 'medium',
  autoSave: true,
};

// API Routes
// Todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const newTodo = {
    id: Date.now(),
    text: req.body.text,
    completed: false,
    priority: req.body.priority || 'medium',
  };
  todos.push(newTodo);
  res.json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (todo) {
    Object.assign(todo, req.body);
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.json({ success: true });
});

// Notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    category: req.body.category || 'general',
    created: new Date().toISOString().split('T')[0],
  };
  notes.push(newNote);
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  notes = notes.filter(n => n.id !== id);
  res.json({ success: true });
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json(settings);
});

app.put('/api/settings', (req, res) => {
  Object.assign(settings, req.body);
  res.json(settings);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Pages available:');
  console.log('  - http://localhost:' + PORT + '/ (Dashboard)');
  console.log('  - http://localhost:' + PORT + '/todos.html (Todo List)');
  console.log('  - http://localhost:' + PORT + '/notes.html (Notes)');
  console.log('  - http://localhost:' + PORT + '/data.html (Data Table)');
  console.log('  - http://localhost:' + PORT + '/forms.html (Forms Demo)');
  console.log('  - http://localhost:' + PORT + '/settings.html (Settings)');
});
