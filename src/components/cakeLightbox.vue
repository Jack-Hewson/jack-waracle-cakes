<template>
    <div class="lightbox">
      <div class="lightbox-content">
        <h2>Add a New Cake</h2>
  
        <label for="cakeName">Cake Name:</label>
        <input v-model="newCakeName" id="cakeName" type="text" placeholder="Enter cake name" />
  
        <label for="cakeComment">Cake Comment:</label>
        <input v-model="newCakeComment" id="cakeComment" type="text" placeholder="Enter cake comment" />
  
        <label for="yumFactor">Yum Factor:</label>
        <input v-model="newCakeYumFactor" id="yumFactor" type="number" min="1" max="5" />
  
        <button @click="submitCake">Submit Cake</button>
        <button @click="cancel">Cancel</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const newCakeName = ref('');
  const newCakeComment = ref('');
  const newCakeYumFactor = ref(1);
  
  const emit = defineEmits<{
    (e: 'submit-cake', data: { name: string, comment: string, yumFactor: number }): void;
    (e: 'cancel'): void;
  }>();
  
  const submitCake = () => {
    emit('submit-cake', {
      name: newCakeName.value,
      comment: newCakeComment.value,
      yumFactor: newCakeYumFactor.value,
    });
    clearForm();
  };
  
  const cancel = () => {
    emit('cancel');
    clearForm();
  };
  
  const clearForm = () => {
    newCakeName.value = '';
    newCakeComment.value = '';
    newCakeYumFactor.value = 1;
  };
  </script>
  
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
  