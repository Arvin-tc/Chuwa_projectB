import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/hr/profiles';

export const fetchEmployeeProfiles = createAsyncThunk('hrEmployee/fetchProfiles', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
        });
        console.log('hr fetched employees:', response.data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
});

const hrEmployeeSlice = createSlice({
    name: 'hrEmployee',
    initialState: {
        employees: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployeeProfiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeProfiles.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload;
            })
            .addCase(fetchEmployeeProfiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default hrEmployeeSlice.reducer;
