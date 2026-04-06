<template>
  <div class="card">
    <img :src="image" alt="book" />
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <button>Voir plus</button>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  image: String
});
</script>

<style scoped>
.card {
  width: 220px;
  background: white;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

button {
  margin-top: 10px;
  background: #2a5298;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
}
</style>