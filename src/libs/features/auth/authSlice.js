// redux/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching user details
export const fetchUserDetails = createAsyncThunk(
    'auth/fetchUserDetails',
    async (uid, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/getUser', { userId: uid });
            return response.data; // Assumes response contains user details in `data`
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: error.message });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        uid: null,
        userDetails: null,
        loading: false,
        error: null,
    },
    reducers: {
        setUID: (state, action) => {
            state.uid = action.payload;
        },
        clearAuth: (state) => {
            state.uid = null;
            state.userDetails = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.userDetails = action.payload;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setUID, clearAuth } = authSlice.actions;

export default authSlice.reducer;
