import { Card, CardBody, Checkbox, Option, Radio, Select, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import Btn from "../../../../components/Button"
import { useParams } from "react-router-dom"
import axios from "../../../../api/axios"
import Inpt from "../../../../components/Input"
import { ScreenLoading } from "../../../../components/Loading"
import Chart from "react-apexcharts"

const tabs = ["Questions", "Responses"]
const colors = ["#f44336", "#4caf50", "#2196f3", "#ff9800", "#3f51b5"]

const Form = () => {
  const [activeTab, setActiveTab] = useState("Questions")
  const { uuid } = useParams()
  const [survey, setSurvey] = useState({})
  const [answer, setAnswer] = useState([])
  const [btnLoading, setBtnLoading] = useState(false)
  const [response, setResponse] = useState([])
  const [validationErrors, setValidationErrors] = useState([])

  const pieChartConfig = (series, labels) => ({
    type: "pie",
    width: 200,
    height: 200,
    series: series,
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: colors,
      legend: {
        show: false,
      },
      labels: labels,
    },
  })

  const calculateResponseData = (question) => {
    const optionCounts = question.option.map(opt => ({
      text: opt.text,
      count: 0,
    }))

    response.forEach(res => {
      res.answer.forEach(ans => {
        if (ans.question_id === question.id) {
          const selectedOptions = ans.text.split(", ").map(opt => opt.trim())
          selectedOptions.forEach(selectedOption => {
            const option = optionCounts.find(opt => opt.text === selectedOption)
            if (option) {
              option.count += 1
            }
          })
        }
      })
    })

    const totalResponses = optionCounts.reduce((sum, opt) => sum + opt.count, 0)
    const series = optionCounts.map(opt => opt.count)
    const labels = optionCounts.map(opt => opt.text)

    return { series, labels, totalResponses }
  }

  useEffect(() => {
    getSurvey()
    getResponse()
  }, [uuid])

  const getSurvey = async () => {
    await axios.get('/api/survey/get-survey-uestionnaire', {
      params: { uuid }
    })
      .then(({ data }) => {
        setSurvey(data)
      })
  }

  const getResponse = async () => {
    await axios.get('/api/enumerator/get-response', {
      params: { uuid }
    })
      .then(({ data }) => {
        setResponse(data)
      })
  }

  const handleAnswerChange = (questionId, option) => {
    setAnswer((prev) => {
      const updatedAnswers = prev.filter((item) => item.questionId !== questionId)
      return [
        ...updatedAnswers,
        {
          questionId,
          text: option.text,
          option: [{ optionId: option.id }],
        },
      ]
    })
  }

  const handleCheckboxChange = (questionId, option, checked) => {
    setAnswer((prev) => {
      let updatedAnswers = [...prev]
      let existing = updatedAnswers.find((item) => item.questionId === questionId)

      if (!existing) {
        existing = { questionId, option: [], text: [] }
        updatedAnswers.push(existing)
      }

      if (checked) {
        existing.option.push({ optionId: option.id })
        existing.text.push(option.text)
      } else {
        existing.option = existing.option.filter((opt) => opt.optionId !== option.id)
        existing.text = existing.text.filter((text) => text !== option.text)
      }

      if (existing.option.length === 0) {
        updatedAnswers = updatedAnswers.filter((item) => item.questionId !== questionId)
      }

      return updatedAnswers
    })
  }

  const handleInputChange = (questionId, option, value) => {
    setAnswer((prev) => {
      const updatedAnswers = prev.filter((item) => item.questionId !== questionId);
      return [
        ...updatedAnswers,
        {
          questionId,
          text: value,
          option: [{ optionId: option.id }],
        },
      ]
    })
  }

  const handleSubmit = async () => {
    const requiredQuestions = survey.question.filter(q => q.required === 1);
    const unansweredQuestions = requiredQuestions.filter(q => !answer.some(a => a.questionId === q.id))

    if (unansweredQuestions.length > 0) {
      setValidationErrors(unansweredQuestions.map(q => q.id))
      return
    }

    setBtnLoading(true)
    await axios.post('/api/enumerator/submit-survey', { uuid, answer })
      .then(() => {
        getResponse()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  return (
    <div>
      <Tabs value={activeTab}>
        <div className="h-[100px] px-4 pt-4 z-10 fixed left-[272px] flex flex-col justify-between right-0 top-0 bg-white border-b">
          <div className="grid grid-cols-2 items-center h-10">
            <h1 className="text-lg font-medium">
              {survey.title}
            </h1>
            {activeTab === 'Questions' && (
              <div className="flex justify-end">
                <Btn onClick={handleSubmit} label="Submit" color="green" />
              </div>
            )}
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
              <Card className="shadow-none">
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
                <Card key={qIndex} className={`shadow-none ${validationErrors.includes(question.id) ? 'border-2 border-red-500' : 'border-2 border-transparent'}`}>
                  <CardBody className="space-y-6">
                    <div className="space-y-3">
                      <span className="text-xs font-normal">Question {qIndex + 1} {question.required === 1 && <span className="text-red-500 text-sm">*</span>}</span>
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
                                onChange={() => handleAnswerChange(question.id, option)}
                                labelProps={{ className: "font-normal text-sm" }}
                              />
                            )
                          } else if (question.type === 'checkbox') {
                            return (
                              <Checkbox
                                key={oIndex}
                                label={option.text}
                                color="green"
                                onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                                labelProps={{ className: "font-normal text-sm" }}
                              />
                            )
                          }
                        })}
                      </div>
                    )}
                    {question.type === 'select' && (
                      <Select label="Select" onChange={(val) => {
                        const selectedOption = question.option.find(opt => opt.text === val);
                        if (selectedOption) {
                          handleAnswerChange(question.id, selectedOption);
                        }
                      }} color="green" variant="standard">
                        {question.option.map((option, oIndex) => (
                          <Option key={oIndex} value={option.text}>
                            {option.text}
                          </Option>
                        ))}
                      </Select>
                    )}
                    {question.type === 'input' && (
                      <div>
                        {question.option.map((option, oIndex) => (
                          <Inpt
                            key={oIndex}
                            label={option.text}
                            onChange={(e) => handleInputChange(question.id, option, e.target.value)}
                            variant="standard"
                          />
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </TabPanel>
            <TabPanel value="Responses">
              <Card className="shadow-none">
                <CardBody className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h1 className="font-medium">
                      {response.length}
                    </h1>
                    <p className="text-sm font-normal">
                      {response.length > 1 ? 'Responses' : 'Response'}
                    </p>
                  </div>
                </CardBody>
              </Card>
              {response.length >= 1 && (
                <div className="mt-4 space-y-4">
                  {survey.question?.map((question, qIndex) => (
                    <Card key={qIndex} className="shadow-none">
                      <CardBody className="space-y-6">
                        <div className="space-y-3">
                          <span className="text-xs font-normal">Question {qIndex + 1}</span>
                          <h1 className="text-sm font-medium">{question.text}</h1>
                        </div>
                        {(question.type === 'radio' || question.type === 'select' || question.type === 'checkbox') && (
                          <div className="grid grid-cols-2 place-items-center">
                            {(() => {
                              const { series, labels } = calculateResponseData(question);
                              return (
                                <Chart {...pieChartConfig(series, labels)} />
                              );
                            })()}
                            <div className="space-y-2">
                              {question.option.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-2">
                                  <div
                                    style={{ backgroundColor: colors[oIndex] }}
                                    className="size-4 rounded-full"
                                  ></div>
                                  <p className="text-xs font-normal">
                                    {option.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {question.type === 'input' && (
                          <div className="space-y-2">
                            {response.map((res, resIndex) => {
                              const answer = res.answer.find(ans => ans.question_id === question.id);
                              return (
                                <p key={resIndex} className="text-sm font-normal p-2 bg-gray-100 rounded-md">
                                  {answer.text}
                                </p>
                              )
                            })}
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </TabPanel>
          </TabsBody>
        </div>
      </Tabs>

      <ScreenLoading loading={btnLoading} />
    </div>
  )
}

export default Form