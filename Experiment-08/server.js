const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
let books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', year: 1988 },
  { id: 2, title: 'Wings of Fire', author: 'A. P. J. Abdul Kalam', year: 1999 }
];
let nextId = 3;
app.get('/api/books', (req, res) => res.json({ count: books.length, books }));
app.get('/api/books/:id', (req, res) => {
  const book = books.find(item => item.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});
app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body;
  if (typeof title !== 'string' || !title.trim() || typeof author !== 'string' || !author.trim() || !Number.isInteger(Number(year))) return res.status(400).json({ message: 'Title, author and valid year are required' });
  const book = { id: nextId++, title: title.trim(), author: author.trim(), year: Number(year) };
  books.push(book);
  res.status(201).json({ message: 'Book created', book });
});
app.put('/api/books/:id', (req, res) => {
  const book = books.find(item => item.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });
  const { title, author, year } = req.body;
  if (typeof title !== 'string' || !title.trim() || typeof author !== 'string' || !author.trim() || !Number.isInteger(Number(year))) return res.status(400).json({ message: 'Title, author and valid year are required' });
  Object.assign(book, { title: title.trim(), author: author.trim(), year: Number(year) });
  res.json({ message: 'Book updated', book });
});
app.delete('/api/books/:id', (req, res) => {
  const index = books.findIndex(item => item.id === Number(req.params.id));
  if (index < 0) return res.status(404).json({ message: 'Book not found' });
  const [deleted] = books.splice(index, 1);
  res.json({ message: 'Book deleted', book: deleted });
});
app.listen(PORT, () => console.log('Book API running at http://localhost:' + PORT));