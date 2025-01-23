import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {act} from 'react';
const PORT = 3001;

export const fetchOnboardingData = createAsyncThunk(
    'onboarding/fetchData',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get(`http://localhost:${PORT}/api/onboarding`, {
                
                headers: {Authorization: `Bearer ${localStorage.getItem('jwt')}`},
            });
            console.log('fetchOnboardingData: ', response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'Error fetching onboarding data');
        }
    }
);

export const submitOnboarding = createAsyncThunk(
    'onboarding/submitApplication',
    async (formData, {rejectWithValue}) => {
        try {
            const response = await axios.post(`http://localhost:${PORT}/api/onboarding`, formData, {
                headers: {
                                       Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'Error submitting onboarding application');
        }
    }
);

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState: {
        status: '',
        application: {},
        feedback: '',
        loading: false,
        error: null,
        email: '',
    },
    reducers: {
        resetOnbaordingState: (state) => {
            state.status = '';
            state.application = {};
            state.feedback = '';
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOnboardingData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOnboardingData.fulfilled, (state, action) => {
                state.loading = false;
                state.application = action.payload.application || {};
                state.email = action.payload.email || '';
                state.feedback = action.payload.feedback || '';
                state.status = action.payload.status;
            })
            .addCase(fetchOnboardingData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(submitOnboarding.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitOnboarding.fulfilled, (state) => {
                state.loading = false;
                state.status = 'Pending';
            })
            .addCase(submitOnboarding.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetOnbaordingState } = onboardingSlice.actions;
export default onboardingSlice.reducer;
