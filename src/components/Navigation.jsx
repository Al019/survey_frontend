import { Accordion, AccordionBody, AccordionHeader, List, ListItem, ListItemPrefix } from "@material-tailwind/react"
import { ArrowsUpDownIcon, ChevronDownIcon, ChevronRightIcon, DocumentDuplicateIcon, DocumentTextIcon, FolderIcon, PresentationChartLineIcon, UsersIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import Logo from '../assets/images/logo.png'
import User from '../assets/images/user.png'
import { useLocation, useNavigate } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"

const Navigation = () => {
  const [open, setOpen] = useState(0)
  const navigate = useNavigate()
  const route = useLocation()
  const { user, logout } = useAuthContext()

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value)
  }

  return (
    <div>
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <img src={Logo} className="object-contain size-12" />
          <span className="text-green-500 font-bold text-xl tracking-wide">DITADS</span>
        </div>
      </div>
      <List>
        <h1 className="font-medium text-sm my-2 capitalize">
          {user?.role}
        </h1>
        <Accordion open={open === 1} icon={<ChevronDownIcon strokeWidth={2.5} className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`} />} >
          <ListItem className="p-0">
            <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
              <ListItemPrefix>
                <img src={User} className="h-8 w-8" />
              </ListItemPrefix>
              <span className="mr-auto text-sm font-normal">
                {user?.first_name} {user?.last_name}
              </span>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                </ListItemPrefix>
                <span className="mr-auto text-sm">My Profile</span>
              </ListItem>
              <ListItem onClick={() => logout()}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                </ListItemPrefix>
                <span className="mr-auto text-sm">Logout</span>
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <hr className="m-2 border-blue-gray-200" />
        {user?.role === 'admin' && (
          <div className="space-y-2">
            <ListItem onClick={() => {
              navigate(`/admin/dashboard`)
            }} className={`focus:bg-green-500 focus:text-white ${route.pathname === `/admin/dashboard` && 'bg-green-500 text-white hover:bg-green-500 hover:text-white'}`}>
              <ListItemPrefix>
                <PresentationChartLineIcon className="h-5 w-5" />
              </ListItemPrefix>
              <span className="mr-auto text-sm font-normal">Dashboard</span>
            </ListItem>
            <ListItem onClick={() => {
              navigate(`/admin/enumerators`)
            }} className={`focus:bg-green-500 focus:text-white ${route.pathname === `/admin/enumerators` && 'bg-green-500 text-white hover:bg-green-500 hover:text-white'}`}>
              <ListItemPrefix>
                <UsersIcon className="h-5 w-5" />
              </ListItemPrefix>
              <span className="mr-auto text-sm font-normal">Enumerators</span>
            </ListItem>
            <ListItem onClick={() => {
              navigate(`/admin/surveys`)
            }} className={`focus:bg-green-500 focus:text-white ${route.pathname === `/admin/surveys` && 'bg-green-500 text-white hover:bg-green-500 hover:text-white'}`}>
              <ListItemPrefix>
                <DocumentDuplicateIcon className="h-5 w-5" />
              </ListItemPrefix>
              <span className="mr-auto text-sm font-normal">Surveys</span>
            </ListItem>
          </div>
        )}
        {user?.role === 'enumerator' && (
          <div className="space-y-2">
            <ListItem onClick={() => {
              navigate(`/enumerator/dashboard`)
            }} className={`focus:bg-green-500 focus:text-white ${route.pathname === `/enumerator/dashboard` && 'bg-green-500 text-white hover:bg-green-500 hover:text-white'}`}>
              <ListItemPrefix>
                <PresentationChartLineIcon className="h-5 w-5" />
              </ListItemPrefix>
              <span className="mr-auto text-sm font-normal">Dashboard</span>
            </ListItem>
            <ListItem onClick={() => {
              navigate(`/enumerator/surveys`)
            }} className={`focus:bg-green-500 focus:text-white ${route.pathname === `/enumerator/surveys` && 'bg-green-500 text-white hover:bg-green-500 hover:text-white'}`}>
              <ListItemPrefix>
                <DocumentDuplicateIcon className="h-5 w-5" />
              </ListItemPrefix>
              <span className="mr-auto text-sm font-normal">Surveys</span>
            </ListItem>
          </div>
        )}
      </List>
    </div>
  )
}

export default Navigation