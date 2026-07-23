import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const createPage = createAsyncThunk(
  'pages/createPage',
  async (pageData, { rejectWithValue }) => {
    try {
      const response = await api.post('/pages', pageData);
      return response.data.page;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create page');
    }
  }
);

export const updatePage = createAsyncThunk(
  'pages/updatePage',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/pages/${id}`, data);
      return response.data.page;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update page');
    }
  }
);

export const getPage = createAsyncThunk(
  'pages/getPage',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pages/${id}`);
      return response.data.page;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch page');
    }
  }
);

export const listPages = createAsyncThunk(
  'pages/listPages',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/pages', { params });
      return {
        pages: response.data.pages,
        pagination: response.data.pagination,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch pages');
    }
  }
);

export const deletePage = createAsyncThunk(
  'pages/deletePage',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/pages/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete page');
    }
  }
);

export const publishPage = createAsyncThunk(
  'pages/publishPage',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/pages/${id}/publish`);
      return response.data.page;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to publish page');
    }
  }
);

export const unpublishPage = createAsyncThunk(
  'pages/unpublishPage',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/pages/${id}/unpublish`);
      return response.data.page;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to unpublish page');
    }
  }
);

const pagesSlice = createSlice({
  name: 'pages',
  initialState: {
    pages: [],
    currentPage: null,
    isLoading: false,
    error: null,
    pagination: { total: 0, page: 1, limit: 10, pages: 0 },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCurrentPage: (state) => {
      state.currentPage = null;
    },
  },
  extraReducers: (builder) => {
    // Create Page
    builder
      .addCase(createPage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pages.unshift(action.payload);
      })
      .addCase(createPage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Page
    builder
      .addCase(updatePage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.pages.findIndex((p) => p._id === action.payload._id);
        if (index > -1) {
          state.pages[index] = action.payload;
        }
        state.currentPage = action.payload;
      })
      .addCase(updatePage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Get Page
    builder
      .addCase(getPage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPage = action.payload;
      })
      .addCase(getPage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // List Pages
    builder
      .addCase(listPages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(listPages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pages = action.payload.pages;
        state.pagination = action.payload.pagination;
      })
      .addCase(listPages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete Page
    builder
      .addCase(deletePage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pages = state.pages.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Publish Page
    builder
      .addCase(publishPage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(publishPage.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.pages.findIndex((p) => p._id === action.payload._id);
        if (index > -1) {
          state.pages[index] = action.payload;
        }
        state.currentPage = action.payload;
      })
      .addCase(publishPage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Unpublish Page
    builder
      .addCase(unpublishPage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unpublishPage.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.pages.findIndex((p) => p._id === action.payload._id);
        if (index > -1) {
          state.pages[index] = action.payload;
        }
        state.currentPage = action.payload;
      })
      .addCase(unpublishPage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetCurrentPage } = pagesSlice.actions;
export default pagesSlice.reducer;
