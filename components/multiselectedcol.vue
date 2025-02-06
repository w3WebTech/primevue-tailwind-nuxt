<template>
    <div class="card flex justify-center">
      <MultiSelect 
        v-model="selectedColumns" 
        :options="columns" 
        optionLabel="header" 
        filter 
        placeholder="Select Columns"
        display="chip" 
        class="w-full md:w-80"
        @change="onSelectionChange"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from "vue";
  import MultiSelect from 'primevue/multiselect';
  
  const props = defineProps({
    columns: {
      type: Array,
      required: true
    }
  });
  
  const emit = defineEmits(['columnSelected']);
  
  const selectedColumns = ref([]);
  
  const onSelectionChange = () => {
    // Emit the selected column names to the parent component
    emit('columnSelected', selectedColumns.value.map(col => col.header));
  };
  
  // Watch for changes in selectedColumns and emit the change
  watch(selectedColumns, (newVal) => {
    emit('columnSelected', newVal.map(col => col.header));
  });
  </script>
  
  <style scoped>
  /* Add any additional styles here */
  </style>