import axios from 'axios';

const baseURL = 'your_base_url_here'; // Replace with your actual base URL

export const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }
});

export const getRequest = async (endpoint) => {
    try {
        const res = await axiosInstance.get(endpoint);
        return res.data;
    } catch (err) {
        alert("Something went wrong");
        throw err;
    }
};