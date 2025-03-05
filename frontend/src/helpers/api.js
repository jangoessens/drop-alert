import axios from 'axios';


export const axiosInstance = axios.create({
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