import { Navigate, Outlet } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"
import { Card, CardBody } from "@material-tailwind/react"
import Logo from '../assets/images/logo.png'

const AuthLayout = () => {
  const { user } = useAuthContext()

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" />
  } else if (user?.role === 'enumerator') {
    return <Navigate to="/enumerator/dashboard" />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 max-sm:p-2">
      <Card className="w-full max-w-sm">
        <CardBody className="space-y-6 max-sm:p-4">
          <div className="flex justify-center items-center">
            <img src={Logo} className="object-contain size-20" />
          </div>
          <Outlet />
        </CardBody>
      </Card>
    </div>
  )
}

export default AuthLayout