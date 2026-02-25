import { createRouter, createWebHistory } from 'vue-router'
import authService from '../services/authService'
import { jwtDecode } from 'jwt-decode'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas del Shop (con layout compartido)
    {
      path: '/',
      component: () => import('../layouts/ShopLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/shop/HomeView.vue')
        },
        {
          path: 'producto/:id',
          name: 'producto-detalle',
          component: () => import('../views/shop/ProductDetailView.vue')
        },
        {
          path: 'carrito',
          name: 'carrito',
          component: () => import('../views/shop/CartView.vue')
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: () => import('../views/shop/CheckoutView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'mi-cuenta',
          name: 'mi-cuenta',
          component: () => import('../views/shop/MyAccountView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'mis-ordenes',
          name: 'mis-ordenes',
          component: () => import('../views/shop/MisOrdenesView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'pago/respuesta',
          name: 'pago-respuesta',
          component: () => import('../views/shop/PaymentResponseView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'pago/cancelado',
          name: 'pago-cancelado',
          component: () => import('../views/shop/PaymentResponseView.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    // Rutas sin layout (Login y Registro)
    {
      path: '/registro',
      name: 'registro',
      component: () => import('../views/shop/RegistroView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/admin',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'admin-inicio',
          component: () => import('../views/dashboard/InicioView.vue')
        },
        {
          path: 'usuarios',
          name: 'admin-usuarios',
          component: () => import('../views/dashboard/UsuariosView.vue')
        },
        {
          path: 'ordenes',
          name: 'admin-ordenes',
          component: () => import('../views/dashboard/OrdenesView.vue')
        },
        {
          path: 'pagos',
          name: 'admin-pagos',
          component: () => import('../views/dashboard/PagosView.vue')
        },
        {
          path: 'productos',
          name: 'admin-productos',
          component: () => import('../views/dashboard/ProductosView.vue')
        },
        {
          path: 'categorias',
          name: 'admin-categorias',
          component: () => import('../views/dashboard/CategoriasView.vue')
        },
        {
          path: 'inventario',
          name: 'admin-inventario',
          component: () => import('../views/dashboard/InventarioView.vue')
        },
        {
          path: 'metodos-pago',
          name: 'admin-metodos-pago',
          component: () => import('../views/dashboard/MetodosPagoView.vue')
        }
      ]
    }
  ]
})

// Navigation guard para proteger rutas con validación de token
router.beforeEach((to, from, next) => {
  // Validar si el token es válido (existe y no ha expirado)
  const isAuthenticated = authService.isTokenValid()

  // Si la ruta requiere autenticación y el token no es válido
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Limpiar cualquier dato de sesión inválido
    authService.removeToken()
    next('/login')
  }
  // Si intenta ir al login y ya tiene un token válido
  else if (to.meta.requiresGuest && isAuthenticated) {
    // Redirigir según el rol del usuario
    try {
      const token = authService.getToken()
      const decoded = jwtDecode(token)
      next(decoded.rol === 'comprador' ? '/' : '/admin')
    } catch {
      next('/admin')
    }
  }
  // Permitir navegación
  else {
    next()
  }
})

export default router
