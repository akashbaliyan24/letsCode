import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL:import.meta.env.MODE === "development" ? "http://localhost:8080/api/v1" : " https://leetlab-backend-mmsl.onrender.com/api/v1",
    withCredentials : true,
})

// axiosInstance.interceptors.request.use((config) =>{
//     const token = localStorage.getItem("token")
//     if(token){
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config;
// })