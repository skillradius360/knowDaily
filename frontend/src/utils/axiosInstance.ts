import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "https://backend.syncmaster420l.workers.dev/",
    headers: {
        "Content-Type": "application/json",
        "timeout": 1000,
        " Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin",
        "Access-Control-Allow-Credentials": true

    }
})