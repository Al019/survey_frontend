import { useState } from "react"
import Inpt from "../../components/Input"
import Btn from "../../components/Button"
import { useAuthContext } from "../../contexts/AuthContext"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const { login, btnLoading } = useAuthContext()

  const handleLogin = (e) => {
    e.preventDefault()
    login(formData)
  }

  return (
    <form onSubmit={handleLogin} className='space-y-6'>
      <span className="font-semibold">Login</span>
      <div className="space-y-4">
        <Inpt onChange={(e) => setFormData({ ...formData, email: e.target.value })} label="Email Address" required />
        <div className="space-y-2">
          <Inpt onChange={(e) => setFormData({ ...formData, password: e.target.value })} label="Password" secureTextEntry required />
          <div className="flex justify-end">
            <span className="text-sm cursor-pointer hover:underline hover:text-green-500">Forgot Password</span>
          </div>
        </div>
      </div>
      <Btn type="submit" label="Login" color="green" loading={btnLoading} fullWidth />
    </form>
  )
}

export default Login