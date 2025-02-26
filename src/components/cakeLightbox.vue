<script setup lang="ts">
import type { Cake } from '@/models/cake';
import './cakeLightbox.css';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  cake: Cake | null;
}>();

const newCakeName = ref('');
const newCakeComment = ref('');
const newCakeYumFactor = ref(1);
const isEditing = computed(() => !!props.cake);


const errorMessages = ref<{ [key: string]: string }>({
  name: '',
  comment: '',
  yumFactor: '',
});

const emit = defineEmits<{
  (e: 'submit-cake', data: { name: string, comment: string, yumFactor: number }): void;
  (e: 'cancel'): void;
}>();

onMounted(() => {
  if (props.cake) {
    newCakeName.value = props.cake.name || '';
    newCakeComment.value = props.cake.comment || '';
    newCakeYumFactor.value = props.cake.yumFactor || 1;
  }
});

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

<template>
  <div class="lightbox">
    <div class="lightbox-content">
      <h2>Add a new cake</h2>
      <label for="name">Cake name:</label>
      <input v-model="newCakeName" id="name" type="text" placeholder="Enter cake name"
        :class="{ error: errorMessages.name }" :readonly="isEditing" />
      <div v-if="errorMessages.name" class="error-message">{{ errorMessages.name }}</div>


      <label for="cakeComment">Cake comment:</label>
      <input v-model="newCakeComment" id="cakeComment" type="text" placeholder="Enter cake comment"
        :class="{ error: errorMessages.comment }" :readonly="isEditing" />
      <div v-if="errorMessages.comment" class="error-message">{{ errorMessages.comment }}</div>


      <label for="yumFactor">Yum factor:</label>
      <input v-model="newCakeYumFactor" id="yumFactor" type="number" min="1" max="5"
        :class="{ error: errorMessages.yumFactor }" :readonly="isEditing" />
      <div v-if="errorMessages.yumFactor" class="error-message">{{ errorMessages.yumFactor }}</div>


      <div class="button-container">
        <button @click="cancel">Cancel</button>
        <button v-if="!isEditing" @click="submitCake">Submit cake</button>
      </div>
    </div>
  </div>
</template>