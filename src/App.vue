<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Lightbox from './components/cakeLightbox/cakeLightbox.vue';
import { fetchCakes, fetchCakeById, addCake, deleteCake, cakes, selectedCake, showLightbox } from './services/cakeService';
import type { Cake } from './models/cake';
import './App.css';

const loading = ref(true);
const loadingError = ref(false);

async function loadCakes() {
  try {
    await fetchCakes();
  } catch {
    loadingError.value = true;
  } finally {
    loading.value = false;
  }
}

function selectCake(cake: Cake) {
  fetchCakeById(cake.id);
}

function closeLightbox() {
  showLightbox.value = false;
  selectedCake.value = null;
}

onMounted(loadCakes);
</script>

<template>
  <main>
    <h1>Waracakes</h1>

    <button @click="showLightbox = true">Add cake</button>

    <div v-if="loading" class="spinner"></div>

    <p v-if="loadingError" class="loading-message">Error loading data</p>

    <ul v-else-if="!loadingError">
      <li v-for="cake in cakes" :key="cake.id" @click="selectCake(cake)" class="cake-item">
        <img :src="cake.imageUrl" />
        <span>{{ cake.name }}</span>
        <button @click.stop="deleteCake(cake.id)" class="delete-btn">Delete</button>
      </li>
    </ul>

    <Lightbox v-if="showLightbox" :cake="selectedCake" @submit-cake="addCake" @cancel="closeLightbox" />
  </main>
</template>
