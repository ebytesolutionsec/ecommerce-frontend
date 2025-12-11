<template>
  <div>
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Productos</h2>
    <DataTable :columns="columns" :data="productos" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '../../components/common/DataTable.vue'

const columns = ['ID', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Acciones']
const productos = ref([])
// Aquí se cargarán los productos desde el backend
</script>
