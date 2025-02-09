import { useState } from "react"
import Inpt from "../../components/Input"
import Btn from "../../components/Button"
import { useAuthContext } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const { login, btnLoading } = useAuthContext()
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    login(formData)
  }

  return (
    <form onSubmit={handleLogin} className='space-y-6'>
      <span className="font-semibold text-green-500">Login</span>
      <div className="space-y-4">
        <Inpt onChange={(e) => setFormData({ ...formData, email: e.target.value })} label="Email Address" variant="standard" required />
        <div className="space-y-2">
          <Inpt onChange={(e) => setFormData({ ...formData, password: e.target.value })} label="Password" secureTextEntry variant="standard" required />
          <div className="flex justify-end">
            <span onClick={() => navigate('/forgot-password')} className="text-blue-gray-500 text-sm cursor-pointer hover:underline hover:text-green-500">Forgot Password</span>
          </div>
        </div>
      </div>
      <Btn type="submit" label="Sign In" color="green" loading={btnLoading} variant="outlined" fullWidth />
    </form>
  )
}

export default Login