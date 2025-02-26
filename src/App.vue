<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { get, post } from 'aws-amplify/api';

interface Cake {
  id: number;
  name: string;
  comment: string;
  imageUrl: string;
  yumFactor: number;
}

const cakes = ref<Cake[]>([]);

const newCakeName = ref('');
const newCakeComment = ref('');
const newCakeImageUrl = ref('');
const newCakeYumFactor = ref(1);

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

async function addCake() {
  // Validate inputs
  errorMessages.value = [];
  if (!newCakeName.value) errorMessages.value.push('Name is required');
  if (newCakeComment.value.length < 5 || newCakeComment.value.length > 200) {
    errorMessages.value.push('Comment must be between 5 and 200 characters');
  }
  // if (!newCakeImageUrl.value) errorMessages.value.push('Image URL is required');
  if (newCakeYumFactor.value < 1 || newCakeYumFactor.value > 5) errorMessages.value.push('Yum Factor must be between 1 and 5');

  // If there are validation errors, do not submit
  if (errorMessages.value.length > 0) return;

  try {
    const restOperation = post({
      apiName: 'cakesApi',
      path: '/cakes',
      options: {
        body: {
          name: newCakeName.value,
          comment: newCakeComment.value,
          imageUrl: 'src/assets/images/cake-img.jpg',
          yumFactor: newCakeYumFactor.value,
        },
      },
    });

    const { body } = await restOperation.response;
    const response = await body.json();
    console.log(response);

    newCakeName.value = '';
    newCakeComment.value = '';
    newCakeImageUrl.value = '';
    newCakeYumFactor.value = 1;

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

    <div v-if="showLightbox" class="lightbox">
      <div class="lightbox-content">
        <h2>Add a New Cake</h2>

        <label for="cakeName">Cake Name:</label>
        <input v-model="newCakeName" id="cakeName" type="text" placeholder="Enter cake name" />

        <label for="cakeComment">Cake Comment:</label>
        <input v-model="newCakeComment" id="cakeComment" type="text" placeholder="Enter cake comment" />

        <label for="yumFactor">Yum Factor:</label>
        <input v-model="newCakeYumFactor" id="yumFactor" type="number" min="1" max="5" />

        <button @click="addCake">Submit Cake</button>
        <button @click="showLightbox = false">Cancel</button>
      </div>
    </div>

    <button @click="showLightbox = true">Add Cake</button>

    <ul>
      <li v-for="cake in cakes" :key="cake.id">
        <img :src="cake.imageUrl" :style="{ maxHeight: '2rem' }" />
        {{ cake.name }}
      </li>
    </ul>
  </main>
</template>

<style scoped>
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.lightbox-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
}

button {
  margin-top: 10px;
}
</style>
