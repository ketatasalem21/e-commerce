import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
  parentId?: number
  isActive: boolean
  productsCount: number
}

export interface Customer {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string
  dateJoined: string
  totalOrders: number
  totalSpent: number
  status: 'active' | 'inactive' | 'blocked'
  lastLogin: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  avatar: string
  role: 'admin' | 'customer'
  isVerified: boolean
}

export interface Product {
  id: number
  name: string
  price: number
  image: string
  images: string[]
  category: string
  categoryId: number
  rating: number
  description: string
  stock: number
  featured: boolean
  sku: string
  tags: string[]
  variants: ProductVariant[]
  reviews: Review[]
  specifications: { [key: string]: string }
  seoTitle: string
  seoDescription: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: number
  name: string
  value: string
  price: number
  stock: number
  sku: string
}

export interface Review {
  id: number
  userId: number
  userName: string
  userAvatar: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  helpful: number
}

export interface CartItem {
  id: number
  product: Product
  quantity: number
}

export interface Order {
  id: number
  items: CartItem[]
  total: number
  status: string
  date: string
  customer: string
  customerId: number
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  trackingNumber?: string
  notes?: string
}

export interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export interface WishlistItem {
  id: number
  product: Product
  dateAdded: string
}

export const useMainStore = defineStore('main', () => {
  // State
  const cart = ref<CartItem[]>([])
  const wishlist = ref<WishlistItem[]>([])
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  
  const categories = ref<Category[]>([
    {
      id: 1,
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest electronic devices and gadgets',
      image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800',
      isActive: true,
      productsCount: 45
    },
    {
      id: 2,
      name: 'Audio',
      slug: 'audio',
      description: 'Premium audio equipment and accessories',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      isActive: true,
      productsCount: 23
    },
    {
      id: 3,
      name: 'Wearables',
      slug: 'wearables',
      description: 'Smart watches and fitness trackers',
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
      isActive: true,
      productsCount: 18
    },
    {
      id: 4,
      name: 'Accessories',
      slug: 'accessories',
      description: 'Essential tech accessories',
      image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800',
      isActive: true,
      productsCount: 32
    }
  ])
  
  const customers = ref<Customer[]>([
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '+33 1 23 45 67 89',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      dateJoined: '2023-01-15',
      totalOrders: 12,
      totalSpent: 2850.50,
      status: 'active',
      lastLogin: '2024-01-20'
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@email.com',
      phone: '+33 1 98 76 54 32',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      dateJoined: '2023-03-22',
      totalOrders: 8,
      totalSpent: 1650.75,
      status: 'active',
      lastLogin: '2024-01-19'
    }
  ])
  
  const products = ref<Product[]>([
    {
      id: 1,
      name: "MacBook Pro M3",
      price: 2499,
      image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
      images: [
        "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      category: "Electronics",
      categoryId: 1,
      rating: 4.9,
      description: "Le MacBook Pro le plus avancé avec la puce M3 révolutionnaire.",
      stock: 15,
      featured: true,
      sku: "MBP-M3-16-512",
      tags: ["laptop", "apple", "m3", "professional"],
      variants: [
        { id: 1, name: "Storage", value: "512GB", price: 2499, stock: 15, sku: "MBP-M3-16-512" },
        { id: 2, name: "Storage", value: "1TB", price: 2799, stock: 8, sku: "MBP-M3-16-1TB" }
      ],
      reviews: [
        {
          id: 1,
          userId: 1,
          userName: "Jean Dupont",
          userAvatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
          rating: 5,
          title: "Excellent produit",
          comment: "Performance exceptionnelle, design magnifique. Je recommande vivement !",
          date: "2024-01-15",
          verified: true,
          helpful: 12
        }
      ],
      specifications: {
        "Processeur": "Apple M3",
        "Mémoire": "16GB",
        "Stockage": "512GB SSD",
        "Écran": "16 pouces Liquid Retina XDR",
        "Poids": "2.1 kg"
      },
      seoTitle: "MacBook Pro M3 - Performance Révolutionnaire",
      seoDescription: "Découvrez le MacBook Pro M3 avec des performances inégalées",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-20"
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      price: 1199,
      image: "https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800",
      images: [],
      category: "Electronics",
      categoryId: 1,
      rating: 4.8,
      description: "L'iPhone le plus avancé avec titanium et USB-C.",
      stock: 25,
      featured: true,
      sku: "IP15P-256",
      tags: ["smartphone", "apple", "iphone15"],
      variants: [],
      reviews: [],
      specifications: {},
      seoTitle: "iPhone 15 Pro",
      seoDescription: "iPhone 15 Pro",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-20"
    },
    {
      id: 3,
      name: "AirPods Pro",
      price: 279,
      image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800",
      images: [],
      category: "Audio",
      categoryId: 2,
      rating: 4.7,
      description: "Écouteurs sans fil avec suppression active du bruit.",
      stock: 50,
      featured: false,
      sku: "APP-2",
      tags: ["earbuds", "apple", "audio"],
      variants: [],
      reviews: [],
      specifications: {},
      seoTitle: "AirPods Pro",
      seoDescription: "AirPods Pro",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-20"
    },
    {
      id: 4,
      name: "iPad Air",
      price: 699,
      image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800",
      images: [],
      category: "Electronics",
      categoryId: 1,
      rating: 4.6,
      description: "Puissant, coloré et incroyablement fin.",
      stock: 30,
      featured: true,
      sku: "IPA-M1-256",
      tags: ["tablet", "apple", "ipad"],
      variants: [],
      reviews: [],
      specifications: {},
      seoTitle: "iPad Air",
      seoDescription: "iPad Air",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-20"
    },
    {
      id: 5,
      name: "Apple Watch Series 9",
      price: 429,
      image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800",
      images: [],
      category: "Wearables",
      categoryId: 3,
      rating: 4.5,
      description: "La montre connectée la plus avancée.",
      stock: 40,
      featured: false,
      sku: "AW9-45",
      tags: ["smartwatch", "apple", "wearable"],
      variants: [],
      reviews: [],
      specifications: {},
      seoTitle: "Apple Watch Series 9",
      seoDescription: "Apple Watch Series 9",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-20"
    },
    {
      id: 6,
      name: "Magic Keyboard",
      price: 199,
      image: "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800",
      images: [],
      category: "Accessories",
      categoryId: 4,
      rating: 4.4,
      description: "Clavier sans fil avec rétroéclairage.",
      stock: 60,
      featured: false,
      sku: "MK-1",
      tags: ["keyboard", "apple", "accessory"],
      variants: [],
      reviews: [],
      specifications: {},
      seoTitle: "Magic Keyboard",
      seoDescription: "Magic Keyboard",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-20"
    }
  ])
  
  const orders = ref<Order[]>([
    {
      id: 1001,
      items: [{ id: 1, product: products.value[0], quantity: 1 }],
      total: 2499,
      status: "Livré",
      date: "2024-01-15",
      customer: "Jean Dupont",
      customerId: 1,
      shippingAddress: {
        firstName: "Jean",
        lastName: "Dupont",
        address1: "123 Rue de Paris",
        city: "Paris",
        state: "IDF",
        postalCode: "75001",
        country: "France"
      },
      billingAddress: {
        firstName: "Jean",
        lastName: "Dupont",
        address1: "123 Rue de Paris",
        city: "Paris",
        state: "IDF",
        postalCode: "75001",
        country: "France"
      },
      paymentMethod: "Credit Card"
    },
    {
      id: 1002,
      items: [{ id: 2, product: products.value[1], quantity: 2 }],
      total: 2398,
      status: "En cours",
      date: "2024-01-16",
      customer: "Marie Martin",
      customerId: 2,
      shippingAddress: {
        firstName: "Marie",
        lastName: "Martin",
        address1: "456 Avenue de Lyon",
        city: "Lyon",
        state: "ARA",
        postalCode: "69001",
        country: "France"
      },
      billingAddress: {
        firstName: "Marie",
        lastName: "Martin",
        address1: "456 Avenue de Lyon",
        city: "Lyon",
        state: "ARA",
        postalCode: "69001",
        country: "France"
      },
      paymentMethod: "PayPal"
    }
  ])

  // Getters
  const cartTotal = computed(() => 
    cart.value.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  )
  
  const cartItemsCount = computed(() => 
    cart.value.reduce((total, item) => total + item.quantity, 0)
  )
  
  const wishlistCount = computed(() => wishlist.value.length)
  
  const featuredProducts = computed(() => 
    products.value.filter(product => product.featured)
  )

  const activeCategories = computed(() =>
    categories.value.filter(category => category.isActive)
  )

  // Actions
  const addToCart = (product: Product, quantity = 1) => {
    const existingItem = cart.value.find(item => item.product.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.value.push({
        id: Date.now(),
        product,
        quantity
      })
    }
  }

  const removeFromCart = (itemId: number) => {
    const index = cart.value.findIndex(item => item.id === itemId)
    if (index > -1) {
      cart.value.splice(index, 1)
    }
  }

  const updateCartItemQuantity = (itemId: number, quantity: number) => {
    const item = cart.value.find(item => item.id === itemId)
    if (item) {
      item.quantity = quantity
    }
  }

  const clearCart = () => {
    cart.value = []
  }

  const addToWishlist = (product: Product) => {
    const existingItem = wishlist.value.find(item => item.product.id === product.id)
    if (!existingItem) {
      wishlist.value.push({
        id: Date.now(),
        product,
        dateAdded: new Date().toISOString()
      })
    }
  }

  const removeFromWishlist = (productId: number) => {
    const index = wishlist.value.findIndex(item => item.product.id === productId)
    if (index > -1) {
      wishlist.value.splice(index, 1)
    }
  }

  const login = (userData: User) => {
    user.value = userData
    isAuthenticated.value = true
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    cart.value = []
    wishlist.value = []
  }

  const updateProductRating = (productId: number, newRating: number) => {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      product.rating = newRating
    }
  }
  return {
    cart,
    wishlist,
    user,
    isAuthenticated,
    products,
    categories,
    customers,
    orders,
    cartTotal,
    cartItemsCount,
    wishlistCount,
    featuredProducts,
    activeCategories,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    login,
    logout,
    updateProductRating
  }
})
