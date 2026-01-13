import { ref, computed } from 'vue'

// Estado global del carrito
const cartItems = ref([])

// Cargar carrito desde localStorage al iniciar
const loadCartFromStorage = () => {
  const savedCart = localStorage.getItem('shopping_cart')
  if (savedCart) {
    try {
      cartItems.value = JSON.parse(savedCart)
    } catch (error) {
      console.error('Error al cargar el carrito:', error)
      cartItems.value = []
    }
  }
}

// Guardar carrito en localStorage
const saveCartToStorage = () => {
  localStorage.setItem('shopping_cart', JSON.stringify(cartItems.value))
}

// Inicializar
loadCartFromStorage()

export function useCart() {
  // Computed properties
  const cartItemCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      const price = item.precio_descuento > 0 ? item.precio_descuento : item.precio
      return total + (price * item.quantity)
    }, 0)
  })

  // Methods
  const addToCart = (product, quantity = 1) => {
    // Obtener el ID del producto (puede ser _id o id)
    const productId = product._id || product.id

    if (!productId) {
      console.error('Producto sin ID válido:', product)
      return
    }

    const existingItem = cartItems.value.find(item => {
      const itemId = item._id || item.id
      return itemId && itemId === productId
    })

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({
        ...product,
        quantity,
        addedAt: new Date().toISOString()
      })
    }

    saveCartToStorage()
  }

  const removeFromCart = (productId) => {
    const index = cartItems.value.findIndex(item => {
      const itemId = item._id || item.id
      return itemId && itemId === productId
    })
    if (index > -1) {
      cartItems.value.splice(index, 1)
      saveCartToStorage()
    }
  }

  const updateQuantity = (productId, quantity) => {
    const item = cartItems.value.find(item => {
      const itemId = item._id || item.id
      return itemId && itemId === productId
    })

    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveCartToStorage()
      }
    }
  }

  const clearCart = () => {
    cartItems.value = []
    saveCartToStorage()
  }

  const isInCart = (productId) => {
    return cartItems.value.some(item => {
      const itemId = item._id || item.id
      return itemId && itemId === productId
    })
  }

  const getItemQuantity = (productId) => {
    const item = cartItems.value.find(item => {
      const itemId = item._id || item.id
      return itemId && itemId === productId
    })
    return item ? item.quantity : 0
  }

  return {
    cartItems,
    cartItemCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  }
}
