<template>
  <div class="books-page">



    <!-- HEADER + SEARCH -->
     <div class="books-header">
      <h1>Catalogue des livres</h1>
      <div class="header-actions">
        <input
        v-model="search"
        type="text"
        placeholder="Rechercher un livre..."
        class="search-input"
        />
        <RouterLink to="/add-book" class="btn-add">
          + Ajouter un livre
        </RouterLink>
      </div>
    </div>


    <!-- LISTE DES LIVRES -->
    <div class="books-container">
      <div class="book-card" v-for="book in filteredBooks" :key="book.id">
        <img 
        :src="book.cover || 'https://via.placeholder.com/150x200?text=Pas+d+image'" 
        :alt="book.title" 
        class="book-image"/>
      
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
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { bookService } from '@/services/bookService' // On utilise ton service

const search = ref('')
const books = ref([]) // On commence vide

onMounted(async () => {
  try {
    const response = await bookService.getAll()
    books.value = response.data // On remplit avec les vrais livres du backend
  } catch (error) {
    console.error("Erreur lors du chargement du catalogue:", error)
  }
})

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

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.btn-add {
  background-color: #2e7d32; /* Un beau vert "Ajout" */
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
  transition: 0.3s;
}

.btn-add:hover {
  background-color: #1b5e20;
  transform: translateY(-2px);
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