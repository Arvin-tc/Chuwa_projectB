import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const PORT = 3001;

export const fetchPersonalInfo = createAsyncThunk(
    'personalInfo/fetch',
    async(_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:${PORT}/api/personal-info`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });

            console.log("fetched user info:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching personal info:", error.response || error.message);
            return rejectWithValue(error.response.data || 'Error fetching personal info');
        }
    }
);

export const updatePersonalInfo = createAsyncThunk(
    'personalInfo/update',
    async(updates, { rejectWithValue }) => {
        try{
            const response = await axios.patch(`http://localhost:${PORT}/api/personal-info`,
                updates,
                {
                headers: {
                    
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    'Content-Type': 'application/json'
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'Error updating personal info');
        }
    }
);

const personalInfoSlice = createSlice({
    name: 'personalInfo',
    initialState: {
        details: null,
        uploadedFiles: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPersonalInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPersonalInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.details = action.payload.details;
                state.uploadedFiles = action.payload.uploadedFiles;
            })
            .addCase(fetchPersonalInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePersonalInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.details = action.payload;
            })
            .addCase(updatePersonalInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default personalInfoSlice.reducer;

