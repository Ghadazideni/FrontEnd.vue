const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const books = [
  {
    id: "1",
    title: "L'Étranger",
    author: "Albert Camus",
    cover: "https://media.services.cinergy.ch/media/box1600/a85686e094e31e6ea39bd78f457058b51c8cc052.jpg",
    description: "Un homme indifférent face à l'absurdité de la vie.",
    price: 12.99,
    category: "Classique"
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    cover: "https://www.nextreadbooks.com/wp-content/uploads/2024/08/1984.jpg",
    description: "Big Brother vous surveille.",
    price: 15.50,
    category: "Dystopie"
  },
  {
    id: "3",
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    cover: "https://m.media-amazon.com/images/I/61NGp-UxolL._AC_UF1000,1000_QL80_.jpg",
    description: "L'essentiel est invisible pour les yeux.",
    price: 9.99,
    category: "Conte"
  }
];

// USERS ARRAY for AUTH (local storage for now)
let users = [
  {
    email: 'admin@test.com',
    password: '123',
    role: 'admin'
  }
];

// AUTH ROUTES
// Register: Create user with 'user' role
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  // Check if user exists
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Utilisateur déjà existant' });
  }

  // Create user
  const newUser = {
    email,
    password, // Plain for simplicity
    role: 'user'
  };
  users.push(newUser);

  res.status(201).json({ message: 'Inscription réussie', user: newUser });
});

// Login: Check credentials, return user
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  }

  // Return user without password
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

// ORDERS ARRAY (in-memory)
let orders = [];

// --- BOOKS ROUTES (unchanged) ---
app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const book = books.find(b => b.id === id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Livre introuvable" });
  }
});

app.post('/books', (req, res) => {
  const newBook = {
    id: Date.now().toString(), 
    ...req.body
  };
  books.push(newBook);
  console.log("Nouveau livre ajouté:", newBook.title);
  res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const index = books.findIndex(b => b.id === id);

  if (index !== -1) {
    books[index] = { ...books[index], ...req.body };
    console.log("Livre mis à jour:", books[index].title);
    res.json(books[index]);
  } else {
    res.status(404).json({ message: "Impossible de modifier : livre non trouvé" });
  }
});

app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const index = books.findIndex(b => b.id === id);
  
  if (index !== -1) {
    books.splice(index, 1);
    console.log(`Livre ID ${id} supprimé.`);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Livre non trouvé" });
  }
});

// ORDERS ROUTES
// Create order (user)
app.post('/orders', (req, res) => {
  const { userEmail, items, total, date } = req.body;
  
  if (!userEmail || !items || !total || !date) {
    return res.status(400).json({ message: 'Données de commande incomplètes' });
  }

  const order = {
    id: Date.now().toString(),
    userEmail,
    items,
    total,
    date
  };
  
  orders.push(order);
  console.log(`🛒 Nouvelle commande de ${userEmail} - Total: ${total}€`);
  res.status(201).json({ message: 'Commande enregistrée', order });
});

// Get all orders (admin only)
app.get('/admin/orders', (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== 'secret-admin-key') {
    return res.status(403).json({ message: 'Accès refusé - Admin requis' });
  }
  
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
  console.log(`👤 Admin credentials: admin@test.com / 123`);
});

