"use client";


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    comparisionService: '',
    loading: false,
    error: null,
};

export const ServicesFilterSlice = createSlice({
    name: "servicesFilteration",
    initialState,
    reducers: {
        setServiceMainFilter: (state, action) => {
            state.comparisionService = action.payload;
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

export const { setServiceMainFilter, resetState, setLoading, setError } = ServicesFilterSlice.actions;
export default ServicesFilterSlice.reducer;