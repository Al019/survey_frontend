import { PlusCircleIcon } from "@heroicons/react/24/outline"
import Btn from "../../../../components/Button"
import { Button, Card, CardBody, Option, Select, Switch, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Textarea, Tooltip } from "@material-tailwind/react"
import { useEffect, useRef, useState } from "react"
import { IoMdRadioButtonOff, IoIosArrowDown } from "react-icons/io"
import { IoCloseOutline } from "react-icons/io5"
import { FiTrash2 } from "react-icons/fi"
import { useNavigate, useParams } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid'
import { MdCheckBoxOutlineBlank } from "react-icons/md"
import Inpt from "../../../../components/Input"
import axios from "../../../../api/axios"
import { RxTextAlignLeft } from "react-icons/rx";
import { ScreenLoading } from "../../../../components/Loading"

const tabs = ["Questions", "Responses", "Settings"]

const Form = () => {
  const [activeTab, setActiveTab] = useState("Questions")
  const { uuid } = useParams()
  const [selected, setSelected] = useState(1)
  const questionRefs = useRef([])
  const navigate = useNavigate()
  const [btnLoading, setBtnLoading] = useState(false)
  const [survey, setSurvey] = useState({
    title: "Untitled form",
    description: "",
    questions: [
      {
        text: "Untitled question",
        type: "radio",
        required: 0,
        options: [
          {
            text: "Question option"
          }
        ]
      }
    ]
  })

  const handleChangeHeader = (field, value) => {
    setSurvey({ ...survey, [field]: value })
  }

  const handleChangeQuestion = (qIndex, field, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[qIndex][field] = value;

    if (value === 'input') {
      updatedQuestions[qIndex].options = [{ text: 'Text' }];
    } else if (['radio', 'checkbox', 'select'].includes(value)) {
      updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.map(option => ({
        ...option,
        text: 'Question option',
      }))
    }

    setSurvey({
      ...survey,
      questions: updatedQuestions,
    })
  }

  const handleAddQuestion = () => {
    const newQuestion = {
      text: "Untitled question",
      type: "radio",
      required: 0,
      options: [{ text: "Question option" }]
    }

    setSurvey(prevSurvey => {
      const updatedQuestions = [...prevSurvey.questions]
      const insertIndex = selected === 0 ? 0 : selected
      updatedQuestions.splice(insertIndex, 0, newQuestion)

      setTimeout(() => {
        setSelected(insertIndex + 1)
        questionRefs.current[insertIndex]?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)

      return { ...prevSurvey, questions: updatedQuestions }
    })
  }

  const handleRemoveQuestion = (qIndex) => {
    setSurvey((prev) => {
      const updatedQuestions = prev.questions.filter((_, index) => index !== qIndex)

      let newSelected = selected

      if (updatedQuestions.length === 0) {
        newSelected = 0
      } else if (selected === qIndex + 1) {
        newSelected = qIndex === 0 ? 1 : qIndex
      } else if (selected > qIndex + 1) {
        newSelected -= 1
      }

      setTimeout(() => {
        setSelected(newSelected)
        if (newSelected > 0) {
          questionRefs.current[newSelected - 1]?.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100)

      return { ...prev, questions: updatedQuestions }
    })
  }

  const handleChangeOption = (qIndex, oIndex, value) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[qIndex].options[oIndex].text = value
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const handleAddOption = (qIndex) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[qIndex].options.push({ text: "Question option" })
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const handleRemoveOption = (qIndex, oIndex) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[qIndex].options.splice(oIndex, 1)
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const handlePublish = async () => {
    setBtnLoading(true)
    await axios.post('/api/survey/create-survey', { uuid: uuidv4(), survey })
      .then(() => {
        navigate(-1)
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  return (
    <div>
      <Tabs value={activeTab}>
        <div className="h-[100px] px-4 pt-4 z-10 fixed left-[272px] flex flex-col justify-between right-0 top-0 bg-white border-b">
          <div className="grid grid-cols-2 items-center">
            <h1 className="text-lg font-medium">
              {survey.title}
            </h1>
            <div className="flex justify-end">
              <Btn onClick={handlePublish} label="Publish" color="blue" />
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
              <Card onClick={() => setSelected(0)} className={selected === 0 && "border-2 border-green-500"}>
                <CardBody className="space-y-4">
                  <Inpt value={survey.title} onChange={(e) => handleChangeHeader("title", e.target.value)} label="Title" variant="standard" />
                  <Textarea value={survey.description} onChange={(e) => handleChangeHeader("description", e.target.value)} label="Description (optional)" color="green" />
                </CardBody>
              </Card>
              {survey.questions.map((question, qIndex) => (
                <Card ref={el => questionRefs.current[qIndex] = el} onClick={() => setSelected(qIndex + 1)} key={qIndex} className={selected === qIndex + 1 && "border-2 border-green-500"}>
                  <CardBody className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Inpt value={question.text} onChange={(e) => handleChangeQuestion(qIndex, "text", e.target.value)} label={`Question ${qIndex + 1}`} variant="standard" />
                      <div className="w-fit">
                        <Select value={question.type} onChange={(val) => handleChangeQuestion(qIndex, "type", val)} label="Type" color="green">
                          <Option value="radio">Multiple choice</Option>
                          <Option value="checkbox">Checkboxes</Option>
                          <Option value="select">Dropdown</Option>
                          <Option value="input">Text</Option>
                        </Select>
                      </div>
                    </div>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        {question.type === 'radio' && <IoMdRadioButtonOff className="size-6 text-blue-gray-500 me-1.5" />}
                        {question.type === 'checkbox' && <MdCheckBoxOutlineBlank className="size-6 text-blue-gray-500 me-1.5" />}
                        {question.type === 'select' && <IoIosArrowDown className="size-6 text-blue-gray-500 me-1.5" />}
                        {question.type === 'input' && <RxTextAlignLeft className="size-6 text-blue-gray-500 me-1.5" />}
                        <Inpt value={option.text} onChange={(e) => handleChangeOption(qIndex, oIndex, e.target.value)} label={question.type !== 'input' && `Option ${oIndex + 1}`} variant="standard" disabled={question.type === 'input'} className="disabled:bg-transparent disabled:cursor-default" />
                        <div className={question.type === 'input' && 'hidden'}>
                          <Tooltip content="Remove" placement="bottom">
                            <Button onClick={() => handleRemoveOption(qIndex, oIndex)} variant="text" className="p-1.5 rounded-full">
                              <IoCloseOutline className="size-5 text-blue-gray-500" />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                    {question.type !== 'input' && (
                      <Btn onClick={() => handleAddOption(qIndex)} label="Add option" variant="outlined" size="sm" color="green" />
                    )}
                    <hr className="border-blue-gray-200" />
                    <div className="flex justify-end items-center gap-4">
                      <Tooltip content="Delete question" placement="bottom">
                        <Button onClick={() => handleRemoveQuestion(qIndex)} variant="text" className="p-2 rounded-full">
                          <FiTrash2 className="size-5 text-blue-gray-500" />
                        </Button>
                      </Tooltip>
                      <Switch checked={question.required === 1} value={question.required === 1 ? 0 : 1} onChange={(e) => handleChangeQuestion(qIndex, "required", e.target.checked ? 1 : 0)} labelProps={{ className: "text-sm" }} label="Required" color="green" />
                    </div>
                  </CardBody>
                </Card>
              ))}
              <div className="left-[272px] fixed bottom-0 inset-x-0 flex items-center justify-center">
                <Card className="flex items-center justify-center border-t max-w-[736px] w-full p-2 rounded-none rounded-t-xl">
                  <Tooltip content="Add question" placement="top">
                    <Button onClick={handleAddQuestion} variant="text" className="p-2">
                      <PlusCircleIcon className="size-7 text-blue-gray-500" />
                    </Button>
                  </Tooltip>
                </Card>
              </div>
            </TabPanel>
          </TabsBody>
        </div>
      </Tabs>

      <ScreenLoading loading={btnLoading} />
    </div>
  )
}

export default Form