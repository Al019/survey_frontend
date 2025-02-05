import { NewspaperIcon, PencilSquareIcon, UserIcon } from "@heroicons/react/24/outline"
import { Card, CardBody, List, ListItem, ListItemPrefix } from "@material-tailwind/react"
import User from '../../../../assets/images/user.png'

const Information = () => {
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
                  Al Gaid
                </span>
                <span className='text-sm font-medium capitalize'>
                  Enumerator
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className='h-fit shadow-none'>
          <CardBody className='space-y-6'>
            <span className="font-medium text-sm">Personal Details</span>
            <div className='grid grid-cols-3 gap-10'>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">Last Name</span>
                <span className='text-sm'>
                  Gaid
                </span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">First Name</span>
                <span className='text-sm'>
                  Al
                </span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">Middle Name</span>
                <span className='text-sm'>
                  P
                </span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">Gender</span>
                <span className='text-sm capitalize'>
                  Male
                </span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <div className='flex items-center gap-2'>
                  <span className="text-xs font-medium">Email Address</span>
                  <PencilSquareIcon className='w-4 h-4 text-blue-500 cursor-pointer' />
                </div>
                <span className='text-sm'>
                  al@gmail.com
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