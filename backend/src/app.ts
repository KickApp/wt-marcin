import express, { Request, Response } from 'express';

// Create a new express application instance
const app: express.Application = express();
const port = 3000; // Port where the server will listen

// Use express.json() to parse incoming requests with JSON payloads
app.use(express.json());

// Mock data for demonstration
const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 2, name: 'Item 3' },
  // Add more items as needed
];

// GET /api/get_items - Return all items
app.get('/api/get_items', (req: Request, res: Response) => {
  res.send(items);
});

// GET /api/get_items/:id - Return a single item by id
app.get('/api/get_items/:id', (req: Request, res: Response) => {
  const itemId = parseInt(req.params.id);
  const item = items.find((item) => item.id === itemId);

  if (item) {
    res.send(item);
  } else {
    res.status(404).send('Item not found');
  }
});

// POST /api/add_item - Add a new item
app.post('/api/add_item', (req: Request, res: Response) => {
  const { name } = req.body;
  const newItem = { id: items.length + 1, name };
  items.push(newItem);
  res.status(201).send(newItem);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
