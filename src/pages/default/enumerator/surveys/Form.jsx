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
            <Btn label="Submit" color="green" />
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
                        return <Radio key={oIndex} name="multiple_choice" label={option.text} color="green" />
                      } else if (question.type === 'checkboxes') {
                        return <Checkbox key={oIndex} label={option.text} color="green" />
                      }
                    })}
                  </div>
                )}
                {question.type === 'dropdown' && (
                  <div className="grid grid-cols-2">
                    <Select label="Select option">
                      {question.option.map((option, oIndex) => {
                        return <Option key={oIndex}>{option.text}</Option>
                      })}
                    </Select>
                  </div>
                )}
                {question.type === 'text' && (
                  <div>
                    {question.option.map((option, oIndex) => {
                      return <Inpt key={oIndex} label={option.text} />
                    })}
                  </div>
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