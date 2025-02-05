import { useEffect, useState } from "react"
import Tbl from "../../../../components/Table"
import axios from "../../../../api/axios"
import { useNavigate } from "react-router-dom"

const Survey = () => {
  const [surveys, setSurveys] = useState([])
  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSurvey = async () => {
      await axios.get('/api/enumerator/get-survey')
        .then(({ data }) => {
          const formattedSurveys = data.map((survey) => ({
            id: survey.id,
            uuid: survey.uuid,
            title: survey.title,
            created_at: formatDate(survey.created_at)
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
      "Date Created",
    ],
    tbodies: surveys
  }

  const handleNavigate = (uuid) => {
    navigate(`/enumerator/surveys/${uuid}`)
  }

  return (
    <div className="p-4 max-sm:p-2">
      <Tbl title="Surveys" data={data} idKey="uuid" onClickView={handleNavigate} loading={loading} />
    </div>
  )
}

export default Survey