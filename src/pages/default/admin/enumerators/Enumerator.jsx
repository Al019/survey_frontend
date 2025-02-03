import { PlusCircleIcon } from "@heroicons/react/24/outline"
import Btn from "../../../../components/Button"
import { useEffect, useState } from "react"
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react"
import Inpt from "../../../../components/Input"
import axios from "../../../../api/axios"
import Tbl from "../../../../components/Table"

const Enumerator = () => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    email: ""
  })
  const [enumerators, setEnumerators] = useState([])
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)

  const handleOpen = () => setOpen(!open)

  useEffect(() => {
    getEnumerator()
  }, [])

  const getEnumerator = async () => {
    axios.get('/api/enumerator/get-enumerator')
      .then(({ data }) => {
        const formattedEnumerators = data.map((enumerator) => ({
          last_name: enumerator.last_name,
          first_name: enumerator.first_name,
          middle_name: enumerator.middle_name,
          email: enumerator.email
        }))
        setEnumerators(formattedEnumerators)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleAddEnumerator = async () => {
    setBtnLoading(true)
    await axios.post('/api/enumerator/add-enumerator', formData)
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
    ],
    tbodies: enumerators
  }

  return (
    <div>
      <div className="p-4 space-y-4 max-sm:space-y-2 max-sm:p-2">
        <div className="flex justify-end">
          <Btn onClick={handleOpen} label="Add" color="green" />
        </div>
        <Tbl title="Enumerators" data={data} loading={loading} />
      </div>

      <Dialog size="sm" open={open} handler={!btnLoading && handleOpen}>
        <DialogHeader className="text-lg font-semibold">
          Add Enumerator
        </DialogHeader>
        <DialogBody className="grid grid-cols-2 gap-4">
          <Inpt onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} label="Last name" />
          <Inpt onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} label="First name" />
          <Inpt onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })} label="Middle name" />
          <Inpt onChange={(e) => setFormData({ ...formData, email: e.target.value })} label="Email address" />
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" onClick={handleOpen} disabled={btnLoading}>
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleAddEnumerator} loading={btnLoading}>
            <span>Save</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default Enumerator