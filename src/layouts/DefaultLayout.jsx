import { Badge, Card, Drawer, IconButton, Input } from "@material-tailwind/react"
import Navigation from "../components/Navigation"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Bars3BottomLeftIcon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useAuthContext } from "../contexts/AuthContext"
import { SecurityAlert } from "../components/Dialog"

const DefaultLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [securityOpen, setSecurityOpen] = useState(false)
  const route = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthContext()

  useEffect(() => {
    const securityAlert = () => {
      if (user?.is_default === 0 && route.pathname !== `/${user?.role}/profile`) {
        setSecurityOpen(true)
      } else {
        setSecurityOpen(false)
      }
    }
    securityAlert()
  }, [user, route])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 959) {
        setDrawerOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <div>
      <Card className="fixed h-[calc(100vh)] w-[272px] p-2 overflow-y-scroll rounded-none shadow-none border-r max-lg:hidden" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <Navigation setDrawerOpen={() => setDrawerOpen(false)} />
      </Card>
      <Drawer placement='left' open={drawerOpen} onClose={() => setDrawerOpen(!drawerOpen)} className='p-2 overflow-y-scroll w-[272px]'>
        <Navigation setDrawerOpen={() => setDrawerOpen(false)} />
      </Drawer>
      <div className="lg:ml-[272px]">
        <div className="z-10 p-4 max-sm:p-2 sticky top-0 grid grid-cols-2 items-center bg-white border-b">
          <div className="flex items-center gap-4">
            <IconButton onClick={() => setDrawerOpen(!drawerOpen)} variant="text" className="lg:hidden">
              <Bars3BottomLeftIcon className="size-6 opacity-60" />
            </IconButton>
            <div className='w-full max-w-[250px]'>
              <Input variant="standard" color="green" label="Search" />
            </div>
          </div>
          <div className="flex justify-end">
            <Badge>
              <IconButton variant="text">
                <BellIcon className="size-6" color="orange" />
              </IconButton>
            </Badge>
          </div>
        </div>
        <div className="mx-auto max-w-[1280px]">
          <Outlet />
        </div>
      </div>

      <SecurityAlert open={securityOpen} onClick={() => {
        setSecurityOpen(!securityOpen)
        navigate(`/${user?.role}/profile`)
      }} />
    </div>
  )
}

export default DefaultLayout