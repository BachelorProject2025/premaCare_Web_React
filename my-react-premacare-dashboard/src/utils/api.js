import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // spring boot api
 

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
