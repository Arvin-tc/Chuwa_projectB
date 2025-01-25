import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const PORT = 3001;

export const fetchVisaStatus = createAsyncThunk(
    'visa/fetchStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:${PORT}/api/visa`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });
            console.log('fetch visa slice response:', response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'Error fetching visa status');
        }
    }
);

export const uploadVisaDoc = createAsyncThunk(
    'visa/uploadDoc',
    async ({ fileType, file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('fileType', fileType);
            formData.append('file', file);
            formData.append('isVisaDoc', true);

            const response = await axios.patch(`http://localhost:${POST}/api/upload`, formData, {
                headers: {
                    
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            return { fileType, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response.data || 'Error uploading document');
        }
    }
);

const visaSlice = createSlice({
    name: 'visa',
    initialState: {
        visaDocuments: {},
        status: null,
        feedback: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVisaStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchVisaStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.visaDocuments = action.payload.visaDocument;
                state.status = action.payload.status;
                state.feedback = action.payload.feedback;
            })
            .addCase(fetchVisaStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(uploadVisaDoc.fulfilled, (state, action) => {
                state.visaDocuments = action.payload.visaDocument;
                state.status = 'Pending';
            })
            .addCase(uploadVisaDoc.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default visaSlice.reducer;
