import { useEffect, useState } from "react"
import Btn from "../../components/Button"
import Inpt from "../../components/Input"
import { useParams, useSearchParams } from "react-router-dom"
import { useAuthContext } from "../../contexts/AuthContext"

const ResetPassword = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password_confirmation, setPasswordConfirmation] = useState("")
  const { token } = useParams()
  const [searchParams] = useSearchParams()
  const { resetPassword, btnLoading } = useAuthContext()

  useEffect(() => {
    setEmail(searchParams.get("email"))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    resetPassword({ email, password, password_confirmation, token })
  }

  return (
    <form onSubmit={handleSave} className='space-y-6'>
      <span className="font-semibold text-green-500">Reset Password</span>
      <div className="space-y-4">
        <Inpt onChange={(e) => setPassword(e.target.value)} label="New Password" variant="standard" required secureTextEntry />
        <Inpt onChange={(e) => setPasswordConfirmation(e.target.value)} label="Confirm Password" variant="standard" required secureTextEntry />
      </div>
      <Btn type="submit" label="Sent" color="green" variant="outlined" loading={btnLoading} fullWidth />
    </form>
  )
}

export default ResetPassword