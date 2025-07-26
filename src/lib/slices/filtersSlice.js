"use client";


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    comparisionService: '',
    countryName: '',
    type: '',
    generalizeMeasureUnit: '',
    filterloading: false,
    error: null,
    page: 1,
    limit: 100,
    azurePage: 1,
    azureLimit: 100,
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
            state.filterloading = false;
            state.error = null;
        },
        setCountryName: (state, action) => {
            state.countryName = action.payload;
        },
        setGeneralizeMeasureUnit: (state, action) => {
            state.generalizeMeasureUnit = action.payload;
        },
        setType: (state, action) => {
            state.type = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setLimit: (state, action) => {
            state.limit = action.payload;
        },
        setAzurePage: (state, action) => {
            state.azurePage = action.payload;
        },
        setAzureLimit: (state, action) => {
            state.azureLimit = action.payload;
        },
        setLoading: (state, action) => {
            state.filterloading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.filterloading = false;
        },
    },
});

export const { setServiceMainFilter, resetState, setLoading, setError, setPage, setLimit, setCountryName, setType, setGeneralizeMeasureUnit,
    setAzurePage, setAzureLimit
} = ServicesFilterSlice.actions;
export default ServicesFilterSlice.reducer;