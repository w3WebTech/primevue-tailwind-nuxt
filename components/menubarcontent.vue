<template>
    <div class=" flex justify-center">
        <div class="" style="padding: 5px;">
            <popovermenu />
        </div>
        <Menu :model="items" @item-click="onItemClick" />
    </div>
</template>

<script setup>
import { ref } from "vue";
import Menu from 'primevue/menu';

import 'primeicons/primeicons.css'

const items = ref([
    {
        
        items: [
        {
                label: 'Notifications',
                icon: 'pi pi-bell',
                command: () => emit('menu-select', 'Search Document')
            },
            {
                label: 'Leads',
                icon: 'pi pi-users',
                command: () => emit('menu-select', 'dataload')
            },
           
        ]
    },
  
]);

const emit = defineEmits(['menu-select']);
</script>
<style>
.p-menu-list{
  background-color:#F8F8F8 ;
  
}
.p-menu{
    border:none !important;
}
.p-menu-submenu-label{
    padding: 0px !important;

}
 </style>