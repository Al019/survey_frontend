import { Card, CardBody, Chip, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react"
import { useState } from "react"
import User from '../../assets/images/user.png'
import { useAuthContext } from "../../contexts/AuthContext"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import Inpt from "../../components/Input"
import Btn from "../../components/Button"

const tabs = ["Personal Details", "Change Password"]

const Profile = () => {
  const { user, changePassword, btnLoading } = useAuthContext()
  const [activeTab, setActiveTab] = useState(user.is_default === 0 ? "Change Password" : "Personal Details")
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: ""
  })

  const handleChangePassword = () => {
    changePassword(formData)
  }

  return (
    <Tabs value={activeTab}>
      <div className="h-[100px] px-4 pt-4 z-10 lg:fixed left-[272px] flex flex-col justify-between right-0 top-0 bg-white border-b">
        <div className="h-12">
          {activeTab === 'Personal Details' && (
            <div className="flex justify-end">
              <Btn label="Edit" color="green" variant="outlined" />
            </div>
          )}
          {activeTab === 'Change Password' && (
            <div className="flex justify-end">
              <Btn onClick={handleChangePassword} label="Save Changes" variant="outlined" color="green" loading={btnLoading} />
            </div>
          )}
        </div>
        <div className="">
          <TabsHeader
            className="z-0 w-fit space-x-6 rounded-none border-b border-blue-gray-50 bg-transparent p-0"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-green-500 shadow-none rounded-none",
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                value={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm whitespace-nowrap ${activeTab === tab && "text-blue-gray-800 font-medium"}`}
              >
                {tab}
              </Tab>
            ))}
          </TabsHeader>
        </div>
      </div>
      <div className="lg:mt-[22px] max-w-[800px] mx-auto">
        <TabsBody>
          <TabPanel value="Personal Details" className="space-y-4">
            <Card className='h-fit shadow-none'>
              <CardBody>
                <div className='flex items-center gap-4'>
                  <img src={User} className="h-24 w-24" />
                  <div className='flex flex-col space-y-2'>
                    <span className='text-base font-semibold text-blue-gray-800'>
                      {user.first_name} {user.last_name}
                    </span>
                    <Chip value={user?.role === 'admin' && 'Administrator' || user?.role === 'enumerator' && 'Enumerator'} variant="outlined" className="w-fit mb-4" color="green" />
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className='h-fit shadow-none'>
              <CardBody className='space-y-6'>
                <div className='grid grid-cols-2 gap-4'>
                  <Inpt value={user.last_name} variant="standard" label="Last Name" />
                  <Inpt value={user.first_name} variant="standard" label="First Name" />
                  <Inpt value={user.middle_name === null ? '-' : user.middle_name} variant="standard" label="Middle Name" />
                  <Inpt value={user.gender} variant="standard" label="Gender" />
                  <Inpt value={user.email} variant="standard" label="Email Address" />
                </div>
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel value="Change Password">
            <Card className="shadow-none">
              <CardBody className="space-y-4">
                {user.is_default === 1 && (
                  <div className="grid grid-cols-2">
                    <Inpt onChange={(e) => setFormData({ ...formData, current_password: e.target.value })} variant="standard" label="Current Password" secureTextEntry />
                  </div>
                )}
                <div className="grid grid-cols-2">
                  <Inpt onChange={(e) => setFormData({ ...formData, password: e.target.value })} variant="standard" label="New Password" secureTextEntry />
                </div>
                <div className="grid grid-cols-2">
                  <Inpt onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })} variant="standard" label="Confirm Password" secureTextEntry />
                </div>
              </CardBody>
            </Card>
          </TabPanel>
        </TabsBody>
      </div>
    </Tabs>
  )
}

export default Profile