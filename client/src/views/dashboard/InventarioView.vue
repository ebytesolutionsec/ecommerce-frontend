<template>
  <div>
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Inventario</h2>
    <DataTable :columns="columns" :data="inventario" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '../../components/common/DataTable.vue'

const columns = ['ID', 'Producto', 'Stock Actual', 'Stock Mínimo', 'Estado', 'Acciones']
const inventario = ref([])
// Aquí se cargará el inventario desde el backend
</script>
