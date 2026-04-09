import api from './api';

export const bookService = {
  // Récupérer tous les livres (pour la Home)
  getAll() {
    return api.get('/books');
  },
  // Récupérer un livre spécifique (pour TA page détails)
  getById(id: string) {
    return api.get(`/books/${id}`);
  },
  // Supprimer un livre (ta prochaine tâche)
  delete(id: string) {
    return api.delete(`/books/${id}`);
  }
};