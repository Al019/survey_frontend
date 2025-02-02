import { CloudArrowUpIcon } from "@heroicons/react/24/outline"
import { Card, CardBody, Checkbox, Option, Radio, Select, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Tooltip } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import Btn from "../../../../components/Button"
import { useParams } from "react-router-dom"
import axios from "../../../../api/axios"
import Inpt from "../../../../components/Input"

const tabs = ["Questions", "Responses"]

const Form = () => {
  const [activeTab, setActiveTab] = useState("Questions")
  const { uuid } = useParams()
  const [survey, setSurvey] = useState({})
  const [answer, setAnswer] = useState({})

  useEffect(() => {
    const getSurvey = async () => {
      await axios.get('/api/enumerator/get-survey-uestionnaire', {
        params: { uuid }
      })
        .then(({ data }) => {
          setSurvey(data)
        })
    }
    getSurvey()
  }, [])

  const handleAnswerChange = (qIndex, value) => {
    setAnswer((prev) => ({
      ...prev,
      [qIndex]: value
    }))
  }

  return (
    <Tabs value={activeTab}>
      <div className="h-[100px] px-4 pt-4 z-10 fixed left-[272px] flex flex-col justify-between right-0 top-0 bg-white border-b">
        <div className="grid grid-cols-2 items-center">
          <h1 className="text-lg font-medium">
            title
          </h1>
          <div className="flex justify-end">
            <Btn onClick={() => console.log(answer)} label="Submit" color="green" />
          </div>
        </div>
        <div className="flex justify-center">
          <TabsHeader
            className="w-fit space-x-6 rounded-none border-b border-blue-gray-50 bg-transparent p-0"
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
                className={`text-sm ${activeTab === tab && "text-gray-800 font-medium"}`}
              >
                {tab}
              </Tab>
            ))}
          </TabsHeader>
        </div>
      </div>
      <div className="mt-[100px] max-w-3xl mx-auto">
        <TabsBody>
          <TabPanel value="Questions" className="space-y-4 pb-40">
            <Card>
              <CardBody className="space-y-4">
                <h1 className="font-medium">
                  {survey.title}
                </h1>
                <p className="text-sm font-normal">
                  {survey.description}
                </p>
              </CardBody>
            </Card>
            {survey.question?.map((question, qIndex) => (
              <Card key={qIndex}>
                <CardBody className="space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-normal">Question {qIndex + 1}</span>
                    <h1 className="text-sm font-medium">{question.text}</h1>
                  </div>
                  {(question.type === 'radio' || question.type === 'checkbox') && (
                    <div className="grid grid-cols-2">
                      {question.option.map((option, oIndex) => {
                        if (question.type === 'radio') {
                          return (
                            <Radio
                              key={oIndex}
                              name={`radio_${qIndex}`}
                              label={option.text}
                              color="green"
                              onChange={() => handleAnswerChange(question.id, option.text)}
                            />
                          )
                        } else if (question.type === 'checkbox') {
                          return (
                            <Checkbox
                              key={oIndex}
                              label={option.text}
                              color="green"
                              onChange={(e) => {
                                const checked = e.target.checked
                                setAnswer((prev) => {
                                  const updated = prev[question.id] ? [...prev[question.id]] : []
                                  if (checked) updated.push(option.text)
                                  else updated.splice(updated.indexOf(option.text), 1)
                                  return { ...prev, [question.id]: updated }
                                })
                              }}
                            />
                          )
                        }
                      })}
                    </div>
                  )}
                  {question.type === 'select' && (
                    <Select label="Select option" onChange={(val) => handleAnswerChange(question.id, val)}>
                      {question.option.map((option, oIndex) => (
                        <Option key={oIndex} value={option.text}>
                          {option.text}
                        </Option>
                      ))}
                    </Select>
                  )}
                  {question.type === 'input' && (
                    <Inpt
                      label="Your answer"
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                  )}
                </CardBody>
              </Card>
            ))}
          </TabPanel>
        </TabsBody>
      </div>
    </Tabs>
  )
}

export default Form