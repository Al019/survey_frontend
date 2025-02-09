import Btn from "../../../../components/Button"
import { Button, Card, CardBody, Option, Select, Switch, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Textarea, Tooltip } from "@material-tailwind/react"
import { useEffect, useRef, useState } from "react"
import { IoMdRadioButtonOff, IoIosArrowDown } from "react-icons/io"
import { IoCloseOutline } from "react-icons/io5"
import { FiTrash2 } from "react-icons/fi"
import { useNavigate, useParams } from "react-router-dom"
import { MdCheckBoxOutlineBlank } from "react-icons/md"
import Inpt from "../../../../components/Input"
import axios from "../../../../api/axios"
import { RxTextAlignLeft } from "react-icons/rx";
import { ScreenLoading } from "../../../../components/Loading"
import Chart from "react-apexcharts"
import { ArrowDownTrayIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import * as XLSX from "xlsx"
import Tbl from "../../../../components/Table"

const tabs = ["Questions", "Responses", "Assignments", "Settings"]
const colors = ["#f44336", "#4caf50", "#2196f3", "#ff9800", "#3f51b5"]

const View = () => {
  const [activeTab, setActiveTab] = useState("Questions")
  const { uuid } = useParams()
  const [survey, setSurvey] = useState({})
  const [response, setResponse] = useState([])
  const [loading, setLoading] = useState(true)
  const [switchLimit, setSwitchLimit] = useState(false)
  const [assignEnumerator, setAssignEnumerator] = useState([])
  const [assignEnumeratorSurvey, setAssignEnumeratorSurvey] = useState([])

  useEffect(() => {
    const getSurveyResponse = async () => {
      await getSurvey()
      await getResponse()
      setLoading(false)
    }
    getSurveyResponse()
  }, [uuid])

  const getSurvey = async () => {
    await axios.get('/api/admin/get-survey-questionnaire', {
      params: { uuid }
    })
      .then(({ data }) => {
        setSurvey(data)
      })
  }

  const getResponse = async () => {
    await axios.get('/api/admin/get-survey-response', {
      params: { uuid }
    })
      .then(({ data }) => {
        setResponse(data)
      })
  }

  useEffect(() => {
    if (survey && survey.id) {
      const getEnumerator = async () => {
        await getAssignEnumerator()
        await getAssignEnumeratorSurvey()
      }
      getEnumerator()
    }
  }, [survey])

  const getAssignEnumerator = async () => {
    await axios.get('/api/admin/get-assign-enumerator', {
      params: { survey_id: survey.id }
    })
      .then(({ data }) => {
        setAssignEnumerator(data)
      })
  }

  const getAssignEnumeratorSurvey = async () => {
    await axios.get('/api/admin/get-assign-enumerator-survey', {
      params: { survey_id: survey.id }
    })
      .then(({ data }) => {
        const formattedEnumerator = data.map((enumerator) => ({
          id: enumerator.id,
          name: `${enumerator.first_name} ${enumerator.last_name}`,
          response: enumerator.response_count
        }))
        setAssignEnumeratorSurvey(formattedEnumerator)
      })
  }

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
        enabled: true,
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
      id: opt.id,
      text: opt.text,
      count: 0,
    }));

    response.forEach(res => {
      res.answer.forEach(ans => {
        if (ans.question_id === question.id) {
          const selectedOptionIds = ans.answer_option.map(ao => ao.option_id)

          selectedOptionIds.forEach(optionId => {
            const option = optionCounts.find(opt => opt.id === optionId)
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

  const exportToExcel = () => {
    const data = []

    const headers = ["Question", "Response"]
    data.push(headers)

    survey.question?.forEach((question) => {
      response.forEach((res) => {
        const answer = res.answer.find((ans) => ans.question_id === question.id);
        if (answer) {
          const row = [question.text, answer.text]
          data.push(row)
        }
      })
    })

    const worksheet = XLSX.utils.aoa_to_sheet(data)

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses")

    XLSX.writeFile(workbook, `Survey_Responses_${uuid}.xlsx`)
  }

  const data = {
    theads: [
      "Name",
      "Responses",
    ],
    tbodies: assignEnumeratorSurvey
  }

  if (loading) {
    return <ScreenLoading loading={loading} />
  }

  return (
    <div>
      <Tabs value={activeTab}>
        <div className="h-[100px] px-4 pt-4 lg:z-10 lg:fixed left-[272px] flex flex-col justify-between right-0 top-0 bg-white border-b">
          <div className="grid grid-cols-2 items-center h-12">
            <h1 className="text-base font-medium text-blue-gray-800 break-words line-clamp-2">
              {survey.title}
            </h1>
            {activeTab === 'Assignments' && (
              <div className="flex justify-end">
                <Btn label="Assign" color="green" variant="outlined" />
              </div>
            )}
          </div>
          <div className="flex justify-center">
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
                  className={`text-sm ${activeTab === tab && "text-blue-gray-800 font-medium"}`}
                >
                  {tab}
                </Tab>
              ))}
            </TabsHeader>
          </div>
        </div>
        <div className="lg:mt-[22px] max-w-[800px] mx-auto">
          <TabsBody>
            <TabPanel value="Questions" className="space-y-4 pb-40">
              <Card className="shadow-none">
                <CardBody className="space-y-4">
                  <Textarea
                    value={survey.title}
                    label="Title"
                    color="green"
                    variant="standard"
                    style={{
                      minHeight: "32px",
                    }}
                  />
                  <Textarea
                    value={survey.description}
                    label="Description (optional)"
                    color="green"
                    variant="standard"
                    style={{
                      minHeight: "32px",
                    }}
                  />
                </CardBody>
              </Card>
              {survey.question?.map((question, qIndex) => (
                <Card key={qIndex} className={`shadow-none`}>
                  <CardBody className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Textarea
                        value={question.text} label={`Question ${qIndex + 1}`} variant="standard" color="green"
                        style={{
                          minHeight: "32px",
                        }}
                      />
                      <div className="w-fit">
                        <Select value={question.type} label="Type" color="green">
                          <Option value="radio">Multiple choice</Option>
                          <Option value="checkbox">Checkboxes</Option>
                          <Option value="select">Dropdown</Option>
                          <Option value="input">Text</Option>
                        </Select>
                      </div>
                    </div>
                    {question.option.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        {question.type === 'radio' && <IoMdRadioButtonOff className="size-6 text-blue-gray-500 me-1.5" />}
                        {question.type === 'checkbox' && <MdCheckBoxOutlineBlank className="size-6 text-blue-gray-500 me-1.5" />}
                        {question.type === 'select' && <IoIosArrowDown className="size-6 text-blue-gray-500 me-1.5" />}
                        {question.type === 'input' && <RxTextAlignLeft className="size-6 text-blue-gray-500 me-1.5" />}
                        <Inpt value={option.text} label={question.type !== 'input' && `Option ${oIndex + 1}`} variant="standard" disabled={question.type === 'input'} className="disabled:bg-transparent" />
                        <div className={question.type === 'input' && 'hidden'}>
                          <Tooltip content="Remove" placement="bottom">
                            <Button onClick={() => handleRemoveOption(qIndex, oIndex)} variant="text" className="p-1.5 rounded-full" tabIndex={-1}>
                              <IoCloseOutline className="size-5 text-blue-gray-500" />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                    {question.type !== 'input' && (
                      <Btn label="Add option" variant="outlined" size="sm" color="green" />
                    )}
                    <hr className="border-blue-gray-200" />
                    <div className="flex justify-end items-center gap-4">
                      <Tooltip content="Delete question" placement="bottom">
                        <Button variant="text" className="p-2 rounded-full">
                          <FiTrash2 className="size-5 text-blue-gray-500" />
                        </Button>
                      </Tooltip>
                      <Switch checked={question.required === 1} value={question.required === 1 ? 0 : 1} labelProps={{ className: "text-sm" }} label="Required" color="green" />
                    </div>
                  </CardBody>
                </Card>
              ))}
              <div className="lg:left-[272px] fixed bottom-0 inset-x-0 flex items-center justify-center">
                <Card className="mx-4 max-sm:mx-2 shadow-none flex items-center justify-center border-t max-w-[768px] w-full p-2 rounded-none rounded-t-xl">
                  <Tooltip content="Add question" placement="top">
                    <Button variant="text" className="p-2">
                      <PlusCircleIcon className="size-7 text-blue-gray-500" />
                    </Button>
                  </Tooltip>
                </Card>
              </div>
            </TabPanel>
            <TabPanel value="Responses" className="max-sm:p-2">
              <Card className="shadow-none">
                <CardBody className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-normal">
                      Total Responses:
                    </p>
                    <h1 className="font-medium">
                      {response.length}
                    </h1>
                  </div>
                  {response.length > 0 && (
                    <Btn onClick={exportToExcel} label="Export" icon={<ArrowDownTrayIcon className="size-4" />} variant="outlined" color="green" />
                  )}
                </CardBody>
              </Card>
              {response.length > 0 && (
                <div className="mt-4 space-y-4 max-sm:space-y-2 max-sm:mt-2">
                  {survey.question?.map((question, qIndex) => (
                    <Card key={qIndex} className="shadow-none max-h-[340px] overflow-y-auto">
                      <CardBody className="space-y-6">
                        <div className="space-y-3">
                          <span className="text-xs font-normal">Question {qIndex + 1}</span>
                          <h1 className="text-sm font-medium">{question.text}</h1>
                        </div>
                        {(question.type === 'radio' || question.type === 'select' || question.type === 'checkbox') && (
                          <div>
                            {(() => {
                              const { series, labels } = calculateResponseData(question)
                              return (
                                <div className="grid grid-cols-2 place-items-center max-sm:grid-cols-1">
                                  <Chart {...pieChartConfig(series, labels)} />
                                  <div className="space-y-2">
                                    {question.option.map((option, oIndex) => {
                                      const count = series[oIndex]
                                      return (
                                        <div key={oIndex} className="flex items-center gap-2">
                                          <div
                                            style={{ backgroundColor: colors[oIndex] }}
                                            className="size-4 rounded-full"
                                          ></div>
                                          <p className="text-sm font-normal">
                                            {option.text}
                                          </p>
                                          <span className="text-sm font-normal">
                                            {`(${count})`}
                                          </span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                        )}
                        {question.type === 'input' && (
                          <div className="space-y-2">
                            {response.map((res, resIndex) => {
                              const answer = res.answer.find(ans => ans.question_id === question.id)
                              if (answer) {
                                return (
                                  <p key={resIndex} className="text-sm font-normal p-2 bg-gray-100 rounded-md">
                                    {answer.text}
                                  </p>
                                )
                              }
                            })}
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </TabPanel>
            <TabPanel value="Assignments">
              <Tbl title="Enumerators" data={data} onClickEdit />
            </TabPanel>
            <TabPanel value="Settings" className="space-y-4 max-sm:p-2">
              <Card className="shadow-none">
                <CardBody className="space-y-4 max-sm:p-4">
                  <h1 className="font-medium">Manage Survey</h1>
                  <hr className="border-blue-gray-200" />
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h1 className="font-normal text-sm">Required</h1>
                      <p className="text-xs font-normal">All questions are required.</p>
                    </div>
                    <Switch
                      color="green"
                      checked={survey.question.every(q => q.required === 1)}
                    />
                  </div>
                  <hr className="border-blue-gray-200" />
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h1 className="font-normal text-sm">Limit</h1>
                        <p className="text-xs font-normal">Set limit of responses.</p>
                      </div>
                      <Switch
                        color="green"
                        checked={switchLimit || Boolean(survey.limit?.trim())}
                      />
                    </div>
                    {(switchLimit || Boolean(survey.limit?.trim())) && (
                      <Inpt value={survey.limit} variant="standard" type="number" />
                    )}
                  </div>
                </CardBody>
              </Card>
            </TabPanel>
          </TabsBody>
        </div>
      </Tabs>
    </div>
  )
}

export default View