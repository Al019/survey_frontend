import { PlusCircleIcon } from "@heroicons/react/24/outline"
import Btn from "../../../../components/Button"
import { useEffect, useState } from "react"
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Option, Select } from "@material-tailwind/react"
import Inpt from "../../../../components/Input"
import axios from "../../../../api/axios"
import Tbl from "../../../../components/Table"
import { useNavigate } from "react-router-dom"

const Enumerator = () => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    gender: "",
    email: ""
  })
  const [enumerators, setEnumerators] = useState([])
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)
  const navigate = useNavigate()

  const handleOpen = () => {
    setOpen(!open)
    setFormData({
      last_name: "",
      first_name: "",
      middle_name: "",
      gender: "",
      email: ""
    })
  }

  useEffect(() => {
    getEnumerator()
  }, [])

  const getEnumerator = async () => {
    axios.get('/api/admin/get-enumerator')
      .then(({ data }) => {
        const formattedEnumerators = data.map((enumerator) => ({
          id: enumerator.id,
          last_name: enumerator.last_name,
          first_name: enumerator.first_name,
          middle_name: enumerator.middle_name,
          email: enumerator.email,
          status: enumerator.status
        }))
        setEnumerators(formattedEnumerators)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleAddEnumerator = async () => {
    setBtnLoading(true)
    await axios.post('/api/admin/add-enumerator', formData)
      .then(() => {
        handleOpen()
        getEnumerator()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const data = {
    theads: [
      "Last Name",
      "First Name",
      "Middle Name",
      "Email Address",
      "Status"
    ],
    tbodies: enumerators
  }

  const handleNavigate = (id) => {
    navigate(`/admin/enumerators/${id}`)
  }

  return (
    <div>
      <div className="p-4 space-y-4 max-sm:space-y-2 max-sm:p-2">
        <div className="flex justify-end">
          <Btn onClick={handleOpen} label="Add" color="green" variant="outlined" />
        </div>
        <Tbl title="Enumerators" data={data} idKey="id" onClickView={handleNavigate} loading={loading} />
      </div>

      <Dialog size="sm" open={open} handler={!btnLoading && handleOpen}>
        <DialogHeader className="text-lg font-semibold">
          Add Enumerator
        </DialogHeader>
        <DialogBody className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <Inpt variant="standard" onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} label="Last name" />
          <Inpt variant="standard" onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} label="First name" />
          <Inpt variant="standard" onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })} label="Middle name" placeholder="Optional" />
          <Select variant="standard" onChange={(val) => setFormData({ ...formData, gender: val })} label="Gender" color="green">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
          <Inpt variant="standard" onChange={(e) => setFormData({ ...formData, email: e.target.value })} label="Email address" />
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleAddEnumerator} variant="outlined" color="green" loading={btnLoading}>
            <span>Save</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default Enumerator