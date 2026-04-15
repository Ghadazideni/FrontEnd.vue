<template>
  <div>

    <section class="hero">
      <h1>Découvrez des livres pour tous les goûts</h1>
      <p>Des classiques intemporels aux derniers best-sellers, trouvez votre prochaine lecture ici.</p>
      <RouterLink to="/books" class="btn-primary" style="text-decoration: none; display: inline-block;">
        Explorer le catalogue
      </RouterLink>
    </section>

    <section class="books-section">
      <h2>Livres populaires</h2>
      <div class="books-grid">
        <div class="book-card" v-for="book in books" :key="book.id">
          <img :src="book.cover || 'https://via.placeholder.com/150x200?text=Pas+d+image'" :alt="book.title" />
          <h3>{{ book.title }}</h3>
          <p class="card-description">{{ book.description }}</p>
          
          <button @click="selectedBook = book" class="btn-primary">
            Voir plus
          </button>
        </div>
      </div>
    </section>

    <Transition name="expand">
      <div v-if="selectedBook" class="details-overlay" @click.self="selectedBook = null">
        <div class="expanded-card">
          <div class="expanded-image-section">
            <img :src="selectedBook.cover || 'https://via.placeholder.com/300x450?text=No+Cover'" />
          </div>

          <div class="expanded-content-section">
            <button class="close-btn" @click="selectedBook = null">✕</button>
            <span class="category-tag">{{ selectedBook.category || 'Collection Populaire' }}</span>
            <h2>{{ selectedBook.title }}</h2>
            <p class="expanded-author">écrit par {{ selectedBook.author }}</p>
            
            <div class="scroll-description">
              <p>{{ selectedBook.description }}</p>
            </div>

            <div class="expanded-footer">
              <span class="expanded-price">{{ selectedBook.price }} €</span>
              <div class="footer-btns">
                <button @click="handleDelete(selectedBook.id)" class="btn-delete-red">
                  Supprimer l'ouvrage
                </button>
                <button @click="selectedBook = null" class="btn-back-light">Retour</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <footer class="footer">
      <h3>Besoin d'aide ?</h3>
      <p>Contactez-nous pour toute question ou assistance.</p>
      <button class="btn-primary">Contactez-nous</button>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { bookService } from '@/services/bookService'

const books = ref([])
const selectedBook = ref(null) // État pour l'expansion in-place

onMounted(async () => {
  try {
    const response = await bookService.getAll()
    // On peut limiter à 4 livres pour la section "Populaire"
    books.value = response.data.slice(0, 4)
  } catch (error) {
    console.error("Erreur home page:", error)
  }
})

// Logique de suppression identique au catalogue pour rester cohérent
const handleDelete = async (id) => {
  if (confirm("Voulez-vous vraiment retirer ce livre ?")) {
    try {
      await bookService.delete(id)
      // Mise à jour locale
      books.value = books.value.filter(b => b.id !== id)
      // Fermeture de l'overlay
      selectedBook.value = null
    } catch (error) {
      console.error("Erreur de suppression:", error)
      alert("Erreur lors de la suppression.")
    }
  }
}
</script>

<style scoped>
/* HERO */
.hero {
  text-align: center;
  padding: 60px 20px;
  background: #f5f5f5;
}
.hero h1 { font-size: 28px; margin-bottom: 12px; }
.hero p { color: #666; margin-bottom: 20px; }

/* BOOKS SECTION */
.books-section { padding: 40px; background: #e8e8e8; }
.books-section h2 { text-align: center; margin-bottom: 30px; }
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
  display: flex;
  flex-direction: column;
}

.book-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 10px;
}

.book-card h3 { font-size: 15px; margin-bottom: 6px; }

.card-description {
  font-size: 13px;
  color: #555;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

/* FOOTER */
.footer {
  background: #1a1a2e;
  color: white;
  text-align: center;
  padding: 40px 20px;
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
  width: 100%;
}

/* --- STYLES DE L'EXPANSION (IDENTIQUES AU CATALOGUE) --- */
.details-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(8px);
}

.expanded-card {
  background: white;
  display: flex;
  width: 90%;
  max-width: 950px;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  text-align: left; /* Reset text-align from hero/footer */
}

.expanded-image-section {
  flex: 1;
  background: #0f172a;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.expanded-image-section img {
  max-width: 100%;
  max-height: 100%;
  box-shadow: 0 15px 35px rgba(0,0,0,0.6);
  border-radius: 4px;
}

.expanded-content-section {
  flex: 1.3;
  padding: 50px;
  display: flex;
  flex-direction: column;
  position: relative;
  color: #333;
}

.close-btn {
  position: absolute;
  top: 20px; right: 20px;
  background: none; border: none;
  font-size: 24px; cursor: pointer; color: #666;
}

.category-tag {
  color: #1565c0;
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

h2 { font-size: 32px; color: #1a237e; margin: 0; }
.expanded-author { font-size: 18px; color: #64748b; margin-top: 5px; }

.scroll-description {
  margin-top: 30px;
  max-height: 200px;
  overflow-y: auto;
  color: #334155;
  line-height: 1.7;
}

.expanded-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 25px;
}

.expanded-price { font-size: 28px; font-weight: bold; color: #1a237e; }

.btn-delete-red {
  background: #991b1b;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-back-light {
  background: transparent;
  border: 1px solid #ccc;
  padding: 12px 20px;
  margin-left: 10px;
  border-radius: 6px;
  cursor: pointer;
}

/* TRANSITION */
.expand-enter-active, .expand-leave-active { transition: all 0.4s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: scale(0.9); }
</style>