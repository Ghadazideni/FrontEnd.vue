<template>
  <div class="add-book-page">
    <div class="card">
      <h2>Ajouter un Livre au Catalogue</h2>
      <form @submit.prevent="submitForm">
        
        <div class="form-group">
          <label>Titre du livre</label>
          <input v-model="newBook.title" placeholder="Ex: L'Étranger" required />
        </div>

        <div class="form-group">
          <label>Auteur</label>
          <input v-model="newBook.author" placeholder="Ex: Albert Camus" required />
        </div>

        <div class="form-group">
          <label>URL de la Couverture</label>
          <input v-model="newBook.cover" placeholder="https://lien-vers-image.jpg" />
        </div>

        <div class="row">
          <div class="col form-group">
            <label>Prix (€)</label>
            <input v-model="newBook.price" type="number" />
          </div>
          <div class="col form-group">
            <label>Catégorie</label>
            <input v-model="newBook.category" placeholder="Classique" />
          </div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea v-model="newBook.description" rows="4" placeholder="Résumé du livre..."></textarea>
        </div>

        <button type="submit" class="btn-submit">Enregistrer dans le Catalogue</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { bookService } from '@/services/bookService'

const router = useRouter()
const isSubmitting = ref(false) // Prevents multiple clicks

const newBook = ref({
  title: '',
  author: '',
  cover: '', 
  description: '',
  price: 0,
  category: ''
})

const submitForm = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    // Calling your bookService.create(bookData)
    const response = await bookService.create(newBook.value)
    
    if (response.status === 201 || response.status === 200) {
      console.log("Success! Book added to the catalogue.")
      router.push('/books') // Redirect to see the updated list
    }
  } catch (err) {
    console.error("Erreur d'ajout au catalogue:", err)
    alert("Check if your backend (localhost:3000) is running!")
  } finally {
    isSubmitting.value = false
  }
}
</script>
<style scoped>
/* Conteneur principal avec un dégradé sombre */
.add-book-page {
  min-height: 100vh;
  background-color: #121212;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

.card {
  background: #1e1e1e;
  width: 100%;
  max-width: 600px;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
}

h2 {
  color: #ffffff;
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  color: #bbb;
  margin-bottom: 8px;
  font-size: 14px;
}

/* Style des inputs */
input, textarea {
  width: 100%;
  padding: 12px 16px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  color: white;
  font-size: 15px;
  transition: all 0.3s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #1565c0;
  background: #333;
  box-shadow: 0 0 8px rgba(21, 101, 192, 0.4);
}

.row {
  display: flex;
  gap: 20px;
}

.col {
  flex: 1;
}

/* Bouton Enregistrer */
.btn-submit {
  width: 100%;
  padding: 14px;
  margin-top: 20px;
  background: linear-gradient(to right, #1a237e, #1565c0);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.btn-submit:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-submit:active {
  transform: translateY(0);
}

/* Adaptation mobile */
@media (max-width: 480px) {
  .row { flex-direction: column; gap: 0; }
  .card { padding: 20px; }
}
</style>