import { Card } from "@material-tailwind/react"
import Navigation from "../components/Navigation"
import { Outlet } from "react-router-dom"

const DefaultLayout = () => {
  return (
    <div>
      <Card className="fixed h-[calc(100vh)] w-[272px] p-2 overflow-y-scroll rounded-none" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <Navigation />
      </Card>
      <div className="ml-[272px]">
        <div className="mx-auto max-w-[1280px]">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout