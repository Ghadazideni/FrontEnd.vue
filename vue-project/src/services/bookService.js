import axios from 'axios';

// Ensure this matches the port your NestJS app runs on (usually 3000)
const API_URL = 'http://localhost:3000/books'; 

export default {
  // Fetch all books for the catalog
  async getBooks() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching books from NestJS:", error);
      throw error;
    }
  },

  // Fetch a single book by its ID
  async getBookById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching book ${id}:`, error);
      throw error;
    }
  }
};