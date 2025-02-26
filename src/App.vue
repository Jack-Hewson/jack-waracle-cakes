<script setup lang="ts">
import { ref, onMounted } from 'vue';
// import { API } from 'aws-amplify';
import { get, post } from 'aws-amplify/api';

const cakes = ref([]);  // Array of cakes
const newCakeName = ref('');  // New cake name
const newCakeComment = ref('');  // New cake comment

async function fetchCakes() {
  try {
    const restOperation = get({
      apiName: 'cakesApi',
      path: '/cakes',
    });
    const { body } = await restOperation.response;

    const response = await body.json();
    console.log('GET call succeeded: ', response);
    
    // Assuming the response is an array of cakes, update cakes properly
    cakes.value = [...response]; // This will spread the array into cakes.value

    console.log("Cakes", cakes.value); // Check the actual cakes array
  } catch (e) {
    console.log('GET call failed: ', JSON.parse(e.response.body));
  }
}

async function addCake() {
  try {
    const restOperation = post({
      apiName: 'cakesApi',
      path: '/cakes',
      options: {
        body: {
          name: newCakeName.value,
          comment: newCakeComment.value,
        },
      },
    });

    const { body } = await restOperation.response;
    const response = await body.json();

    console.log('POST call succeeded');
    console.log(response);

    // Reset input fields after adding the cake
    newCakeName.value = '';
    newCakeComment.value = '';

    fetchCakes();
  } catch (e) {
    console.log('POST call failed: ', e);
  }
}

onMounted(fetchCakes);
</script>

<template>
  <main>
    <h1>Cakes</h1>
    <div>
      <label for="cakeName">Cake Name:</label>
      <input v-model="newCakeName" id="cakeName" type="text" placeholder="Enter cake name" />

      <label for="cakeComment">Cake Comment:</label>
      <input v-model="newCakeComment" id="cakeComment" type="text" placeholder="Enter cake comment" />

      <button @click="addCake">Add Cake</button>
    </div>
    <ul>
      <li v-for="cake in cakes" :key="cake.name">
        {{ cake.name }} - {{ cake.comment }}
      </li>
    </ul>
  </main>
</template>
