<template>
  <div class="app-container">
    <nav-header />
    <nav-grid />
  </div>
</template>

<script setup>
import NavHeader from './components/NavHeader.vue'
import NavGrid from './components/NavGrid.vue'
</script>

<style>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%);
  padding: 20px;
}
</style> 