import axiosClient from "axios"

const axios = axiosClient.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
})

export default axios