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
            const response = await axios.post(`http://localhost:${POST}/api/hr/generate-token`, { email, name });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to generate token');
        }
    }
)
