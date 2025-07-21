import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000', // Use base path if needed
});

export default axiosClient;