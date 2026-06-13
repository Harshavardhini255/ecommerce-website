import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import cartService from '../../services/cartService'

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartService.getCart()
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      await cartService.addToCart(productId, quantity)
      const cart = await cartService.getCart()
      return cart
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      await cartService.updateCartItem(itemId, quantity)
      const cart = await cartService.getCart()
      return cart
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      await cartService.removeFromCart(itemId)
      const cart = await cartService.getCart()
      return cart
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart()
      return { items: [], total_items: 0, subtotal: 0, total: 0 }
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
    subtotal: 0,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCartError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || []
        state.totalItems = action.payload.total_items || 0
        state.subtotal = action.payload.subtotal || 0
        state.total = action.payload.total || 0
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || []
        state.totalItems = action.payload.total_items || 0
        state.subtotal = action.payload.subtotal || 0
        state.total = action.payload.total || 0
      })
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || []
        state.totalItems = action.payload.total_items || 0
        state.subtotal = action.payload.subtotal || 0
        state.total = action.payload.total || 0
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items || []
        state.totalItems = action.payload.total_items || 0
        state.subtotal = action.payload.subtotal || 0
        state.total = action.payload.total || 0
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = []
        state.totalItems = 0
        state.subtotal = 0
        state.total = 0
      })
  },
})

export const { clearCartError } = cartSlice.actions
export default cartSlice.reducer
