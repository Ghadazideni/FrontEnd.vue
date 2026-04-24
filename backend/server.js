const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// Seed default admin user on startup
async function seedAdmin() {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@test.com']);
    if (rows.length === 0) {
      await db.query(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        ['admin@test.com', '123', 'admin']
      );
      console.log('👤 Admin user seeded: admin@test.com / 123');
    }
  } catch (err) {
    console.error('Error seeding admin:', err.message);
  }
}

const isAdmin = (req, res, next) => {
  const role = req.headers['role'];

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé : admin uniquement' });
  }

  next();
};

// --- AUTH ROUTES ---

// Inscription : POST http://localhost:3000/auth/register
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body; 

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Utilisateur déjà existant' });
    }

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
      [name || null, email, password, 'user']
    );

    console.log(`👤 Nouvel utilisateur inscrit : ${email}`);
    res.status(201).json({
      message: 'Inscription réussie',
      user: { id: result.insertId, name: name || null, email, role: 'user' } 
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Connexion : POST http://localhost:3000/auth/login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    const user = rows[0];

    if (!user) {
      console.log(`❌ Tentative de connexion échouée pour : ${email}`);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const { password: _, ...safeUser } = user;
    console.log(`✅ Connexion réussie : ${email} (${user.role})`);
    res.json(safeUser);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- BOOKS ROUTES ---

app.get('/books', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books');
    res.json(rows);
  } catch (err) {
    console.error('Get books error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Livre introuvable" });
    }
  } catch (err) {
    console.error('Get book error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/books', isAdmin, async (req, res) => {
  const { title, author, cover, price, category, description, stock } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO books (title, author, cover, price, category, description, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, author, cover || null, price, category || null, description || null, stock || 0]
    );
    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [result.insertId]);
    console.log("📚 Nouveau livre ajouté:", title);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create book error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/books/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, author, cover, price, category, description, stock } = req.body;
  try {
    const [existing] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Impossible de modifier : livre non trouvé" });
    }

    await db.query(
      'UPDATE books SET title = ?, author = ?, cover = ?, price = ?, category = ?, description = ?, stock = ? WHERE id = ?',
      [
        title ?? existing[0].title,
        author ?? existing[0].author,
        cover ?? existing[0].cover,
        price ?? existing[0].price,
        category ?? existing[0].category,
        description ?? existing[0].description,
        stock ?? existing[0].stock,
        id
      ]
    );

    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    console.log("📝 Livre mis à jour:", rows[0].title);
    res.json(rows[0]);
  } catch (err) {
    console.error('Update book error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/books/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    console.log(`🗑️ Suppression du livre : ${existing[0].title}`);
    await db.query('DELETE FROM books WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Delete book error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- ORDERS ROUTES ---

app.post('/orders', async (req, res) => {
  const { userEmail, items, total, date, deliveryAddress } = req.body;

  if (!userEmail || !items || !total || !date) {
    return res.status(400).json({ message: 'Données de commande incomplètes' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [users] = await connection.query('SELECT id FROM users WHERE email = ?', [userEmail]);
    if (users.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }
    const userId = users[0].id;

    for (const item of items) {
      const [books] = await connection.query('SELECT stock FROM books WHERE id = ?', [item.bookId]);
      if (books.length === 0) {
        await connection.rollback();
        return res.status(400).json({ message: `Livre introuvable: ${item.bookId}` });
      }
      if (books[0].stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ message: `Stock insuffisant pour: ${item.title}` });
      }
      await connection.query('UPDATE books SET stock = stock - ? WHERE id = ?', [item.quantity, item.bookId]);
    }

const [result] = await connection.query(
  'INSERT INTO orders (user_id, items_json, total_price, date, delivery_address) VALUES (?, ?, ?, ?, ?)',
  [userId, JSON.stringify(items), total, new Date(date), deliveryAddress ? JSON.stringify(deliveryAddress) : null]
);

    await connection.commit();

    console.log(`🛒 Commande enregistrée pour ${userEmail} - Total: ${total}€`);
    res.status(201).json({ message: 'Achat réussi !', order: { id: result.insertId, userEmail, items, total, date, deliveryAddress } });
  } catch (err) {
    await connection.rollback();
    console.error('Order error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  } finally {
    connection.release();
  }
});

app.get('/admin/orders', isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT o.id, u.email as userEmail, o.items_json, o.total_price, o.date, o.delivery_address
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.date DESC`
    );
const orders = rows.map(row => ({
  id: row.id,
  userEmail: row.userEmail,
  items: JSON.parse(row.items_json),
  total: row.total_price,
  date: row.date,
  deliveryAddress: row.delivery_address 
    ? JSON.parse(row.delivery_address) 
    : null
}));
    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- DÉMARRAGE DU SERVEUR ---
app.listen(PORT, async () => {
  console.log('-------------------------------------------');
  console.log(`Backend actif sur le port ${PORT}`);
  console.log(`URL de base : http://localhost:${PORT}`);
  await seedAdmin();
  console.log('-------------------------------------------');
});