import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AuthLayout from "./layouts/AuthLayout"
import Login from "./pages/auth/Login"
import DefaultLayout from "./layouts/DefaultLayout"
import AdminDashboard from "./pages/default/admin/dashboard/Dashboard"
import Enumerator from "./pages/default/admin/enumerators/Enumerator"
import AdminSurvey from "./pages/default/admin/surveys/Survey"
import Create from "./pages/default/admin/surveys/Create"
import { useAuthContext } from "./contexts/AuthContext"
import EnumeratorDashboard from "./pages/default/enumerator/dashboard/Dashboard"
import EnumeratorSurvey from "./pages/default/enumerator/surveys/Survey"
import EnumeratorForm from "./pages/default/enumerator/surveys/Form"
import View from "./pages/default/admin/surveys/View"
import Information from "./pages/default/admin/enumerators/Information"

const App = () => {
  const { user } = useAuthContext()

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthLayout />}>
          <Route path='/' element={<Navigate to='/login' />} />
          <Route path='/login' element={<Login />} />
        </Route>

        {user ? (
          <Route path='/' element={<DefaultLayout />}>

            {user?.role === 'admin' && (
              <>
                <Route path='/admin/dashboard' element={<AdminDashboard />} />
                <Route path='/admin/enumerators' element={<Enumerator />} />
                <Route path='/admin/enumerators/:enumerator_id' element={<Information />} />
                <Route path='/admin/surveys' element={<AdminSurvey />} />
                <Route path='/admin/surveys/create' element={<Create />} />
                <Route path='/admin/surveys/:uuid' element={<View />} />
              </>
            )}

            {user?.role === 'enumerator' && (
              <>
                <Route path='/enumerator/dashboard' element={<EnumeratorDashboard />} />
                <Route path='/enumerator/surveys' element={<EnumeratorSurvey />} />
                <Route path='/enumerator/surveys/:uuid' element={<EnumeratorForm />} />
              </>
            )}

          </Route>
        ) : (
          <Route path='*' element={<Navigate to='/login' />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App