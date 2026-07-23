import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerAdmin = createAsyncThunk(
  'auth/registerAdmin',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', data);
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const getCurrentAdmin = createAsyncThunk(
  'auth/getCurrentAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data.admin;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch admin');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: typeof window !== 'undefined' ? localStorage.getItem('adminToken') || null : null,
    isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false,
    isLoading: false,
    error: null,
    admin: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('adminToken');
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.admin = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.admin = action.payload.admin;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.admin = action.payload.admin;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Get current admin
    builder
      .addCase(getCurrentAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload;
      })
      .addCase(getCurrentAdmin.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
