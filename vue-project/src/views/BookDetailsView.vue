<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { bookService } from '../services/bookService';

const route = useRoute();
const router = useRouter();
const book = ref<any>(null);
const loading = ref(true);

onMounted(async () => {
  const id = route.params.id as string;
  try {
    const response = await bookService.getById(id);
    book.value = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération", error);
  } finally {
    loading.value = false; // Arrête le chargement quoi qu'il arrive
  }
});

const deleteBook = async () => {
  if (confirm("Voulez-vous vraiment supprimer ce livre ? Cette action est irréversible.")) {
    try {
      const id = route.params.id as string;
      await bookService.delete(id);
      alert("Livre supprimé avec succès !");
      router.push('/books'); // Redirection vers le catalogue
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      alert("Erreur : Impossible de supprimer le livre.");
    }
  }
};
</script>

<template>
  <div class="details-page">
    <nav class="navbar">
      <div class="navbar-brand">Bookstore - Détails</div>
      <button @click="router.push('/')" class="btn-back">Retour à l'accueil</button>
    </nav>

    <div v-if="loading" class="loader">Chargement du livre...</div>

    <div v-else-if="book" class="container">
      <div class="book-detail-card">
        <div class="image-section">
          <img :src="book.image || 'https://via.placeholder.com/300x450'" alt="Couverture" />
        </div>
        <div class="info-section">
          <div class="actions mt-4">
            <button @click="deleteBook" class="btn-delete">
              Supprimer le livre
            </button>
          </div>
          <h1>{{ book.title }}</h1>
          <p class="author">Par <span>{{ book.author }}</span></p>
          <hr />
          <p class="description">{{ book.description }}</p>
          <div class="meta">
            <span class="price">{{ book.price }} €</span>
            <span class="category">{{ book.category }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  background: linear-gradient(to right, #1a237e, #1565c0);
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  color: white;
}
.btn-back { background: rgba(255,255,255,0.2); border: 1px solid white; color: white; padding: 5px 15px; cursor: pointer; border-radius: 4px; }
.container { padding: 50px; display: flex; justify-content: center; }
.book-detail-card { display: flex; background: white; max-width: 900px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; }
.image-section img { width: 350px; height: auto; object-fit: cover; }
.info-section { padding: 40px; flex: 1; }
.author span { color: #1565c0; font-weight: bold; }
.description { line-height: 1.6; color: #555; margin: 20px 0; }
.price { font-size: 24px; font-weight: bold; color: #1a237e; }
.btn-delete {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-delete:hover { background-color: #b71c1c; }
.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.btn-delete {
  background-color: #ff5252;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.btn-delete:hover {
  background-color: #d32f2f;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.3);
}

/* Loader style */
.loader {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #1a237e;
}
</style>