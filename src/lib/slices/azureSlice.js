"use client";


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    azure: {},
    loading: false,
    error: null,
};

export const AzureSlice = createSlice({
    name: "azureCostData",
    initialState,
    reducers: {
        fetchAzureData: (state, action) => {
            state.azure = action.payload !== undefined ? action.payload : {};
        },
        resetState: (state) => {
            state.azure = {};
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { fetchAzureData, resetState, setLoading, setError } = AzureSlice.actions;
export default AzureSlice.reducer;
