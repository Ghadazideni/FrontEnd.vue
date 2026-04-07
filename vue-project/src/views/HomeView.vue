<template>
  <div>

    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="navbar-brand">Bookstore</div>
      <div class="navbar-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <h1>Découvrez des livres pour tous les goûts</h1>
      <p>Des classiques intemporels aux derniers best-sellers, trouvez votre prochaine lecture ici.</p>
      <button class="btn-primary" @click="router.push('/books')">Explorer le catalogue</button>
    </section>

    <!-- LIVRES POPULAIRES -->
    <section class="books-section">
      <h2>Livres populaires</h2>
      <div class="books-grid">
        <div class="book-card" v-for="book in books" :key="book.id">
          <img :src="book.cover" :alt="book.title" />
          <h3>{{ book.title }}</h3>
          <p>{{ book.description }}</p>
          <button class="btn-primary" @click="router.push('/books/' + book.id)">Voir plus</button>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <h3>Besoin d'aide ?</h3>
      <p>Contactez-nous pour toute question ou assistance.</p>
      <button class="btn-primary">Contactez-nous</button>
    </footer>

  </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const books = [
  {
    id: 1,
    title: "L'étranger",
    description: "Un résumé captivant pour ce livre incontournable.",
    cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Camus_letranger.jpg/220px-Camus_letranger.jpg"
  },
  {
    id: 2,
    title: "Le procès",
    description: "Découvrez pourquoi ce livre est un best-seller.",
    cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Kafka_-_Le_Proc%C3%A8s_%281933%29.jpg/220px-Kafka_-_Le_Proc%C3%A8s_%281933%29.jpg"
  },
  {
    id: 3,
    title: "La formule de dieu",
    description: "Un récit qui restera gravé dans votre mémoire.",
    cover: "https://covers.openlibrary.org/b/id/8739161-L.jpg"
  }
]
</script>

<style scoped>
/* NAVBAR */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #1a237e, #1565c0);
  padding: 14px 40px;
  color: white;
}
.navbar-brand {
  font-size: 20px;
  font-weight: bold;
}
.navbar-links a {
  color: white;
  text-decoration: none;
  margin-left: 20px;
  font-size: 14px;
}
.navbar-links a:hover {
  text-decoration: underline;
}

/* HERO */
.hero {
  text-align: center;
  padding: 60px 20px;
  background: #f5f5f5;
}
.hero h1 {
  font-size: 28px;
  margin-bottom: 12px;
}
.hero p {
  color: #666;
  margin-bottom: 20px;
}

/* BOOKS */
.books-section {
  padding: 40px;
  background: #e8e8e8;
}
.books-section h2 {
  text-align: center;
  margin-bottom: 30px;
}
.books-grid {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}
.book-card {
  background: white;
  padding: 16px;
  width: 220px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.book-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 10px;
}
.book-card h3 {
  font-size: 15px;
  margin-bottom: 6px;
}
.book-card p {
  font-size: 13px;
  color: #555;
  margin-bottom: 12px;
}

/* FOOTER */
.footer {
  background: #1a1a2e;
  color: white;
  text-align: center;
  padding: 40px 20px;
}
.footer p {
  margin: 10px 0 20px;
  font-size: 14px;
  color: #ccc;
}

/* BOUTON */
.btn-primary {
  background: linear-gradient(to right, #1a237e, #1565c0);
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 14px;
}
.btn-primary:hover {
  opacity: 0.9;
}
</style>