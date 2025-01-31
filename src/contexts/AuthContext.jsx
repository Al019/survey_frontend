import { createContext, useContext, useEffect, useState } from "react"
import axios from "../api/axios"
import { WebLoading } from "../components/Loading"

const auth = createContext({})

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null)
  const [errors, setErrors] = useState([])
  const [webLoading, setWebLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)

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
    setErrors([])
    setBtnLoading(true)
    await csrf()
    await axios.post("/login", formData)
      .then(() => {
        getUser()
      })
      .catch((error) => {
        const response = error.response
        if (response.data.errors) {
          setErrors(response.data.errors)
        }
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
    <auth.Provider value={{ user, errors, btnLoading, login, logout }}>
      {children}
    </auth.Provider>
  )
}

export const useAuthContext = () => useContext(auth)