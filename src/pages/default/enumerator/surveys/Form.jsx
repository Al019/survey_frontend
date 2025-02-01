import { CloudArrowUpIcon } from "@heroicons/react/24/outline"
import { Checkbox, Option, Radio, Select, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Tooltip } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import Btn from "../../../../components/Button"
import { useParams } from "react-router-dom"
import axios from "../../../../api/axios"
import Inpt from "../../../../components/Input"

const tabs = ["Questions", "Responses"]

const Form = () => {
  const [activeTab, setActiveTab] = useState("Questions")
  const { uuid } = useParams()
  const [header, setHeader] = useState({})
  const [questions, setQuestions] = useState([])
  const [answer, setAnswer] = useState({})

  useEffect(() => {
    const getSurvey = async () => {
      await axios.get('/api/enumerator/get-survey-questionnaire', {
        params: { uuid }
      })
        .then(({ data }) => {
          setHeader(data.header)
          setQuestions(data.questions)
        })
    }
    getSurvey()
  }, [])

  const handleResponseChange = (qIndex, value) => {
    setAnswer((prev) => ({
      ...prev,
      [qIndex]: value
    }))
  }

  const handleSubmit = async () => {
    console.log({ uuid: uuid, answers: answer })
  }

  return (
    <Tabs value={activeTab}>
      <div className="h-[100px] px-4 pt-4 z-10 fixed left-[272px] flex flex-col justify-between right-0 top-0 bg-white border-b">
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium">
              {header.title}
            </h1>
            <Tooltip content="Saved" placement="bottom">
              <CloudArrowUpIcon className="size-5 text-blue-500" />
            </Tooltip>
          </div>
          <div className="flex justify-end">
            <Btn onClick={handleSubmit} label="Submit" color="green" />
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
            <div className="bg-white p-6 rounded-xl space-y-4">
              <h1 className="font-medium">
                {header.title}
              </h1>
              <p className="text-sm font-normal">
                {header.description}
              </p>
            </div>
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="bg-white p-6 rounded-xl space-y-4">
                <span className="text-xs font-normal">Question {qIndex + 1}</span>
                <h1 className="text-sm font-medium">{question.text}</h1>
                {(question.type === 'multiple_choice' || question.type === 'checkboxes') && (
                  <div className="grid grid-cols-2">
                    {question.option.map((option, oIndex) => {
                      if (question.type === 'multiple_choice') {
                        return (
                          <Radio
                            key={oIndex}
                            name={`radio_${qIndex}`}
                            label={option.text}
                            color="green"
                            onChange={() => handleResponseChange(question.id, option.text)}
                          />
                        )
                      } else if (question.type === 'checkboxes') {
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
                {question.type === 'dropdown' && (
                  <Select label="Select option" onChange={(val) => handleResponseChange(question.id, val)}>
                    {question.option.map((option, oIndex) => (
                      <Option key={oIndex} value={option.text}>
                        {option.text}
                      </Option>
                    ))}
                  </Select>
                )}
                {question.type === 'text' && (
                  <Inpt
                    label="Your answer"
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </TabPanel>
        </TabsBody>
      </div>
    </Tabs>
  )
}

export default Form