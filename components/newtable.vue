<template>
  <div>
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center;margin-inline: 20px;">
        <div>
          <IconField style="padding-left: 10px;">
            <InputIcon>
              <i class="pi pi-search" style="margin-left: 6px;" />
            </InputIcon>
            <InputText v-model="searchQuery" placeholder="Search" @input="filterProducts" />
          </IconField>
        </div>
        <template>
    <div class="card flex justify-center">
        <Select  :options="cities" showClear optionLabel="name" placeholder="Select a City" class="w-full md:w-56" />
    </div>
</template>

        <div style="display: flex; align-items: center;">
          <Button type="button" icon="pi pi-sync" label="" outlined @click="clearFilter" severity="secondary" />
          <!-- <div style="padding-left: 10px;">
          <SortSelectCol :columns="columns" @columnSelected="onColumnSelected" />
        </div> -->
          <!-- <div style="padding-left: 10px;">
          <multiselectedcol :columns="columns" @columnSelected="onColumnSelected" />
        </div>  -->

          <div>
            <div style="padding-left: 10px; text-align: left;">
              <MultiSelect v-model="selectedColumns" :options="columns" optionLabel="header" filter
                :maxSelectedLabels="1" class="w-full sm:w-64" :selectedItemTemplate="selectedItemTemplate">
                <template #value>
                  Show/Hide column
                </template>
                <template #footer>
                  <div class="p-3 flex justify-between" style="padding:3px;display:flex;justify-content:space-between">
                    <Button label="Add New" severity="secondary" text size="small" icon="pi pi-plus" />
                    <Button label="Remove All" severity="danger" text size="small" icon="pi pi-times"
                      @click="clearAllColumns" />
                  </div>
                </template>
              </MultiSelect>

            </div>
          </div>
          <!-- Add this MultiSelect for categories -->
          <div style="padding-left: 10px;">
            <MultiSelect v-model="selectedCategories" :options="categoryOptions" optionLabel="name" filter
              display="chip" size="small" placeholder="Select Categories" class="w-full sm:w-64">
            </MultiSelect>
          </div>

          <div class="card flex justify-center" style="padding-left:10px">
            <Button type="button" icon="pi pi-ellipsis-v" @click="togglemenu" aria-haspopup="true" severity="secondary"
              aria-controls="overlay_menu" />
            <Menu ref="menu" id="overlay_menu" :model="menus" :popup="true" />
          </div>
        </div>
      </div>
      <div class="card" style="margin: 20px;">
        <div style="max-height: 600px; overflow-y: auto;">
          <DataTable v-model:selection="selectedProduct" :value="filteredProducts" :dataKey="id"
            :totalRecords="filteredProducts.length"
            :rowsPerPageOptions="[10, 20, 30, 50, 100, { label: 'All', value: -1 }]" :sortField="sortField"
            :sortOrder="sortOrder" tableStyle="min-width: 50rem" size="small" @row-click="navigateToProductDetail"
            scrollable scrollHeight="550px">

            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column v-for="col in selectedColumns" :key="col.field" :field="col.field" :header="col.header"
              :sortable="true" style="width: 20%" frozen>

              <template #body="slotProps">
                <div v-if="col.field === 'action'" style="display: flex;">
                  <Button icon="pi pi-check" @click="visibleRight = true" severity="secondary" size="small" rounded
                    style="margin: 2px;margin-left:0px !important;" />
                  <Button icon="pi pi-bookmark" @click="callnewvalue" severity="secondary" size="small" rounded
                    style="margin: 2px;padding:2px !important;" />
                  <Button icon="pi pi-user" @click="navigateTonewpage" severity="secondary" size="small" rounded
                    style="margin: 2px;padding:2px !important;" />
                </div>
                <div v-else>
                  {{ col.field === 'price' ? formatCurrency(slotProps.data.price) : slotProps.data[col.field] }}
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
    <div class="card"
      style="position:fixed; bottom:0; display:flex; justify-content: center; align-items: center; width: 80%; background-color: white;">
      <Paginator :rows="rowsPerPage" :totalRecords="filteredProducts.length" :rowsPerPageOptions="[10, 20, 30, 50, 100]"
        @page="onPageChange">
        <template #start="slotProps">
          Page: {{ slotProps.state.page + 1 }} <!-- Incrementing by 1 for user-friendly display -->
          First: {{ slotProps.state.first + 1 }} <!-- Incrementing by 1 for user-friendly display -->
          Rows: {{ slotProps.state.rows }}
        </template>
      </Paginator>
    </div>
    <Drawer v-model:visible="visibleRight" header="Drawer" position="right">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna
        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </p>
    </Drawer>
    <Toast />
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import SortSelectCol from './SortSelectCol.vue';
import Menu from 'primevue/menu';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Drawer from 'primevue/drawer';

import Select from 'primevue/select';



const visibleRight = ref(false);




const callnewvalue = async () => {
  const api = 'https://teamo.gwcindia.in/json-check/cache-redis.php?file=gowtham';

  try {
    const res = await fetch(api, {
      method: 'GET',
    });

    if (!res.ok) throw new Error("HTTPerror! Status:");

   
    showToast = true; 
    // Set the toast message and type for success
    toastMessage = "API call was successful!";
    toastType = "success";  // You can define types in your Toast component
      // Show the toast

    // Hide the toast after 3 seconds (optional)
    setTimeout(() => {
     showToast = false;
    }, 3000);

  } catch (error) {
    console.error("Error:", error.message);

    // Set the toast message and type for error
    toast.add({ severity: 'success', summary: 'Done', detail: 'API Called Succefully !', life: 3000 });

    // Hide the toast after 3 seconds (optional)
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
};




const toast = useToast();
const router = useRouter(); // Initialize router
const products = ref([]);
const selectedProduct = ref([]); // For storing selected products
const columns = ref([
  { field: 'code', header: 'Code' },
  { field: 'name', header: 'Name' },
  { field: 'price', header: 'Price' },
  { field: 'category', header: 'Category' },
  { field: 'quantity', header: 'Quantity' },
  { field: 'action', header: 'Action' } // New Action column
]);
const categoryOptions = ref([
  { name: 'Category A', value: 'Category A' },
  { name: 'Category B', value: 'Category B' },
  { name: 'Category C', value: 'Category C' }
]);

const selectedCategories = ref([
  { name: 'Category A', value: 'Category A' },
  { name: 'Category B', value: 'Category B' },
  { name: 'Category C', value: 'Category C' }
]); // Initially select all categories

const selectedColumns = ref(columns.value);

const searchQuery = ref('');
const sortField = ref('price'); // Default sort field
const sortOrder = ref(1); // Default sort order (1 for ascending, -1 for descending)
const rowsPerPage = ref(10); // Number of rows per page
const currentPage = ref(0); // Current page index
const menu = ref();
const selectedItemTemplate = (selected) => {
  return selected.length ? 'Select Column' : 'Select Columns';
}
const menus = ref([
  {
    items: [
      {
        label: 'Refresh',
        icon: 'pi pi-refresh',
        command: () => handleMenuAction('refresh') // Call handleMenuAction for refresh
      },
      {
        label: 'Export',
        icon: 'pi pi-upload',
        command: () => handleMenuAction('export') // Call handleMenuAction for export
      }
    ]
  }
]);

const toastVisible = ref(false); // Reactive variable for toast visibility
// Reactive variable for toast message
const show = () => {
  toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
};

const togglemenu = (event) => {
  menu.value.toggle(event);
};

const handleMenuAction = (action) => {
  if (action === 'export') {
    exportCSV();
  } else if (action === 'refresh') {
    clearFilter();
  }
};

const exportCSV = () => {
  // Create CSV header from selected columns
  const headers = selectedColumns.value.map(col => col.header).join(",") + "\n";

  // Create CSV content
  const csvContent = headers + filteredProducts.value.map(product => {
    return selectedColumns.value.map(col => {
      // Return the value of the product for the selected column field
      return product[col.field];
    }).join(","); // Join each product's values with commas
  }).join("\n"); // Join each product with a new line

  const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "products.csv"); // Set the file name
  document.body.appendChild(link); // Required for Firefox
  link.click(); // Trigger the download
  document.body.removeChild(link); // Clean up
};

const filteredProducts = computed(() => {
  let filtered = products.value;

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(product => {
      return Object.values(product).some(value =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
  }

  debugger
  if (selectedCategories) {
    const selectedCategoryValues = selectedCategories.value.map(category => category.value);
    filtered = filtered.filter(product => selectedCategoryValues.includes(product.category));
  } else {
    // If no categories are selected, show all products
    filtered = products.value;
  }

  // Sort the filtered products
  filtered.sort((a, b) => {
    const modifier = sortOrder.value === 1 ? 1 : -1;
    if (a[sortField.value] < b[sortField.value]) return -1 * modifier;
    if (a[sortField.value] > b[sortField.value]) return 1 * modifier;
    return 0;
  });

  // Handle pagination
  const start = currentPage.value * rowsPerPage.value;
  const end = start + rowsPerPage.value;

  return filtered.slice(start, end);
});

const clearFilter = () => {
  // Reset search query
  searchQuery.value = '';

  // Reset selected columns to default state
  selectedColumns.value = [...columns.value];  // Reset to the initial column setup

  // Reset selected categories to show all categories
  selectedCategories.value = [...categoryOptions.value]; // Select all categories by default

  // Reset sorting and pagination settings
  sortField.value = 'price'; // Reset to default sorting field
  sortOrder.value = 1; // Default ascending order
  currentPage.value = 0; // Reset to first page
  rowsPerPage.value = 10; // Default rows per page

  // Update the localStorage to reflect the cleared filters
  localStorage.setItem('product-filters', JSON.stringify({
    searchQuery: '',
    selectedCategories: selectedCategories.value,
    sortField: 'price',
    sortOrder: 1
  }));

  localStorage.setItem('selected-columns', JSON.stringify(selectedColumns.value));

  // Optionally, reset the table data and pagination (recomputes based on current state)
};

watch([searchQuery, selectedCategories, sortField, sortOrder], () => {
  localStorage.setItem('product-filters', JSON.stringify({
    searchQuery: searchQuery.value,
    selectedCategories: selectedCategories.value,
    sortField: sortField.value,
    sortOrder: sortOrder.value,

  }));
});
watch([selectedColumns], () => {
  localStorage.setItem('selected-columns', JSON.stringify(selectedColumns.value));
});

const onPageChange = (event) => {
  currentPage.value = event.page; // Update the current page
  rowsPerPage.value = event.rows === -1 ? filteredProducts.value.length : event.rows; // Handle "All" option
};
const clearAllColumns = () => {
  selectedColumns.value = [];
  // Save selected columns to localStorage
  localStorage.setItem('selected-columns', JSON.stringify(selectedColumns.value));
};



const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const onColumnSelected = (selectedColumn) => {
  sortField.value = selectedColumn.field; // Set the sort field based on the selected column
  sortOrder.value = sortOrder.value === 1 ? -1 : 1; // Toggle sort order between ascending and descending
  show();
};

const emit = defineEmits();
const navigateTonewpage = (event) => {

  router.push({
    path: `/product`, // Navigate to the product detail page

  });

}
const navigateToProductDetail = (event) => {
  const productId = event.data.id; // Get the ID of the clicked product
  emit('product-selected', productId); // Emit the product ID to the parent component
};


onMounted(() => {
  const savedColumns = localStorage.getItem('selected-columns');
  if (savedColumns) {
    selectedColumns.value = JSON.parse(savedColumns);
  }

  const savedFilters = localStorage.getItem('product-filters');
  if (savedFilters) {
    const filters = JSON.parse(savedFilters);
    searchQuery.value = filters.searchQuery || '';
    selectedCategories.value = filters.selectedCategories || [];
    sortField.value = filters.sortField || 'price';
    sortOrder.value = filters.sortOrder || 1;
  }

  fetchProducts();
});

const fetchProducts = async () => {
  try {
    const response = await fetch('/products.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    products.value = await response.json();
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

</script>

<style scoped>
.card {
  position: relative;
}

.data-table-container {
  max-height: 400px;
  /* Set the height you want */
  overflow-y: auto;
  /* Enable vertical scrolling */
}

.p-datatable {
  width: 100%;
  /* Ensure the table takes full width */
}

.p-datatable-header {
  position: sticky !important;
  /* Make the header sticky */
  top: 0 !important;
  /* Stick to the top */
  z-index: 1 !important;
  /* Ensure it stays above the body */
  background: white;
  /* Set background to avoid transparency issues */
}
</style>