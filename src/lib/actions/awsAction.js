import axiosClient from '../axiosClient';
import { fetchAwsVmwareData, fetchAwsRdsData, fetchAwsSthreeData, resetState, fetchAwsSthreeGlacierData, setLoading, setError } from '../slices/awsSlice';



export const getAwsVMwareData = (queryParams = {}) => async (dispatch) => {
    try {
        dispatch(setLoading(true));


        let response = await axiosClient({
            method: "GET",
            url: `/api/aws/vmware`,
            params: queryParams,
        });

        if (response.status === 200) {
            dispatch(fetchAwsVmwareData(response.data));
            console.log(response?.data, 'VMWARE data')
        } else {
            dispatch(setError("Unexpected response status: " + response.status));
        }
    } catch (error) {
        dispatch(setError(error.message || "Something went wrong"));
    } finally {
        dispatch(setLoading(false));
    }
};

export const getAwsRdsData = (queryParams = {}) => async (dispatch) => {
    try {
        dispatch(setLoading(true));


        let response = await axiosClient({
            method: "GET",
            url: `/api/aws/RDS`,
            params: queryParams,
        });

        if (response.status === 200) {
            dispatch(fetchAwsRdsData(response.data));
            console.log(response?.data, 'RDS data')
        } else {
            dispatch(setError("Unexpected response status: " + response.status));
        }
    } catch (error) {
        dispatch(setError(error.message || "Something went wrong"));
    } finally {
        dispatch(setLoading(false));
    }
};


export const getAwsSthreeData = (queryParams = {}) => async (dispatch) => {
    try {
        dispatch(setLoading(true));


        let response = await axiosClient({
            method: "GET",
            url: `/api/aws/sThree`,
            params: queryParams,
        });

        if (response.status === 200) {
            dispatch(fetchAwsSthreeData(response.data));
            console.log(response?.data, 'SThree data')
        } else {
            dispatch(setError("Unexpected response status: " + response.status));
        }
    } catch (error) {
        dispatch(setError(error.message || "Something went wrong"));
    } finally {
        dispatch(setLoading(false));
    }
};

export const getAwsSthreeGlacierData = (queryParams = {}) => async (dispatch) => {
    try {
        dispatch(setLoading(true));


        let response = await axiosClient({
            method: "GET",
            url: `/api/aws/sThreeGlacier`,
            params: queryParams,
        });

        if (response.status === 200) {
            dispatch(fetchAwsSthreeGlacierData(response.data));
            console.log(response?.data, 'SThree Glacier data')
        } else {
            dispatch(setError("Unexpected response status: " + response.status));
        }
    } catch (error) {
        dispatch(setError(error.message || "Something went wrong"));
    } finally {
        dispatch(setLoading(false));
    }
};