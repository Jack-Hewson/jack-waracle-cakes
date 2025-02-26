<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { get, post } from 'aws-amplify/api';
import Lightbox from './components/cakeLightbox.vue';
import './App.css';

interface Cake {
  id: number;
  name: string;
  comment: string;
  imageUrl: string;
  yumFactor: number;
}

const cakes = ref<Cake[]>([]);

const errorMessages = ref<string[]>([]);

const showLightbox = ref(false);

async function fetchCakes() {
  try {
    const restOperation = get({
      apiName: 'cakesApi',
      path: '/cakes',
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    if (Array.isArray(response)) {
      cakes.value = [...response as unknown as Cake[]];
    } else {
      console.log('Unexpected response structure:', response);
    }
  } catch (e) {
    console.log('GET call failed:', e);
  }
}

async function addCake(cakeData: { name: string, comment: string, yumFactor: number }) {
  errorMessages.value = [];
  if (!cakeData.name) errorMessages.value.push('Name is required');
  if (cakeData.comment.length < 5 || cakeData.comment.length > 200) {
    errorMessages.value.push('Comment must be between 5 and 200 characters');
  }
  if (cakeData.yumFactor < 1 || cakeData.yumFactor > 5) errorMessages.value.push('Yum Factor must be between 1 and 5');

  if (errorMessages.value.length > 0) return;

  try {
    const restOperation = post({
      apiName: 'cakesApi',
      path: '/cakes',
      options: {
        body: {
          name: cakeData.name,
          comment: cakeData.comment,
          imageUrl: 'src/assets/images/cake-img.jpg',
          yumFactor: cakeData.yumFactor,
        },
      },
    });

    const { body } = await restOperation.response;
    const response = await body.json();
    console.log(response);

    fetchCakes();
    showLightbox.value = false;
  } catch (e) {
    console.log('POST call failed:', e);
  }
}

onMounted(fetchCakes);
</script>

<template>
  <main>
    <h1>Cakes</h1>

    <div v-if="errorMessages.length > 0" class="error-messages">
      <ul>
        <li v-for="(message, index) in errorMessages" :key="index">{{ message }}</li>
      </ul>
    </div>

    <button @click="showLightbox = true">Add Cake</button>

    <ul>
      <li v-for="cake in cakes" :key="cake.id">
        <img :src="cake.imageUrl" :style="{ maxHeight: '2rem' }" />
        {{ cake.name }}
      </li>
    </ul>

    <Lightbox
      v-if="showLightbox"
      @submit-cake="addCake"
      @cancel="showLightbox = false"
    />
  </main>
</template>
