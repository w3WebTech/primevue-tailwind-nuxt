<template>
  <div>
    <Splitter style="height: 100vh;">
      <SplitterPanel class="flex items-center justify-center hide-on-small" :size="15" style="background-color: #F8F8F8; overflow: hidden;">
        <menubarcontent @menu-select="updateContent" />
      </SplitterPanel>
      <SplitterPanel class="flex items-center justify-center" :size="85">
        <NavContent />
        <div v-if="content === 'dataload'" class="centered-container">
          <newtable @product-selected="showProductDetail" />
        </div>
        <div v-else>
          <product-detail :productId="selectedProductId" v-if="content === 'productDetail'" @back="goBack" />
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import newtable from './components/newtable.vue'; // Import your newtable component
import ProductDetail from './components/ProductDetail.vue'; // Import your product detail component

const content = ref('dataload');
const selectedProductId = ref(null); // To store the selected product ID

const updateContent = (message) => {
  content.value = message;
};

const showProductDetail = (productId) => {
  selectedProductId.value = productId; // Set the selected product ID
  content.value = 'productDetail'; // Change content to show product detail
};

const goBack = () => {
  content.value = 'dataload'; // Change content back to show newtable
  selectedProductId.value = null; // Clear the selected product ID if needed
};
</script>
<style>
.body {
  height: 100%;
  margin: 0px !important;
}

.p-splitter {
  height: 100%;
  border: none !important;
  border-radius: none !important;
}

.centered-container {
  margin-top: 20px;
  height: calc(100vh - 40px); /* Adjust height to account for margins */
  width: 100%; /* Full width */
  overflow: hidden; /* Prevent overflow */
}

.p-splitterpanel {
  flex-grow: none !important;
}
@media (max-width: 768px) {
    .hide-on-small {
        display: none;
    }
}
</style>