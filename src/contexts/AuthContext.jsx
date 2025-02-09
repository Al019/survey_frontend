import { createContext, useContext, useEffect, useState } from "react"
import axios from "../api/axios"
import { WebLoading } from "../components/Loading"

const auth = createContext({})

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState({})
  const [webLoading, setWebLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const csrf = () => axios.get("/sanctum/csrf-cookie")

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    await axios.get("/api/user")
      .then(({ data }) => {
        setUser(data)
      })
      .finally(() => {
        setWebLoading(false)
      })
  }

  const login = async (formData) => {
    setError([])
    setBtnLoading(true)
    await csrf()
    await axios.post("/login", formData)
      .then(() => {
        getUser()
      })
      .catch((error) => {
        const response = error.response
        setError(response.data)
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const changePassword = async (formData) => {
    setError([])
    setBtnLoading(true)
    await axios.post("/change-password", formData)
      .then(() => {
        getUser()
      })
      .catch((error) => {
        const response = error.response
        setError(response.data)
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const forgotPassword = async (email) => {
    setError([])
    setStatus(null)
    setBtnLoading(true)
    await csrf()
    await axios.post("/forgot-password", { email })
      .then(({ data }) => {
        setStatus(data.status)
      })
      .catch((error) => {
        const response = error.response
        setError(response.data)
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const resetPassword = async ({ ...data }) => {
    setError([])
    setStatus(null)
    setBtnLoading(true)
    await csrf()
    await axios.post("/reset-password", data)
      .then(({ data }) => {
        setStatus(data.status)
      })
      .catch((error) => {
        const response = error.response
        setError(response.data)
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const logout = async () => {
    await axios.post("/logout")
      .then(() => {
        setUser(null)
      })
  }

  if (webLoading) return <WebLoading />

  return (
    <auth.Provider value={{ user, status, error, btnLoading, login, changePassword, forgotPassword, resetPassword, logout }}>
      {children}
    </auth.Provider>
  )
}

export const useAuthContext = () => useContext(auth)