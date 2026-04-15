import api from './api';

export const bookService = {
  // Récupérer tous les livres
  getAll() {
    return api.get('/books');
  },

  // Ajouter un nouveau livre
  create(bookData: any) {
    return api.post('/books', bookData);
  },

  // Récupérer un livre spécifique
  getById(id: string) {
    return api.get(`/books/${id}`);
  },

  // Supprimer un livre
  delete(id: string) {
    return api.delete(`/books/${id}`);
  },

  // METTRE À JOUR : Cette méthode doit être à l'intérieur de l'objet bookService
  update(id: string, bookData: any) {
    return api.put(`/books/${id}`, bookData);
  }
};