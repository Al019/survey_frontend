import { Card, Drawer, IconButton } from "@material-tailwind/react"
import Navigation from "../components/Navigation"
import { Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline"

const DefaultLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

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
        <Navigation />
      </Card>
      <Drawer placement='left' open={drawerOpen} onClose={() => setDrawerOpen(!drawerOpen)} className='p-2 overflow-y-scroll w-[272px]'>
        <Navigation />
      </Drawer>
      <div className="lg:ml-[272px]">
        <div className="z-10 p-2 sticky top-0 bg-white border-b lg:hidden">
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)} variant="text">
            <Bars3BottomLeftIcon className="size-6 opacity-60" />
          </IconButton>
        </div>
        <div className="mx-auto max-w-[1280px]">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout