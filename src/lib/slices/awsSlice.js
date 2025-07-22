"use client";


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    awsVmware: {},
    awsRds: {},
    awsSthree: {},
    awsSthreeGlacier: {},
    loading: false,
    error: null,
};

export const AwsSlice = createSlice({
    name: "AWSCostData",
    initialState,
    reducers: {
        fetchAwsVmwareData: (state, action) => {
            state.awsVmware = action.payload !== undefined ? action.payload : {};
            state.awsRds = {};
            state.awsSthree = {};
            state.awsSthreeGlacier = {};
        },
        fetchAwsRdsData: (state, action) => {
            state.awsRds = action.payload !== undefined ? action.payload : {};
            state.awsVmware = {};
            state.awsSthree = {};
            state.awsSthreeGlacier = {};
        },
        fetchAwsSthreeData: (state, action) => {
            state.awsSthree = action.payload !== undefined ? action.payload : {};
            state.awsVmware = {};
            state.awsRds = {};
        },
        fetchAwsSthreeGlacierData: (state, action) => {
            state.awsSthreeGlacier = action.payload !== undefined ? action.payload : {};
            state.awsVmware = {};
            state.awsRds = {};
        },
        resetState: (state) => {
            state.awsVmware = {};
            state.awsRds = {};
            state.awsSthree = {};
            state.awsSthreeGlacier = {};
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

export const { fetchAwsVmwareData, fetchAwsRdsData, fetchAwsSthreeData, fetchAwsSthreeGlacierData, resetState, setLoading, setError } = AwsSlice.actions;
export default AwsSlice.reducer;