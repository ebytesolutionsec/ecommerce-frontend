<template>
  <div>
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Categorías</h2>
    <DataTable :columns="columns" :data="categorias" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '../../components/common/DataTable.vue'

const columns = ['ID', 'Nombre', 'Descripción', 'Productos', 'Acciones']
const categorias = ref([])
// Aquí se cargarán las categorías desde el backend
</script>
