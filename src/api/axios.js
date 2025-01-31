import axiosClient from "axios"

const axios = axiosClient.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  withXSRFToken: true,
})

export default axios