<template>
  <div>
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Pagos</h2>
    <DataTable :columns="columns" :data="pagos" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '../../components/common/DataTable.vue'

const columns = ['ID', 'Orden', 'Monto', 'Método', 'Estado', 'Fecha', 'Acciones']
const pagos = ref([])
// Aquí se cargarán los pagos desde el backend
</script>
