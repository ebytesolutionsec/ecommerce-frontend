<template>
  <div>
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Ordenes</h2>
    <DataTable :columns="columns" :data="ordenes" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '../../components/common/DataTable.vue'

const columns = ['ID', 'Cliente', 'Total', 'Estado', 'Fecha', 'Acciones']
const ordenes = ref([])
// Aquí se cargarán las ordenes desde el backend
</script>
