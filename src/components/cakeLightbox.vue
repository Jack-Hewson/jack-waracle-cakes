<template>
  <div class="lightbox">
    <div class="lightbox-content">
      <h2>Add a New Cake</h2>

      <label for="cakeName">Cake Name:</label>
      <input v-model="newCakeName" id="cakeName" type="text" placeholder="Enter cake name"
        :class="{ error: errorMessages.name }" />
      <div v-if="errorMessages.name" class="error-message">{{ errorMessages.name }}</div>

      <label for="cakeComment">Cake Comment:</label>
      <input v-model="newCakeComment" id="cakeComment" type="text" placeholder="Enter cake comment"
        :class="{ error: errorMessages.comment }" />
      <div v-if="errorMessages.comment" class="error-message">{{ errorMessages.comment }}</div>

      <label for="yumFactor">Yum Factor:</label>
      <input v-model="newCakeYumFactor" id="yumFactor" type="number" min="1" max="5"
        :class="{ error: errorMessages.yumFactor }" />
      <div v-if="errorMessages.yumFactor" class="error-message">{{ errorMessages.yumFactor }}</div>


      <div class="button-container">
        <button @click="submitCake">Submit Cake</button>
        <button @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './cakeLightbox.css';
import { ref } from 'vue';

const newCakeName = ref('');
const newCakeComment = ref('');
const newCakeYumFactor = ref(1);

const errorMessages = ref<{ [key: string]: string }>({
  name: '',
  comment: '',
  yumFactor: '',
});

const emit = defineEmits<{
  (e: 'submit-cake', data: { name: string, comment: string, yumFactor: number }): void;
  (e: 'cancel'): void;
}>();

const submitCake = () => {
  errorMessages.value = { name: '', comment: '', yumFactor: '' };

  if (!newCakeName.value) errorMessages.value.name = 'Name is required';
  if (newCakeComment.value.length < 5 || newCakeComment.value.length > 200) {
    errorMessages.value.comment = 'Comment must be between 5 and 200 characters';
  }
  if (newCakeYumFactor.value < 1 || newCakeYumFactor.value > 5) {
    errorMessages.value.yumFactor = 'Yum Factor must be between 1 and 5';
  }

  if (Object.values(errorMessages.value).some((msg) => msg !== '')) return;

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
