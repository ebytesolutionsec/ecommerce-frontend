import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'inicio',
          component: () => import('../views/dashboard/InicioView.vue')
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          component: () => import('../views/dashboard/UsuariosView.vue')
        },
        {
          path: 'ordenes',
          name: 'ordenes',
          component: () => import('../views/dashboard/OrdenesView.vue')
        },
        {
          path: 'pagos',
          name: 'pagos',
          component: () => import('../views/dashboard/PagosView.vue')
        },
        {
          path: 'productos',
          name: 'productos',
          component: () => import('../views/dashboard/ProductosView.vue')
        },
        {
          path: 'categorias',
          name: 'categorias',
          component: () => import('../views/dashboard/CategoriasView.vue')
        },
        {
          path: 'inventario',
          name: 'inventario',
          component: () => import('../views/dashboard/InventarioView.vue')
        }
      ]
    }
  ]
})

// Navigation guard para proteger rutas
router.beforeEach((to, from, next) => {
  const { checkAuth } = useAuth()
  const isAuthenticated = checkAuth()

  // Si la ruta requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  }
  // Si intenta ir al login y ya está autenticado
  else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  }
  // Permitir navegación
  else {
    next()
  }
})

export default router
