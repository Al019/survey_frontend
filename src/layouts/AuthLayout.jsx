import { Navigate, Outlet } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"
import { Alert, Card, CardBody } from "@material-tailwind/react"
import Logo from '../assets/images/logo.png'

const AuthLayout = () => {
  const { user, error, status } = useAuthContext()

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" />
  } else if (user?.role === 'enumerator') {
    return <Navigate to="/enumerator/dashboard" />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 max-sm:p-2">
      <Card className="w-full max-w-sm shadow-none">
        <CardBody className="space-y-6 max-sm:p-4">
          <div className="flex justify-center items-center">
            <img src={Logo} className="object-contain size-20" />
          </div>
          {error.message && (
            <Alert variant="outlined" color="red">
              <span className="text-sm">
                {error.message}
              </span>
            </Alert>
          )}
          {status && (
            <Alert variant="outlined" color="green">
              <span className="text-sm">
                {status}
              </span>
            </Alert>
          )}
          <Outlet />
        </CardBody>
      </Card>
    </div>
  )
}

export default AuthLayout