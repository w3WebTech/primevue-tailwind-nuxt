<template>
    <div class="card">
        <Menubar :model="items">
        
            <template #end>
                <div class="flex items-center gap-2">
                    <Button label="Criar" icon="pi pi-plus" size="small" severity="contrast"/>
                </div>
            </template>
        </Menubar>

    
    </div>
</template>

<script setup>
import { ref } from "vue";
import 'primeicons/primeicons.css';
import Menubar from 'primevue/menubar';
import Select from 'primevue/select';
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';

const home = ref({ icon: 'pi pi-home' });

const val = ref([{}]);
const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home'
    },
    {
        label: 'Projects',
        icon: 'pi pi-search',
        badge: 3,
        items: [
            {
                label: 'Core',
                icon: 'pi pi-bolt',
                shortcut: '⌘+S'
            },
            {
                label: 'Blocks',
                icon: 'pi pi-server',
                shortcut: '⌘+B'
            },
            {
                separator: true
            },
            {
                label: 'UI Kit',
                icon: 'pi pi-pencil',
                shortcut: '⌘+U'
            }
        ]
    }
]);

const selectedCity = ref();
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
</script>
<style>
.p-menubar{
    border-radius:0px !important;
}</style>
