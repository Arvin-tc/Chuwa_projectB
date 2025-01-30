import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const PORT = 3001;

export const fetchTokenHistory = createAsyncThunk(
    'hr/fetchTokenHistory',
    async(_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:${PORT}/api/hr/token-history`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch token history');
        }
    }
);

export const generateToken = createAsyncThunk(
    'hr/generateToken',
    async({ email, name }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`http://localhost:${PORT}/api/hr/generate-token`, { email, name });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to generate token');
        }
    }
);

export const fetchApplications = createAsyncThunk(
    'hr/fetchApplications',
    async (status, { rejectWithValue }) => {
        try{

            const response = await axios.get(`http://localhost:${PORT}/api/hr/applications/${status}`);
            console.log(`Fetched ${status} applications:`, response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch applications on status');
        }
    }
);

export const fetchApplicationById = createAsyncThunk(
    'hr/fetchApplication',
    async ( id, { rejectWithValue }) => {
        try{

            const response = await axios.get(`http://localhost:${PORT}/api/hr/application/${id}`);
            console.log(`fetched application by ${id}:`, response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch applications on Id');
        }
    }
);

export const updateApplicationStatus = createAsyncThunk(
    'hr/updateApplicationStatus',
    async ({ applicationId, status, feedback }, { rejectWithValue }) => {
        try {

            const response = await axios.patch(`http://localhost:${PORT}/api/hr/application/${applicationId}`, 
                {status, feedback});
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update application status');
        }
    }
);

const hrManagementSlice = createSlice({
    name: 'hr',
    initialState: {
        tokenHistory: [],
        applications: [],
        application: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTokenHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTokenHistory.fulfilled, (state, action) => {
                state.tokenHistory = action.payload;
                state.loading = false;
            })
            .addCase(fetchTokenHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(generateToken.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(generateToken.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(generateToken.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            
            // fetch by status
            .addCase(fetchApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplications.fulfilled, (state, action) => {
                state.applications = [
                    ...state.applications.filter(app => 
                        !action.payload.some(newApp => newApp._id === app._id) // Prevent duplicates
                    ), 
                    ...action.payload
                ];
                state.loading = false;
            })
            .addCase(fetchApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetch by id
            .addCase(fetchApplicationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplicationById.fulfilled, (state, action) => {
                state.application = action.payload;
                state.loading = false;
            })
            .addCase(fetchApplicationById.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

        // update actions
            .addCase(updateApplicationStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateApplicationStatus.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateApplicationStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default hrManagementSlice.reducer;
