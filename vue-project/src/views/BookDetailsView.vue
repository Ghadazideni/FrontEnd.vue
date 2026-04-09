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
    console.error("Erreur API:", error);
  } finally {
    loading.value = false;
  }
});
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
</style>