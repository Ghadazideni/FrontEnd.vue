import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'



const routes: Array<RouteRecordRaw> = [
  { 
    path: '/', 
    name: 'home',
    component: HomeView 
  },
  { 
    path: '/login', 
    name: 'login',
    // On importe le composant de Ghada quand il sera prêt
    component: () => import('../views/LoginView.vue') 
  },
  {
    path: '/register',
    name: 'register',
    // Vérifie bien que le nom du fichier est identique (majuscules/minuscules)
    component: () => import('../views/RegisterView.vue')
  },
  
{
  path: '/book/:id',
  name: 'book-details',
  component: () => import('../views/BookDetailsView.vue')
},

{
  path: '/books',
  name: 'books',
  component: () => import('../views/BooksView.vue')
},

  { 
    path: '/add-book', 
    name: 'add-book',
    component: () => import('../views/AddBookView.vue'),
    // Cette partie est cruciale pour TON rôle
    meta: { requiresAuth: false } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// LE GARDE (Navigation Guard) en version TypeScript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token; 

  // Vérifie si la route nécessite une authentification
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Pas de badge ? Retour à la case départ (Login)
      next({ name: 'login' });
    } else {
      // Badge présent ? On passe !
      next();
    }
  } else {
    // Route publique ? On passe direct !
    next();
  }
})

export default router