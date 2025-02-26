<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { get, post } from 'aws-amplify/api';
import type { Cake } from './models/cake';
import Lightbox from './components/cakeLightbox.vue';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

const cakes = ref<Cake[]>([]);
const selectedCake = ref<Cake | null>(null);
const showLightbox = ref(false);

async function fetchCakes() {
  try {
    const restOperation = get({
      apiName: 'warCakeApi',
      path: '/cakes',
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    if (Array.isArray(response)) {
      cakes.value = response.map((cake: any) => ({
        ...cake,
        id: cake.id || uuidv4(),
      })) as Cake[];
    } else {
      console.log('Unexpected response structure:', response);
    }
  } catch (e) {
    console.log('GET call failed:', e);
  }
}


async function addCake(cakeData: { name: string, comment: string, yumFactor: number }) {
  try {
    const restOperation = post({
      apiName: 'warCakeApi',
      path: '/cakes',
      options: {
        body: {
          id: Date.now() + Math.floor(Math.random() * 1000),
          name: cakeData.name,
          comment: cakeData.comment,
          imageUrl: 'src/assets/images/cake-img.jpg',
          yumFactor: cakeData.yumFactor,
        },
      },
    });

    const { body } = await restOperation.response;
    const response = await body.json();

    if (response) {
      // Assuming the response includes the new cake with its 'id'
      console.log('Cake added:', response);
      fetchCakes(); // Refresh the list of cakes
      showLightbox.value = false;
    }
  } catch (e) {
    console.log('POST call failed:', e);
  }

  fetchCakes()
}


function selectCake(cake: Cake) {
  selectedCake.value = cake;
  showLightbox.value = true;
}

function closeLightbox() {
  showLightbox.value = false;
  selectedCake.value = null;
}

onMounted(fetchCakes);
</script>

<template>
  <main>
    <h1>Cakes</h1>

    <button @click="showLightbox = true">Add Cake</button>

    <ul>
      <li v-for="cake in cakes" :key="cake.id" @click="selectCake(cake)">
        <img :src="cake.imageUrl" :style="{ maxHeight: '2rem' }" />
        {{ cake.name }}
      </li>
    </ul>

    <Lightbox v-if="showLightbox" :cake="selectedCake" @submit-cake="addCake" @cancel="closeLightbox" />
  </main>
</template>
