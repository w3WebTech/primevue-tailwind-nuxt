<template>
  <div class="card">
    <div class="table-container">
      <DataTable v-if="customers.length > 0" @selection-change="onRowSelect" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" v-model:filters="filters"
        :value="sortedCustomers" showGridlines dataKey="id" filterDisplay="menu" :loading="loading"
        :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
        style="height: calc(100vh - 200px);" size="small" 
         >
        
        <!-- Table Header and Columns -->
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <IconField style="padding-left: 10px;">
                <InputIcon>
                  <i class="pi pi-search" style="margin-left: 6px;" />
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Search" />
              </IconField>
            </div>
            <div style="display: flex; align-items: center;">
              <Button type="button" icon="pi pi-sync" label="" outlined @click="clearFilter()" severity="secondary" />
             
              <div style="padding-left: 10px;">
                <SortSelectCol :columns="columns" @columnSelected="onColumnSelected" />
              </div>
              <div>
                <div style="padding-left: 10px; text-align: left;">
                  <MultiSelect v-model="selectedColumns" :options="columns" optionLabel="header" filter placeholder="Select Columns" display="chip" class="w-full sm:w-64" >
                    <template #option="slotProps">
                      <div class="flex items-center">
                        <img :alt="slotProps.option.header" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${slotProps.option.field.toLowerCase()} mr-2`" style="width: 18px" />
                        <div style="margin-bottom:12px">{{ slotProps.option.header }}</div>
                      </div>
                    </template>
                    <template #dropdownicon>
                      <i class="pi pi-map" />
                    </template>
                    <template #filtericon>
                      <i class="pi pi-map" />
                    </template>
                    <!-- <template #header>
                      <div class="font-medium px-3 py-2">Available Columns</div>
                    </template> -->
                    <template #footer>
                      <div class="p-3 flex justify-between" style="padding:3px;display:flex;justify-content:space-between">
                        <Button label="Add New" severity="secondary" text size="small" icon="pi pi-plus" />
                        <Button label="Remove All" severity="danger" text size="small" icon="pi pi-times" @click="clearAllColumns" />
                      </div>
                    </template>
                  </MultiSelect>
                </div>
              </div>
               <div class="card flex justify-center" style="padding-left:10px" >
                <Button type="button" icon="pi pi-ellipsis-v" @click="togglemenu" aria-haspopup="true" severity="secondary" aria-controls="overlay_menu" />
                <Menu ref="menu" id="overlay_menu" :model="menus" :popup="true" />
              </div>
            </div>
          </div>
        </template>

        <!-- Table Columns -->
      <Column selectionMode="multiple" headerStyle="width: 3rem" headerClassName="header-bg"></Column>
        <Column v-if="selectedColumns.some(col => col.field === 'name')" field="name" header="Name" style="min-width: 12rem" headerClassName="header-bg">
          <template #body="{ data }">
            {{ data.name }}
          </template>
          <!-- <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
          </template> -->
        </Column>
        <Column v-if="selectedColumns.some(col => col.field === 'country.name')" header="Country" filterField="country.name" style="min-width: 12rem" headerClassName="header-bg">
          <template #body="{ data }">
          
              <!-- <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                :class="`flag flag-${data.country.code}`" style="width: 24px" /> -->
            {{ data.country.name }}
            
          </template>
        </Column>
        <Column v-if="selectedColumns.some(col => col.field === 'balance')" field="balance" header="Balance" style="min-width: 10rem" headerClassName="header-bg">
          <template #body="{ data }">
            ${{ data.balance.toLocaleString() }}
          </template>
          <!-- <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by balance" />
          </template> -->
        </Column>
        <Column v-if="selectedColumns.some(col => col.field === 'activity')" field="activity" header="Activity" style="min-width: 10rem" headerClassName="header-bg">
          <template #body="{ data }">
            {{ data.activity }}%
          </template>
          <!-- <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value[0]" type="number" placeholder="Min activity" />
            <InputText v-model="filterModel.value[1]" type="number" placeholder="Max activity" />
          </template> -->
        </Column>
        <Column v-if="selectedColumns.some(col => col.field === 'status')" field="status" header="Status" style="min-width: 10rem" headerClassName="header-bg">
          <template #body="{ data }">
            <span :class="`status-${data.status.toLowerCase()}`">{{ data.status }}</span>
          </template>
          <!-- <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by status" />
          </template> -->
        </Column>


        <template #paginatorcontainer="{ first, last, page, pageCount, prevPageCallback, nextPageCallback, totalRecords }">
        <div class="custom-button" style="position: fixed;bottom:0;">
            <Button icon="pi pi-chevron-left" rounded text @click="prevPageCallback" :disabled="page === 0" />
            <div class="text-color font-medium">
                <span class="hidden sm:block">Showing {{ first }} to {{ last }} of {{ totalRecords }}</span>
                <span class="block sm:hidden">Page {{ page + 1 }} of {{ pageCount }}</span>
            </div>
            <Button icon="pi pi-chevron-right" rounded text @click="nextPageCallback" :disabled="page === pageCount - 1" />
        </div>
    </template>
      </DataTable>
      
        <Skeleton v-else />

    </div>
    <div class="card flex flex-col items-center justify-center">
      <Message v-if="visible" severity="success" :life="3000">Row selected successfully!</Message>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SortSelectCol from './SortSelectCol.vue'; // Adjust the path as necessary
import 'primeicons/primeicons.css';
import Menu from 'primevue/menu';
import Skeleton from 'primevue/skeleton';
import Message from 'primevue/message';
const loading = ref(true);
setTimeout(() => {
  loading.value = false; // Set loading to false after data is loaded
}, 2000);
const selectedRows = ref([]); // To keep track of selected rows
let visible = ref(false);

const showMessage = () => {
  visible.value = true;

  setTimeout(() => {
    visible.value = false;
  }, 3500);
};
const onRowSelect = (event) => {
  debugger
  selectedRows.value = event.value; // Update selected rows
  if (selectedRows.value.length > 0) {
    showMessage(); // Show message if at least one row is selected
  }
};
const menu = ref();
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

const clearAllColumns = () => {
  selectedColumns.value = []; // Clear all selected columns
};
const customers = ref([
  { id: 1, name: 'John Doe', country: { name: 'USA', code: 'us' }, representative: { name: 'Amy Elsner', image: 'amyelsner.png' }, date: '2023-01-01', balance: 5000, status: 'qualified', activity: 80, verified: true },
  { id: 2, name: 'Jane Smith', country: { name: 'UK', code: 'gb' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-02', balance: 3000, status: 'unqualified', activity: 60, verified: false },
  { id: 3, name: 'Alice Johnson', country: { name: 'USA', code: 'us' }, representative: { name: 'Amy Elsner', image: 'amyelsner.png' }, date: '2023-01-03', balance: 7000, status: 'qualified', activity: 90, verified: true },
  { id: 4, name: 'Bob Brown', country: { name: 'UK', code: 'gb' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-04', balance: 2000, status: 'unqualified', activity: 40, verified: false },
  { id: 5, name: 'Charlie Green', country: { name: 'USA', code: 'us' }, representative: { name: 'Amy Elsner', image: 'amyelsner.png' }, date: '2023-01-05', balance: 8000, status: 'qualified', activity: 70, verified: true },
  { id: 6, name: 'David White', country: { name: 'USA', code: 'us' }, representative: { name: 'Amy Elsner', image: 'amyelsner.png' }, date: '2023-01-06', balance: 12000, status: 'qualified', activity: 85, verified: true },
  { id: 7, name: 'Eve Black', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-07', balance: 4500, status: 'unqualified', activity: 50, verified: false },
  { id: 8, name: 'Frank White', country: { name: 'UK', code: 'gb' }, representative: { name: 'Amy Elsner', image: 'amyelsner.png' }, date: '2023-01-08', balance: 6000, status: 'qualified', activity: 75, verified: true },
  { id: 9, name: 'Grace Blue', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-09', balance: 3200, status: 'unqualified', activity: 65, verified: false },
  { id: 10, name: 'Henry Silver', country: { name: 'USA', code: 'us' }, representative: { name: 'Amy Elsner', image: 'amyelsner.png' }, date: '2023-01-10', balance: 9500, status: 'qualified', activity: 88, verified: true },
  { id: 11, name: 'Ivy Gold', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-11', balance: 11000, status: 'qualified', activity: 65, verified: true },
  { id: 12, name: 'Jack Grey', country: { name: 'USA', code: 'us' }, representative: { name: 'Amy Elsner', image: 'amyelsner.png' }, date: '2023-01-12', balance: 7000, status: 'unqualified', activity: 45, verified: false },
  { id: 13, name: 'Kathy Pink', country: { name: 'UK', code: 'gb' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-13', balance: 4000, status: 'qualified', activity: 90, verified: true },
  { id: 14, name: 'Liam Purple', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Amy Elsner', image: 'amyelsner.png' }, date: '2023-01-14', balance: 2700, status: 'unqualified', activity: 55, verified: false },
  { id: 15, name: 'Mia Brown', country: { name: 'USA', code: 'us' }, representative: { name: 'Amy Elsner', image: 'amyelsner.png' }, date: '2023-01-15', balance: 5500, status: 'qualified', activity: 72, verified: true },
  { id: 16, name: 'Nathan Yellow', country: { name: 'UK', code: 'gb' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-16', balance: 6500, status: 'unqualified', activity: 62, verified: false },
  { id: 17, name: 'Olivia Orange', country: { name: 'USA', code: 'us' }, representative: { name: 'Amy Elsner', image: 'amyelsner.png' }, date: '2023-01-17', balance: 4000, status: 'qualified', activity: 80, verified: true },
  { id: 18, name: 'Paul Blue', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-18', balance: 8500, status: 'qualified', activity: 95, verified: true },
  { id: 19, name: 'Quincy Red', country: { name: 'UK', code: 'gb' }, representative: { name: 'Amy Elsner', image: 'amyelsner.png' }, date: '2023-01-19', balance: 2000, status: 'unqualified', activity: 50, verified: false },
  { id: 20, name: 'Rebecca Green', country: { name: 'USA', code: 'us' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-20', balance: 6200, status: 'qualified', activity: 68, verified: true },
  { id: 21, name: 'Steve Black', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Amy Elsner', image: 'amyelsner.png' }, date: '2023-01-21', balance: 4100, status: 'unqualified', activity: 40, verified: false },
  { id: 22, name: 'Tracy White', country: { name: 'USA', code: 'us' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-22', balance: 5000, status: 'qualified', activity: 85, verified: true },
  { id: 23, name: 'Ursula Blue', country: { name: 'UK', code: 'gb' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-23', balance: 3600, status: 'unqualified', activity: 77, verified: false },
  { id: 24, name: 'Victor Red', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Amy Elsner', image: 'annafali.png' }, date: '2023-01-24', balance: 9400, status: 'qualified', activity: 95, verified: true },
  { id: 25, name: 'Wendy Grey', country: { name: 'USA', code: 'us' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-25', balance: 5300, status: 'unqualified', activity: 45, verified: false },
  { id: 26, name: 'Xander Purple', country: { name: 'UK', code: 'gb' }, representative: { name: 'Amy Elsner', image: 'annafali.png' }, date: '2023-01-26', balance: 6700, status: 'qualified', activity: 80, verified: true },
  { id: 27, name: 'Yvonne Yellow', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-27', balance: 2400, status: 'unqualified', activity: 56, verified: false },
  { id: 28, name: 'Zachary Green', country: { name: 'USA', code: 'us' }, representative: { name: 'Amy Elsner', image: 'annafali.png' }, date: '2023-01-28', balance: 8100, status: 'qualified', activity: 92, verified: true },
  { id: 29, name: 'Anna Orange', country: { name: 'UK', code: 'gb' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-29', balance: 5300, status: 'qualified', activity: 74, verified: true },
  { id: 30, name: 'Ben Silver', country: { name: 'USA', code: 'us' }, representative: { name: 'Amy Elsner', image: 'annafali.png' }, date: '2023-01-30', balance: 9200, status: 'unqualified', activity: 61, verified: false },
  { id: 31, name: 'Catherine Blue', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-01-31', balance: 7200, status: 'qualified', activity: 80, verified: true },
  { id: 32, name: 'Daniel Red', country: { name: 'UK', code: 'gb' }, representative: { name: 'Amy Elsner', image: 'annafali.png' }, date: '2023-02-01', balance: 8500, status: 'qualified', activity: 95, verified: true },
  { id: 33, name: 'Elaine Purple', country: { name: 'USA', code: 'us' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-02-02', balance: 6000, status: 'unqualified', activity: 70, verified: false },
  { id: 34, name: 'Frank Green', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Amy Elsner', image: 'annafali.png' }, date: '2023-02-03', balance: 4000, status: 'unqualified', activity: 50, verified: false },
  { id: 35, name: 'George Blue', country: { name: 'USA', code: 'us' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-02-04', balance: 7500, status: 'qualified', activity: 84, verified: true },
  { id: 36, name: 'Hannah Yellow', country: { name: 'UK', code: 'gb' }, representative: { name: 'Amy Elsner', image: 'annafali.png' }, date: '2023-02-05', balance: 9000, status: 'qualified', activity: 79, verified: true },
  { id: 37, name: 'Ivy Grey', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-02-06', balance: 5600, status: 'unqualified', activity: 44, verified: false },
  { id: 38, name: 'Jake Orange', country: { name: 'USA', code: 'us' }, representative: { name: 'Amy Elsner', image: 'annafali.png' }, date: '2023-02-07', balance: 8200, status: 'qualified', activity: 88, verified: true },
  { id: 39, name: 'Kara Silver', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-02-08', balance: 9900, status: 'qualified', activity: 91, verified: true },
  { id: 40, name: 'Liam Black', country: { name: 'USA', code: 'us' }, representative: { name: 'Amy Elsner', image: 'annafali.png' }, date: '2023-02-09', balance: 4700, status: 'unqualified', activity: 65, verified: false },
  { id: 41, name: 'Maggie Yellow', country: { name: 'UK', code: 'gb' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-02-10', balance: 8100, status: 'qualified', activity: 95, verified: true },
  { id: 42, name: 'Nina Orange', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Amy Elsner', image: 'annafali.png' }, date: '2023-02-11', balance: 6000, status: 'unqualified', activity: 74, verified: false },
  { id: 43, name: 'Oscar Blue', country: { name: 'USA', code: 'us' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-02-12', balance: 8300, status: 'qualified', activity: 88, verified: true },
  { id: 44, name: 'Penny Purple', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-02-13', balance: 2900, status: 'unqualified', activity: 40, verified: false },
  { id: 45, name: 'Quincy Green', country: { name: 'USA', code: 'us' }, representative: { name: 'Amy Elsner', image: 'annafali.png' }, date: '2023-02-14', balance: 6300, status: 'qualified', activity: 72, verified: true },
  { id: 46, name: 'Rosa Yellow', country: { name: 'UK', code: 'gb' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-02-15', balance: 7400, status: 'unqualified', activity: 60, verified: false },
  { id: 47, name: 'Sam Black', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Amy Elsner', image: 'annafali.png' }, date: '2023-02-16', balance: 8000, status: 'qualified', activity: 85, verified: true },
  { id: 48, name: 'Tina Grey', country: { name: 'USA', code: 'us' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-02-17', balance: 6700, status: 'unqualified', activity: 54, verified: false },
  { id: 49, name: 'Ursula Blue', country: { name: 'UK', code: 'gb' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-02-18', balance: 7800, status: 'qualified', activity: 90, verified: true },
  { id: 50, name: 'Victor Red', country: { name: 'Canada', code: 'ca' }, representative: { name: 'Anna Fali', image: 'annafali.png' }, date: '2023-02-19', balance: 4900, status: 'unqualified', activity: 52, verified: false }
]);

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { operator: 'and', constraints: [{ value: null, matchMode: 'startsWith' }] },
  'country.name': { operator: 'and', constraints: [{ value: null, matchMode: 'startsWith' }] },
  representative: { value: null, matchMode: 'in' },
  date: { operator: 'and', constraints: [{ value: null, matchMode: 'dateIs' }] },
  balance: { operator: 'and', constraints: [{ value: null, matchMode: 'equals' }] },
  status: { operator: 'or', constraints: [{ value: null, matchMode: 'equals' }] },
  activity: { value: [0, 100], matchMode: 'between' },
  verified: { value: null, matchMode: 'equals' }
});

const selectedCountry = ref(null);

const selectedColumn = ref(null);
const sortOrder = ref('asc');

const columns = [
  { field: 'name', header: 'Name' },
  { field: 'country.name', header: 'Country' },
  { field: 'balance', header: 'Balance' },
  { field: 'activity', header: 'Activity' },
  { field: 'status', header: 'Status' }
];

const selectedColumns = ref([...columns]); // Initialize with all columns selected

const filteredCustomers = computed(() => {
  let filtered = !selectedCountry.value ? customers.value : customers.value.filter(customer => customer.country.name === selectedCountry.value.name);

  if (selectedColumn.value && filtered.length) {
    filtered = [...filtered];

    filtered.sort((a, b) => {
      const aValue = a[selectedColumn.value];
      const bValue = b[selectedColumn.value];

      if (sortOrder.value === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }

  return filtered;
});

const sortedCustomers = computed(() => {
  let data = filteredCustomers.value;

  if (selectedColumn.value) {
    data = data.sort((a, b) => {
      const aValue = getFieldValue(a, selectedColumn.value.field);
      const bValue = getFieldValue(b, selectedColumn.value.field);

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder.value === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }

  return data;
});

const getFieldValue = (data, field) => {
  const fields = field.split('.');
  let value = data;

  fields.forEach(f => {
    if (value) {
      value = value[f];
    }
  });

  return value;
};

const onColumnSelected = (column) => {
  if (selectedColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    selectedColumn.value = column;
    sortOrder.value = 'asc';
  }

  console.log(selectedColumn.value, "sorted in", sortOrder.value);
};

const clearFilter = () => {
  selectedCountry.value = null;
  filters.value.global.value = null;
};

const exportCSV = () => {
  const csvContent = [
    ['Name', 'Country', 'Balance', 'Activity', 'Status'],
    ...customers.value.map(c => [c.name, c.country.name, c.balance, c.activity, c.status])
  ]
  .map(e => e.join(','))
  .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'customers.csv';
  link.click();
};
</script>

<style scoped>
.table-container {
  padding-top: 20px;
  overflow: auto;
  margin: 0 auto;
}
.custom-button {
  display: flex;
  align-items: center;
  gap: 1rem; /* Adjusted from gap-4 */
  border: 1px solid var(--primary-color); /* Assuming you have a CSS variable for primary color */
  background-color: transparent;
  border-radius: 9999px; /* This creates a fully rounded shape */
  width: 100%;
  padding: 0.25rem 0.5rem; /* Adjusted from py-1 px-2 */
  justify-content: space-between;
}
/* Gray background for column headers */
:deep(.header-bg) {
  background-color: #f0f0f0 !important; /* Light gray */
}
</style>