import { useState } from "react"
import Btn from "../../components/Button"
import Inpt from "../../components/Input"
import { useAuthContext } from "../../contexts/AuthContext"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const { forgotPassword, btnLoading } = useAuthContext()

  const handleSend = (e) => {
    e.preventDefault()
    forgotPassword(email)
  }

  return (
    <form onSubmit={handleSend} className='space-y-6'>
      <span className="font-semibold text-green-500">Forgot Password</span>
      <div className="space-y-4">
        <Inpt onChange={(e) => setEmail(e.target.value)} label="Email Address" variant="standard" required />
      </div>
      <Btn type="submit" label="Send" color="green" variant="outlined" loading={btnLoading} fullWidth />
    </form>
  )
}

export default ForgotPassword