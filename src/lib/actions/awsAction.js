import axiosClient from '../axiosClient';
import { fetchAwsVmwareData, fetchAwsRdsData, fetchAwsSthreeData, resetState, setLoading, setError } from '../slices/awsSlice';



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
            console.log(response?.data, 'data')
        } else {
            dispatch(setError("Unexpected response status: " + response.status));
        }
    } catch (error) {
        dispatch(setError(error.message || "Something went wrong"));
    } finally {
        dispatch(setLoading(false));
    }
};