import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "../../../../api/axios"
import { ScreenLoading } from "../../../../components/Loading"
import Btn from "../../../../components/Button"
import Tbl from "../../../../components/Table"
import { Option, Select } from "@material-tailwind/react"

const Survey = () => {
  const navigate = useNavigate()
  const [btnLoading, setBtnLoading] = useState(false)
  const [surveys, setSurveys] = useState([])
  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("all")
  const [filteredSurveys, setFilteredSurveys] = useState([])

  useEffect(() => {
    const getSurvey = async () => {
      await axios.get('/api/survey/get-survey')
        .then(({ data }) => {
          const formattedSurveys = data.map((survey) => ({
            id: survey.id,
            uuid: survey.uuid,
            title: survey.title,
            status: survey.status,
            created_at: formatDate(survey.created_at)
          }))
          setSurveys(formattedSurveys)
          setFilteredSurveys(formattedSurveys)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    getSurvey()
  }, [])

  const handleCreate = async () => {
    setBtnLoading(true)
    await axios.post('/api/survey/create-survey', {
      uuid: uuidv4(),
    })
      .then(({ data }) => {
        navigate(`/admin/surveys/${data.uuid}/edit`)
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  useEffect(() => {
    if (status === "all") {
      setFilteredSurveys(surveys)
    } else {
      setFilteredSurveys(surveys.filter(survey => survey.status === status))
    }
  }, [status, surveys])

  const data = {
    theads: [
      "Title",
      "Status",
      "Date Created",
    ],
    tbodies: filteredSurveys
  }

  const handleNavigate = (uuid) => {
    navigate(`/admin/surveys/${uuid}/edit`)
  }

  return (
    <div>
      <ScreenLoading loading={btnLoading} />
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-baseline">
          <div className="w-fit">
            <Select value={status} onChange={(val) => setStatus(val)} label="Select status" color="green">
              <Option value="all">All</Option>
              <Option value="publish">Publish</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </div>
          <Btn onClick={handleCreate} label="Create" color="green" icon={<PlusCircleIcon className="size-6" />} />
        </div>
        <Tbl title="Surveys" data={data} idKey="uuid" onClickView={handleNavigate} loading={loading} />
      </div>
    </div>
  )
}

export default Survey