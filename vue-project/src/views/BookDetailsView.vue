<template>
  <div class="details-page">
    <div v-if="loading" class="loader">
      <div class="spinner"></div>
      <p>Consultation des archives...</p>
    </div>

    <div v-else-if="book" class="details-card">
      <div class="image-section">
        <img 
          :src="book.cover || 'https://via.placeholder.com/400x600?text=No+Cover'" 
          class="large-book-icon"
        />
      </div>

      <div class="content-section">
        <div class="header">
          <span class="category-badge">{{ book.category || 'Collection Privée' }}</span>
          <h1>{{ book.title }}</h1>
          <p class="author">Par <strong>{{ book.author }}</strong></p>
        </div>

        <div class="description-box">
          <h3>Description</h3>
          <p>{{ book.description || 'Aucune description disponible pour cet ouvrage.' }}</p>
        </div>

        <div class="price-action-row">
          <span class="price">{{ book.price }} €</span>
          <div class="button-group">
            <button @click="handleDelete" class="btn-delete-gold">Supprimer</button>
            <button @click="$router.push('/books')" class="btn-back">Retour</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-view">
      <h2>Ouvrage Introuvable</h2>
      <p>Le livre a été retiré ou n'existe pas.</p>
      <button @click="$router.push('/books')" class="btn-back">Retour au catalogue</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bookService } from '@/services/bookService'

const route = useRoute()
const router = useRouter()
const book = ref(null)
const loading = ref(true)

onMounted(async () => {
  // DEBUG: Check what ID we are getting from the URL
  console.log("Recherche de l'ID:", route.params.id)
  
  try {
    const response = await bookService.getById(route.params.id)
    console.log("Données reçues du backend:", response.data)
    book.value = response.data
  } catch (error) {
    console.error("Erreur de connexion au backend:", error)
  } finally {
    loading.value = false
  }
})

const handleDelete = async () => {
  if (confirm(`Voulez-vous définitivement supprimer "${book.value.title}" ?`)) {
    try {
      await bookService.delete(book.value.id)
      router.push('/books')
    } catch (error) {
      console.error("Échec de la suppression:", error)
      alert("Erreur lors de la suppression.")
    }
  }
}
</script>

<style scoped>
.details-page {
  min-height: 100vh;
  background-color: #0f172a; /* Darker Blue Aesthetic */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-family: 'Inter', sans-serif;
}

.details-card {
  display: flex;
  background: #ffffff;
  width: 100%;
  max-width: 1100px;
  min-height: 600px;
  border-radius: 4px; /* Sharper, professional edges */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.image-section {
  flex: 1;
  background: #1e293b;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  border-right: 1px solid #334155;
}

.large-book-icon {
  width: 100%;
  max-width: 380px;
  height: auto;
  box-shadow: 20px 20px 60px rgba(0,0,0,0.4);
  border-radius: 2px;
}

.content-section {
  flex: 1.2;
  padding: 60px;
  display: flex;
  flex-direction: column;
}

h1 { color: #1a237e; font-size: 42px; margin-bottom: 5px; font-weight: 800; }
.author { color: #64748b; font-size: 20px; margin-bottom: 30px; }

.category-badge {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
  font-weight: 700;
  color: #1565c0;
  margin-bottom: 10px;
  display: block;
}

.description-box h3 { font-size: 16px; text-transform: uppercase; color: #1e293b; margin-bottom: 15px; }
.description-box p { color: #334155; line-height: 1.8; font-size: 16px; margin-bottom: 40px; }

.price-action-row {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e2e8f0;
  padding-top: 30px;
}

.price { font-size: 28px; font-weight: 700; color: #1a237e; }

.btn-delete-gold {
  background: #991b1b;
  color: white;
  border: none;
  padding: 12px 25px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.btn-delete-gold:hover { background: #7f1d1d; }

.btn-back {
  background: transparent;
  border: 1px solid #1a237e;
  color: #1a237e;
  padding: 12px 25px;
  margin-left: 10px;
  cursor: pointer;
}

@media (max-width: 900px) {
  .details-card { flex-direction: column; }
  .image-section { padding: 30px; }
}
</style>