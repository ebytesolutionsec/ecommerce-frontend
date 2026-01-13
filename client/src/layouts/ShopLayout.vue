<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar del Shop -->
    <ShopNavbar />

    <!-- Contenido dinámico de las rutas -->
    <router-view :key="$route.fullPath" />

    <!-- Footer del Shop -->
    <ShopFooter />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import ShopNavbar from '../components/shop/ShopNavbar.vue'
import ShopFooter from '../components/shop/ShopFooter.vue'

const $route = useRoute()
</script>
