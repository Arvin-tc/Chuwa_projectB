import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const PORT = 3001;

// TODO http://localhost:3001?

export const fetchVisaApplications = createAsyncThunk(
    'hrVisa/fetchVisaApplications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:${PORT}/api/hr/visa/employees`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });
            console.log('fetched hr applications:', response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch visa applications for hr');
        }
    }
);

export const updateDocumentStatus = createAsyncThunk(
    'hrVisa/updateDocumentStatus',
    async ({ applicationId, docType, status, feedback }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `http://localhost:${PORT}/api/hr/visa/${applicationId}/document/${docType}`,
                {status, feedback}, // request Body
                { // axios conf
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
                }

            );
            return { applicationId, docType, status, feedback, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update document status');
        }
    }
);

export const sendReminder = createAsyncThunk(
    'hrVisa/sendReminder',
    async(applicationId, { rejectWithValue }) => {
        try {

            const response = await axios.post(`http://localhost:${PORT}/api/hr/visa/${applicationId}/notify`, {}, 
                {
                    headers: {

                        Authorization: `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.message?.data?.message || 'Failed to send email reminder');
        }
    }
);

const hrVisaSlice = createSlice({
    name: 'hrVisa',
    initialState: {
        applications: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVisaApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVisaApplications.fulfilled, (state, action) => {
                state.applications = action.payload;
                state.loading = false;
            })
            .addCase(fetchVisaApplications.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

        // TODO edit status here?
            .addCase(updateDocumentStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDocumentStatus.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateDocumentStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // reminder email
            .addCase(sendReminder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendReminder.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendReminder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default hrVisaSlice.reducer;
