import { NewspaperIcon, PencilSquareIcon, UserIcon } from "@heroicons/react/24/outline"
import { Card, CardBody, List, ListItem, ListItemPrefix, Switch } from "@material-tailwind/react"
import User from '../../../../assets/images/user.png'
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "../../../../api/axios"
import { ScreenLoading } from "../../../../components/Loading"

const Information = () => {
  const [information, setInformation] = useState({})
  const { enumerator_id } = useParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getInformation = async () => {
      await axios.get('/api/enumerator/get-enumerator-information', {
        params: { enumerator_id }
      })
        .then(({ data }) => {
          setInformation(data)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    getInformation()
  }, [enumerator_id])

  const toggleStatus = async () => {
    const newStatus = information.status === "active" ? "inactive" : "active"
    setInformation(prev => ({ ...prev, status: newStatus }))
    await axios.post('/api/enumerator/update-enumerator-status', {
      enumerator_id,
      status: newStatus
    })
  }

  if (loading) {
    return <ScreenLoading loading={loading} />
  }

  return (
    <div className='flex gap-4 p-4'>
      <Card className='sticky top-4 min-w-[272px] p-2 h-fit shadow-none'>
        <List>
          <ListItem>
            <ListItemPrefix>
              <UserIcon className="h-5 w-5" />
            </ListItemPrefix>
            <span className='mr-auto text-sm font-normal'>Personal Details</span>
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <NewspaperIcon className="h-5 w-5" />
            </ListItemPrefix>
            <span className='mr-auto text-sm font-normal'>Response History</span>
          </ListItem>
        </List>
      </Card>
      <div className='flex-1 space-y-4'>
        <Card className='h-fit shadow-none'>
          <CardBody className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <img src={User} className="h-24 w-24" />
              <div className='flex flex-col'>
                <span className='text-base font-semibold'>
                  {information.first_name} {information.last_name}
                </span>
                <span className='text-sm font-medium capitalize'>
                  {information.role}
                </span>
              </div>
            </div>
            <Switch checked={information.status === "active"} onChange={toggleStatus} color="green" label={information.status} labelProps={{ className: "font-normal capitalize text-sm" }} />
          </CardBody>
        </Card>
        <Card className='h-fit shadow-none'>
          <CardBody className='space-y-6'>
            <span className="font-medium text-sm">Personal Details</span>
            <div className='grid grid-cols-3 gap-10'>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">Last Name</span>
                <span className='text-sm'>
                  {information.last_name}
                </span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">First Name</span>
                <span className='text-sm'>
                  {information.first_name}
                </span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">Middle Name</span>
                <span className='text-sm'>
                  {information.middle_name === null ? '-' : information.last_name}
                </span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">Gender</span>
                <span className='text-sm capitalize'>
                  {information.gender}
                </span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <div className='flex items-center gap-2'>
                  <span className="text-xs font-medium">Email Address</span>
                  <PencilSquareIcon className='w-4 h-4 text-blue-500 cursor-pointer' />
                </div>
                <span className='text-sm'>
                  {information.email}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Information