<template>
  <div class="card flex justify-center" style="display:flex">
    <Select v-model="selectedColumn" :options="columns" optionLabel="header" placeholder="Sort" class="w-full md:w-56" @change="onColumnChange">
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex items-center" style="display: flex;">
          <div>{{ slotProps.value.header }}</div>
        </div>
        <span v-else>
          {{ slotProps.placeholder }}
        </span>
      </template>
      <template #option="slotProps">
        <div class="flex items-center" style="display: flex;">
          <div>{{ slotProps.option.header }}</div>
        </div>
      </template>
    </Select>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import Select from 'primevue/select';
import 'primeicons/primeicons.css';

const emit = defineEmits(['columnSelected']);
const selectedColumn = ref(null);
const columns = ref([
  { field: 'code', header: 'Code' },
  { field: 'name', header: 'Name' },
  { field: 'price', header: 'Price' },
  { field: 'category', header: 'Category' },
  { field: 'quantity', header: 'Quantity' },
]);

const onColumnChange = () => {
  emit('columnSelected', selectedColumn.value); // Emit the selected column
};
</script>

<style scoped>
.card {
  width: 100%;
}
</style>