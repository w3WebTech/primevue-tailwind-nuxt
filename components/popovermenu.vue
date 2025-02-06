<template>
    <div class="card flex justify-center"   :class="{
          'bg-white': isClicked,
          'hover:bg-gray-200': !isClicked
        }">
      <div
        class=""
      
        style="border-radius: 0.375rem; padding: 5px; width: 200px;"
        @click="toggleClick"
      >
        <div
          style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" @click="toggle">
        
          <div style="display: flex; align-items: center;">
            <img
              :src="`https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png`"
              style="width: 32px"
            />
            <div class="" style="margin: 4px;padding-left: 4px;">
              <div>CRM</div>
              <div>username</div>
            </div>
          </div>
  
          <i class="pi pi-chevron-down ml-2" style="font-size: 0.75rem;"></i>
        </div>
      </div>
  
      <Popover ref="op" trigger="click" v-model:visible="isPopoverVisible">
        <div class="flex flex-col gap-4">
          <div class="card flex justify-center">
            <Menu :model="items" />
          </div>
        </div>
      </Popover>
    </div>
  </template>
  
  
  <script setup>
  import { ref } from 'vue';
  import 'primeicons/primeicons.css';
  import Popover from 'primevue/popover';
  import Menu from 'primevue/menu';
  
  const op = ref();
  const isClicked = ref(false);
  
  const toggleClick = () => {
    isClicked.value = !isClicked.value; // Toggle click state
  };
  

  const items = ref([
    {
      label: 'Toggle Theme',
      icon: 'pi pi-moon',
      command: () => emit('menu-select', 'Settings Updated'),
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => emit('menu-select', 'Settings Updated'),
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => emit('menu-select', 'Logged Out'),
    },
  ]);
  
  const toggle = (event) => {
    op.value.toggle(event);
  };
  </script>
  
  <style scoped>
  .card {
    transition: background-color 0.3s ease;
    border-radius: 5px;
  }
  
  .card:hover {
    background-color: #e2e8f0; /* Gray color on hover */
  }
  
  .card.bg-white {
    background-color: white;
  }
  .p-menu-item.p-focus .p-menu-item-content{
    background: white !important;
  }
  </style>
  