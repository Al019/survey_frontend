import { NewspaperIcon, PencilSquareIcon, UserIcon } from "@heroicons/react/24/outline"
import { Card, CardBody, Chip, List, ListItem, ListItemPrefix, Switch, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react"
import User from '../../../../assets/images/user.png'
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "../../../../api/axios"
import { ScreenLoading } from "../../../../components/Loading"
import Btn from "../../../../components/Button"
import Inpt from "../../../../components/Input"
import Tbl from "../../../../components/Table"

const tabs = ["Personal Details"]

const Information = () => {
  const [information, setInformation] = useState({})
  const { enumerator_id } = useParams()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Personal Details")

  useEffect(() => {
    const getInformation = async () => {
      await axios.get('/api/admin/get-enumerator-information', {
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
    await axios.post('/api/admin/update-enumerator-status', {
      enumerator_id,
      status: newStatus
    })
  }

  if (loading) {
    return <ScreenLoading loading={loading} />
  }

  return (
    <Tabs value={activeTab}>
      <div className="h-[100px] px-4 pt-4 z-10 lg:fixed left-[272px] flex flex-col justify-between right-0 top-0 bg-white border-b">
        <div className="grid grid-cols-2 items-center h-12">
          <h1 className="text-base font-medium text-blue-gray-800 break-words line-clamp-2">
            {information.first_name} {information.last_name}
          </h1>
          {activeTab === 'Personal Details' && (
            <div className="flex justify-end">
              <Btn label="Edit" color="green" variant="outlined" />
            </div>
          )}
          {activeTab === 'Assignments' && (
            <div className="flex justify-end">
              <Btn label="Assign" color="green" variant="outlined" />
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
              <CardBody className="flex justify-between items-center">
                <div className='flex items-center gap-4'>
                  <img src={User} className="h-24 w-24" />
                  <div className='flex flex-col space-y-2'>
                    <span className='text-base font-semibold text-blue-gray-800'>
                      {information.first_name} {information.last_name}
                    </span>
                    <Chip value={information?.role === 'admin' && 'Administrator' || information?.role === 'enumerator' && 'Enumerator'} variant="outlined" className="w-fit mb-4" color="green" />
                  </div>
                </div>
                <Switch checked={information.status === "active"} onChange={toggleStatus} color="green" label={information.status} labelProps={{ className: "font-normal capitalize text-sm" }} />
              </CardBody>
            </Card>
            <Card className='h-fit shadow-none'>
              <CardBody className='space-y-6'>
                <div className='grid grid-cols-2 gap-4'>
                  <Inpt value={information.last_name} variant="standard" label="Last Name" />
                  <Inpt value={information.first_name} variant="standard" label="First Name" />
                  <Inpt value={information.middle_name === null ? '-' : information.middle_name} variant="standard" label="Middle Name" />
                  <Inpt value={information.gender} variant="standard" label="Gender" className="capitalize" />
                  <Inpt value={information.email} variant="standard" label="Email Address" />
                </div>
              </CardBody>
            </Card>
          </TabPanel>
        </TabsBody>
      </div>
    </Tabs>
  )
}

export default Information