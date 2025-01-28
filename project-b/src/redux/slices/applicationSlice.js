import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  pending: [],
  rejected: [],
  approved: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchApplicationsByStatus = createAsyncThunk(
  'applications/fetchByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/onboarding/applications?status=${status}`);
      return { status, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching applications');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status, feedback }, { rejectWithValue }) => {
    try {
      await axios.put(`/api/onboarding/applications/${id}/status`, { status, feedback });
      return { id, status, feedback };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating application status');
    }
  }
);

// Slice
const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch applications
      .addCase(fetchApplicationsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationsByStatus.fulfilled, (state, action) => {
        const validStatuses = ['pending', 'rejected', 'approved'];
        if (validStatuses.includes(action.payload.status.toLowerCase())) {
          state.loading = false;
          state[action.payload.status.toLowerCase()] = action.payload.data;
        } else {
          state.loading = false;
          state.error = 'Invalid status received.';
        }
      })
      .addCase(fetchApplicationsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update application status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const validStatuses = ['pending', 'rejected', 'approved'];
        if (validStatuses.includes(status.toLowerCase())) {
          ['pending', 'rejected', 'approved'].forEach((key) => {
            state[key] = state[key].filter((app) => app._id !== id);
          });
          state[status.toLowerCase()].push(action.payload);
        }
      });
  },
});

export default applicationSlice.reducer;
