<template>
  <div class="books-page">

    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="navbar-brand">Bookstore</div>
      <div class="navbar-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </div>
    </nav>

    <!-- HEADER + SEARCH -->
    <div class="books-header">
      <h1>Catalogue des livres</h1>
      <input
        v-model="search"
        type="text"
        placeholder="Rechercher un livre..."
        class="search-input"
      />
    </div>

    <!-- LISTE DES LIVRES -->
    <div class="books-container">
      <div class="book-card" v-for="book in filteredBooks" :key="book.id">
        <img :src="book.cover" :alt="book.title" />
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p class="author">{{ book.author }}</p>
          <p class="description">{{ book.description }}</p>
          <div class="book-actions">
            <RouterLink :to="'/books/' + book.id" class="btn-primary">Voir plus</RouterLink>
          </div>
        </div>
      </div>

      <!-- Aucun résultat -->
      <div v-if="filteredBooks.length === 0" class="no-results">
        <p>Aucun livre trouvé pour "{{ search }}"</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const search = ref('')

const books = ref([
  {
    id: 1,
    title: "L'étranger",
    author: "Albert Camus",
    description: "Un résumé captivant pour ce livre incontournable.",
    cover: "https://m.media-amazon.com/images/I/41MBjSMkqLL.jpg"
  },
  {
    id: 2,
    title: "Le procès",
    author: "Franz Kafka",
    description: "Découvrez pourquoi ce livre est un best-seller.",
    cover: "https://m.media-amazon.com/images/I/41uHfUkULXL.jpg"
  },
  {
    id: 3,
    title: "La formule de dieu",
    author: "J.R. Dos Santos",
    description: "Un récit qui restera gravé dans votre mémoire.",
    cover: "https://m.media-amazon.com/images/I/51k5jFCMnuL.jpg"
  },
  {
    id: 4,
    title: "Les misérables",
    author: "Victor Hugo",
    description: "Un chef-d'œuvre de la littérature française.",
    cover: "https://m.media-amazon.com/images/I/51gFkNKlmZL.jpg"
  }
])

const filteredBooks = computed(() => {
  if (!search.value) return books.value
  return books.value.filter(book =>
    book.title.toLowerCase().includes(search.value.toLowerCase()) ||
    book.author.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #1a237e, #1565c0);
  padding: 14px 40px;
  color: white;
}
.navbar-brand { font-size: 20px; font-weight: bold; }
.navbar-links a {
  color: white;
  text-decoration: none;
  margin-left: 20px;
  font-size: 14px;
}

.books-page {
  min-height: 100vh;
  background: #f0f0f0;
}

.books-header {
  padding: 30px 40px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.books-header h1 {
  color: #1a237e;
  font-size: 24px;
}

.search-input {
  padding: 10px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 280px;
  outline: none;
}

.search-input:focus {
  border-color: #1565c0;
}

.books-container {
  padding: 20px 40px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.book-card {
  background: white;
  border-radius: 8px;
  display: flex;
  gap: 20px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.book-card img {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 4px;
}

.book-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.book-info h3 {
  font-size: 18px;
  color: #1a237e;
  margin-bottom: 4px;
}

.author {
  color: #888;
  font-size: 14px;
  margin-bottom: 8px;
}

.description {
  color: #555;
  font-size: 14px;
  flex: 1;
}

.book-actions {
  margin-top: 12px;
}

.btn-primary {
  background: linear-gradient(to right, #1a237e, #1565c0);
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn-primary:hover { opacity: 0.9; }

.no-results {
  text-align: center;
  padding: 40px;
  color: #888;
}
</style>