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
            // console.log('fetch visa slice response:', response.data);
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
        console.log('doctype:', fileType);
        console.log('file:', file);
            if (!fileType || !file) {
                throw new Error('Missing fileType or file.');
            }

            const formData = new FormData();
            formData.append('fileType', fileType);
            formData.append('file', file);
            formData.append('isVisaDoc', true);

            const response = await axios.patch(`http://localhost:${PORT}/api/uploads`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            return { fileType, ...response.data };
        } catch (error) {
            console.error('Visa upload failed:', error);
            return rejectWithValue(error.response?.data || { message: 'Error uploading document' });
        }
    }
);

export const updateVisaStatus = createAsyncThunk(
    'visa/updateVisaStatus',
    async ({ applicationId, status }, { rejectWithValue }) => {
        try {
            console.log('reducer:', applicationId);
            const response = await axios.patch(`http://localhost:${PORT}/api/visa/${applicationId}`, { status },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error update document status' });
        }
    }
);


const visaSlice = createSlice({
    name: 'visa',
    initialState: {
        appId: null,
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
                state.appId = action.payload.appId;
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
            })
            .addCase(updateVisaStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVisaStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.status = action.payload.status;
            })
            .addCase(updateVisaStatus.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export default visaSlice.reducer;
