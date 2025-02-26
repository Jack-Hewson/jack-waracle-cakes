<script setup lang="ts">
import { onMounted } from 'vue';
import Lightbox from './components/cakeLightbox.vue';
import { fetchCakes, fetchCakeById, addCake, deleteCake, cakes, selectedCake, showLightbox } from './services/cakeService';
import type { Cake } from './models/cake';
import './App.css';


function selectCake(cake: Cake) {
  fetchCakeById(cake.id);
}

function closeLightbox() {
  showLightbox.value = false;
  selectedCake.value = null;
}

onMounted(fetchCakes);
</script>

<template>
  <main>
    <h1>Waracakes</h1>

    <button @click="showLightbox = true">Add cake</button>

    <ul>
      <li v-for="cake in cakes" :key="cake.id" @click="selectCake(cake)" class="cake-item">
        <img :src="cake.imageUrl" />
        <span>{{ cake.name }}</span>
        <button @click.stop="deleteCake(cake.id)" class="delete-btn">Delete</button>
      </li>
    </ul>

    <Lightbox v-if="showLightbox" :cake="selectedCake" @submit-cake="addCake" @cancel="closeLightbox" />
  </main>
</template>
