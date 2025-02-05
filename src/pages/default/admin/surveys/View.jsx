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
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import * as XLSX from "xlsx"

const tabs = ["Questions", "Responses"]
const colors = ["#f44336", "#4caf50", "#2196f3", "#ff9800", "#3f51b5"]

const View = () => {
  const [activeTab, setActiveTab] = useState("Questions")
  const { uuid } = useParams()
  const [survey, setSurvey] = useState({})
  const [response, setResponse] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSurveyResponse = async () => {
      await getSurvey()
      await getResponse()
      setLoading(false)
    }
    getSurveyResponse()
  }, [uuid])

  const getSurvey = async () => {
    await axios.get('/api/survey/get-survey-questionnaire', {
      params: { uuid }
    })
      .then(({ data }) => {
        setSurvey(data)
      })
  }

  const getResponse = async () => {
    await axios.get('/api/survey/get-response', {
      params: { uuid }
    })
      .then(({ data }) => {
        setResponse(data)
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
    // Initialize option counts based on option IDs
    const optionCounts = question.option.map(opt => ({
      id: opt.id, // Use option ID instead of text
      text: opt.text,
      count: 0,
    }));

    // Iterate through responses and count selected options
    response.forEach(res => {
      res.answer.forEach(ans => {
        if (ans.question_id === question.id) {
          // Get the selected option IDs from the answer
          const selectedOptionIds = ans.answer_option.map(ao => ao.option_id);

          // Update counts based on option IDs
          selectedOptionIds.forEach(optionId => {
            const option = optionCounts.find(opt => opt.id === optionId);
            if (option) {
              option.count += 1;
            }
          });
        }
      });
    });

    // Calculate total responses
    const totalResponses = optionCounts.reduce((sum, opt) => sum + opt.count, 0);

    // Prepare data for the pie chart
    const series = optionCounts.map(opt => opt.count);
    const labels = optionCounts.map(opt => opt.text);

    return { series, labels, totalResponses };
  }

  const exportToExcel = () => {
    // Prepare data for the Excel file
    const data = [];

    // Add headers
    const headers = ["Question", "Response"];
    data.push(headers);

    // Add rows for each question and response
    survey.question?.forEach((question) => {
      response.forEach((res) => {
        const answer = res.answer.find((ans) => ans.question_id === question.id);
        if (answer) {
          const row = [question.text, answer.text];
          data.push(row);
        }
      });
    });

    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, `Survey_Responses_${uuid}.xlsx`);
  };

  if (loading) {
    return <ScreenLoading loading={loading} />
  }

  return (
    <Tabs value={activeTab}>
      <div className="h-[100px] px-4 pt-4 lg:z-10 lg:fixed left-[272px] flex flex-col justify-between right-0 top-0 bg-white border-b">
        <div className="grid grid-cols-2 items-center h-10">
          <h1 className="text-lg font-medium">
            {survey.title}
          </h1>
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
                className={`text-sm ${activeTab === tab && "text-gray-800 font-medium"}`}
              >
                {tab}
              </Tab>
            ))}
          </TabsHeader>
        </div>
      </div>
      <div className="lg:mt-[100px] max-w-3xl mx-auto">
        <TabsBody>
          <TabPanel value="Questions" className="space-y-4 pb-40">
            <Card className="shadow-none">
              <CardBody className="space-y-4">
                <Inpt value={survey.title} label="Title" variant="standard" />
                <Textarea value={survey.description} label="Description (optional)" color="green" />
              </CardBody>
            </Card>
            {survey.question?.map((question, qIndex) => (
              <Card key={qIndex} className={`shadow-none`}>
                <CardBody className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Inpt value={question.text} label={`Question ${qIndex + 1}`} variant="standard" />
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
          </TabPanel>
          <TabPanel value="Responses" className="max-sm:p-2">
            <Card className="shadow-none">
              <CardBody className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="font-medium">
                    {response.length}
                  </h1>
                  <p className="text-sm font-normal">
                    {response.length > 1 ? 'Responses' : 'Response'}
                  </p>
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
                            const answer = res.answer.find(ans => ans.question_id === question.id);
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
        </TabsBody>
      </div>
    </Tabs>
  )
}

export default View