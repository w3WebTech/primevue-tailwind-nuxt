<template>
  <div style=" margin: 20px;">
    <div style="display: flex; align-items: center; margin-bottom: 20px;">
      <Button icon="pi pi-arrow-left" @click="goBack" severity="secondary" style=" margin-right: 10px;"/>
      <h1 style="">Product Details</h1>
    </div>
    <p><strong>Product ID:</strong> {{ productId }}</p>
    <div class="card">
        <Tabs value="/dashboard">
            <TabList>
                <Tab v-for="tab in items" :key="tab.label" :value="tab.route">
                    <router-link v-if="tab.route"  custom>
                        <div class="custom-flex">
                            <i :class="tab.icon" />
                            <span>{{ tab.label }}</span>
                        </div>
                    </router-link>
                </Tab>
            </TabList>
        </Tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

import { defineEmits } from 'vue';

const props = defineProps(['productId']); // Receive productId as a prop
const emit = defineEmits(); // Define emits for the component


const items = ref([
    { route: '/dashboard', label: 'Dashboard', icon: 'pi pi-home' },
    { route: '/transactions', label: 'Transactions', icon: 'pi pi-chart-line' },
    { route: '/products', label: 'Products', icon: 'pi pi-list' },
    { route: '/messages', label: 'Messages', icon: 'pi pi-inbox' }
]);
const goBack = () => {
  emit('back'); // Emit a 'back' event to the parent component
};
</script>

<style scoped>
.custom-flex {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 8px */
  color: inherit;
}
</style>