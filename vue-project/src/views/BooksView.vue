<template>
  <div class="books-page">
    <div class="books-header">
      <h1>Catalogue des livres</h1>
      <div class="header-actions">
        <input v-model="search" type="text" placeholder="Rechercher un livre..." class="search-input" />
        <RouterLink to="/add-book" class="btn-add">+ Ajouter un livre</RouterLink>
      </div>
    </div>

    <div class="books-container">
      <div class="book-card" v-for="book in filteredBooks" :key="book.id">
        <img :src="book.cover || 'https://via.placeholder.com/150x200?text=Pas+d+image'" :alt="book.title" class="book-image" />
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p class="author">{{ book.author }}</p>
          <p class="description">{{ book.description }}</p>
          <div class="book-actions">
            <button @click="openDetails(book)" class="btn-primary">Voir plus</button>
          </div>
        </div>
      </div>
      <div v-if="filteredBooks.length === 0" class="no-results">
        <p>Aucun livre trouvé pour "{{ search }}"</p>
      </div>
    </div>

    <Transition name="expand">
      <div v-if="selectedBook" class="details-overlay" @click.self="closeDetails">
        <div class="expanded-card">
          <div class="expanded-image-section">
            <img :src="selectedBook.cover || 'https://via.placeholder.com/300x450'" />
          </div>

          <div class="expanded-content-section">
            <button class="close-btn" @click="closeDetails">✕</button>
            
            <div v-if="!isEditing" class="view-mode">
              <span class="category-tag">{{ selectedBook.category || 'Collection' }}</span>
              <h2>{{ selectedBook.title }}</h2>
              <p class="expanded-author">écrit par {{ selectedBook.author }}</p>
              <div class="scroll-description">
                <p>{{ selectedBook.description }}</p>
              </div>
            </div>

            <div v-else class="edit-mode">
              <h3>Modifier l'ouvrage</h3>
              <input v-model="editForm.title" class="edit-input title-edit" placeholder="Titre" />
              <input v-model="editForm.author" class="edit-input" placeholder="Auteur" />
              <input v-model="editForm.category" class="edit-input" placeholder="Catégorie" />
              <input v-model="editForm.cover" class="edit-input" placeholder="Ex: https://image.com/photo.jpg" />
              <textarea v-model="editForm.description" class="edit-textarea" rows="5" placeholder="Description"></textarea>
              <input v-model="editForm.price" type="number" class="edit-input" placeholder="Prix" />
            </div>

            <div class="expanded-footer">
              <span v-if="!isEditing" class="expanded-price">{{ selectedBook.price }} €</span>
              
              <div class="footer-btns">
                <template v-if="!isEditing">
                  <button @click="isEditing = true" class="btn-modify">Modifier</button>
                  <button @click="handleDelete(selectedBook.id)" class="btn-delete-red">Supprimer</button>
                </template>
                
                <template v-else>
                  <button @click="handleUpdate" class="btn-save">Enregistrer</button>
                  <button @click="isEditing = false" class="btn-back-light">Annuler</button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { bookService } from '@/services/bookService'

const search = ref('')
const books = ref([])
const selectedBook = ref(null)
const isEditing = ref(false)
const editForm = ref({})

onMounted(async () => {
  try {
    const response = await bookService.getAll()
    books.value = response.data
  } catch (error) {
    console.error("Erreur chargement:", error)
  }
})

const filteredBooks = computed(() => {
  if (!search.value) return books.value
  return books.value.filter(book =>
    book.title.toLowerCase().includes(search.value.toLowerCase()) ||
    book.author.toLowerCase().includes(search.value.toLowerCase())
  )
})

const openDetails = (book) => {
  selectedBook.value = book
  editForm.value = { ...book } // Clone data for editing
  isEditing.value = false
}

const closeDetails = () => {
  selectedBook.value = null
  isEditing.value = false
}

const handleUpdate = async () => {
  try {
    const response = await bookService.update(selectedBook.value.id, editForm.value)
    // Update the book in the local list
    const index = books.value.findIndex(b => b.id === selectedBook.value.id)
    books.value[index] = response.data
    // Update the display
    selectedBook.value = response.data
    isEditing.value = false
  } catch (error) {
    alert("Erreur lors de la mise à jour")
  }
}

const handleDelete = async (id) => {
  if (confirm("Supprimer ce livre ?")) {
    try {
      await bookService.delete(id)
      books.value = books.value.filter(b => b.id !== id)
      closeDetails()
    } catch (error) {
      alert("Erreur suppression")
    }
  }
}
</script>

<style scoped>
/* --- VOS STYLES EXISTANTS --- */
.books-page { min-height: 100vh; background: #f0f0f0; }
.books-header { padding: 30px 40px; display: flex; justify-content: space-between; align-items: center; }
.search-input { padding: 10px; border-radius: 4px; border: 1px solid #ccc; width: 280px; }
.books-container { padding: 0 40px 40px; display: flex; flex-direction: column; gap: 20px; }
.book-card { background: white; padding: 16px; border-radius: 8px; display: flex; gap: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.book-card img { width: 100px; height: 140px; object-fit: cover; }
.btn-primary { background: #1a237e; color: white; border: none; padding: 8px 18px; border-radius: 4px; cursor: pointer; }

/* --- OVERLAY & CARD --- */
.details-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 2000; backdrop-filter: blur(8px); }
.expanded-card { background: white; display: flex; width: 90%; max-width: 950px; height: 600px; border-radius: 12px; overflow: hidden; }
.expanded-image-section { flex: 1; background: #0f172a; display: flex; justify-content: center; align-items: center; padding: 40px; }
.expanded-image-section img { max-width: 100%; max-height: 100%; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.expanded-content-section { flex: 1.3; padding: 40px; display: flex; flex-direction: column; position: relative; }

/* --- EDIT MODE STYLES --- */
.edit-mode h3 { color: #1a237e; margin-bottom: 15px; }
.edit-input, .edit-textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}
.title-edit { font-size: 20px; font-weight: bold; border-left: 4px solid #1a237e; }

/* --- BUTTONS --- */
.footer-btns { display: flex; gap: 10px; }
.btn-modify { background: #1565c0; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
.btn-save { background: #2e7d32; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
.btn-delete-red { background: #991b1b; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
.btn-back-light { border: 1px solid #ccc; background: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
.btn-add {
  background-color: transparent; 
  color: #2e7d32; /* Texte vert */
  border: 2px solid #2e7d32; 
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-add:hover {
  background-color: #2e7d32;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(46, 125, 50, 0.2);
}

.close-btn { position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; }
.scroll-description { margin-top: 20px; max-height: 180px; overflow-y: auto; line-height: 1.6; color: #444; }
.expand-enter-active, .expand-leave-active { transition: all 0.4s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: scale(0.95); }
</style>