import axiosClient from '../axiosClient';
import { fetchAzureData, setLoading, setError } from '../slices/azureSlice';


export const getAzureData = (queryParams = {}) => async (dispatch) => {
    try {
        dispatch(setLoading(true));


        let response = await axiosClient({
            method: "GET",
            url: `/api/azure`,
            params: queryParams,
        });

        if (response.status === 200) {
            dispatch(fetchAzureData(response.data));
            console.log(response?.data,'data')
        } else {
            dispatch(setError("Unexpected response status: " + response.status));
        }
    } catch (error) {
        dispatch(setError(error.message || "Something went wrong"));
    } finally {
        dispatch(setLoading(false));
    }
};
