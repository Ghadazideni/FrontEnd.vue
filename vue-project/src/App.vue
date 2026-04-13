<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-brand">Bookstore</div>
      <div class="navbar-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </div>
    </nav>

    <RouterView />
  </div>
</template>

<style>
/* Style global de la Navbar (celui de Ghada) */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #1a237e, #1565c0);
  padding: 14px 40px;
  color: white;
}
.navbar-links a {
  color: white;
  text-decoration: none;
  margin-left: 20px;
}
body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
</style>