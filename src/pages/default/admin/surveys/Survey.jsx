import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "../../../../api/axios"
import { ScreenLoading } from "../../../../components/Loading"
import Btn from "../../../../components/Button"
import Tbl from "../../../../components/Table"

const Survey = () => {
  const navigate = useNavigate()
  const [btnLoading, setBtnLoading] = useState(false)
  const [surveys, setSurveys] = useState([])
  const formatDateTime = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSurvey = async () => {
      await axios.get('/api/admin/get-survey')
        .then(({ data }) => {
          const formattedSurveys = data.map((survey) => ({
            id: survey.id,
            uuid: survey.uuid,
            title: survey.title,
            reponse: survey.limit !== null ? `${survey.response_count} / ${survey.limit}` : survey.response_count,
            created_at: formatDateTime(survey.created_at)
          }))
          setSurveys(formattedSurveys)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    getSurvey()
  }, [])

  const data = {
    theads: [
      "Title",
      "Total Responses",
      "Date Created",
    ],
    tbodies: surveys
  }

  const handleNavigate = (uuid) => {
    navigate(`/admin/surveys/${uuid}`)
  }

  return (
    <div>
      <ScreenLoading loading={btnLoading} />
      <div className="p-4 space-y-4 max-sm:space-y-2 max-sm:p-2">
        <div className="flex justify-end">
          <Btn onClick={() => navigate(`/admin/surveys/create`)} label="Create" color="green" variant="outlined" />
        </div>
        <Tbl title="Surveys" data={data} idKey="uuid" onClickView={handleNavigate} loading={loading} />
      </div>
    </div>
  )
}

export default Survey