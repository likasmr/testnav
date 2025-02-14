<template>
  <header class="nav-header">
    <h1>{{ config.title }}</h1>
    <p>{{ config.description }}</p>
    <div class="search-box">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="搜索站点..."
        @input="$emit('search', searchQuery)"
      >
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { siteConfig } from '../config/config'

const config = siteConfig
const searchQuery = ref('')
</script>

<style scoped>
.nav-header {
  text-align: center;
  padding: 2rem 0;
}

h1 {
  font-size: 2.5rem;
  color: v-bind('config.theme.primary');
  margin-bottom: 1rem;
}

.search-box {
  margin: 1rem auto;
  max-width: 500px;
}

input {
  width: 100%;
  padding: 0.8rem 1.5rem;
  border: 2px solid v-bind('config.theme.primary');
  border-radius: 25px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
}
</style> 