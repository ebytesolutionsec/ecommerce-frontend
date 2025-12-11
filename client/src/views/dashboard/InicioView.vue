<template>
  <div class="max-w-7xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Bienvenido al Dashboard</h2>

    <!-- Cards de estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard title="Total Usuarios" value="0" />
      <StatsCard title="Total Ordenes" value="0" />
      <StatsCard title="Total Productos" value="0" />
      <StatsCard title="Total Ingresos" value="$0" />
    </div>
  </div>
</template>

<script setup>
import StatsCard from '../../components/common/StatsCard.vue'
</script>
