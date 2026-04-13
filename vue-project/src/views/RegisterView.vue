<template>
  <div class="register-page">



    <div class="login-container">
      <div class="login-box">
        <h2>Inscription</h2>
        <p class="subtitle">Créez votre compte gratuitement</p>

        <div class="form-group">
          <label>Nom complet</label>
          <input v-model="name" type="text" placeholder="Votre nom" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="votre@email.com" />
        </div>

        <div class="form-group">
          <label>Mot de passe</label>
          <input v-model="password" type="password" placeholder="••••••••" />
        </div>

        <button class="btn-primary" @click="handleRegister">S'inscrire</button>

        <p class="register-link">
          Déjà un compte ?
          <RouterLink to="/login">Se connecter</RouterLink>
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')

const handleRegister = () => {
  console.log('Register:', name.value, email.value)
  // On branchera l'API plus tard
}
</script>

<style scoped>
/* Même style que LoginView */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #1a237e, #1565c0);
  padding: 14px 40px;
  color: white;
}
.navbar-brand { font-size: 20px; font-weight: bold; }
.navbar-links a {
  color: white;
  text-decoration: none;
  margin-left: 20px;
  font-size: 14px;
}
.register-page { min-height: 100vh; background: #f0f0f0; }
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
}
.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.login-box h2 { text-align: center; margin-bottom: 6px; color: #1a237e; }
.subtitle { text-align: center; color: #888; font-size: 14px; margin-bottom: 24px; }
.form-group { margin-bottom: 18px; }
.form-group label { display: block; font-size: 14px; margin-bottom: 6px; color: #333; }
.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
.form-group input:focus { border-color: #1565c0; outline: none; }
.btn-primary {
  width: 100%;
  background: linear-gradient(to right, #1a237e, #1565c0);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
}
.btn-primary:hover { opacity: 0.9; }
.register-link { text-align: center; margin-top: 16px; font-size: 14px; color: #666; }
.register-link a { color: #1565c0; text-decoration: none; font-weight: bold; }
</style>