import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderService from '../../services/orderService'

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await orderService.getOrders()
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const fetchOrderDetail = createAsyncThunk(
  'orders/fetchOrderDetail',
  async (id, { rejectWithValue }) => {
    try {
      const data = await orderService.getOrder(id)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await orderService.createOrder(orderData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false
        state.items = Array.isArray(action.payload) ? action.payload : action.payload.results || []
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearOrderError } = orderSlice.actions
export default orderSlice.reducer
