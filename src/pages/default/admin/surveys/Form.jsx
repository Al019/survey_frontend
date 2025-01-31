import { CloudArrowUpIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import Btn from "../../../../components/Button"
import { Button, Card, CardBody, Option, Select, Spinner, Switch, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Textarea, Tooltip } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import { IoMdRadioButtonOff } from "react-icons/io"
import { IoCloseOutline } from "react-icons/io5"
import { FiTrash2 } from "react-icons/fi"
import { useParams } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid'
import { MdCheckBoxOutlineBlank, MdOutlineShortText } from "react-icons/md"
import { PiTextAlignLeft } from "react-icons/pi"
import Inpt from "../../../../components/Input"
import axios from "../../../../api/axios"

const tabs = ["Questions", "Responses", "Settings"]

const Form = () => {
  const [activeTab, setActiveTab] = useState("Questions")
  const { uuid } = useParams()
  const [header, setHeader] = useState({})
  const [questions, setQuestions] = useState([])
  const [typing, setTyping] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getHeader()
    getQuestion()
  }, [])

  const getHeader = async () => {
    await axios.get('/api/survey/get-header', {
      params: { uuid }
    })
      .then(({ data }) => {
        setHeader(data)
      })
  }

  const getQuestion = async () => {
    await axios.get('/api/survey/get-question', {
      params: { uuid }
    })
      .then(({ data }) => {
        setQuestions(data)
      })
  }

  const handleHeaderChange = (field, value) => {
    setSaving(true)
    const newHeader = ({ ...header, [field]: value })
    setHeader(newHeader)
    if (typing) {
      clearTimeout(typing)
    }
    const editHeader = async () => {
      await axios.post('/api/survey/edit-header', newHeader)
        .finally(() => {
          setSaving(false)
        })
    }
    const newTimeOut = setTimeout(() => {
      editHeader()
    }, 2000)
    setTyping(newTimeOut)
  }

  const handleQuestionChange = async (qIndex, field, value) => {
    setSaving(true)
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions]

      if (field === "type") {
        if (value === "text") {
          updatedQuestions[qIndex].option = [
            {
              id: uuidv4(),
              text: "Text",
            },
          ];
        } else if (
          ["multiple_choice", "checkboxes", "dropdown"].includes(value)
        ) {
          updatedQuestions[qIndex].option = [
            {
              id: uuidv4(),
              text: "Question option",
            },
          ];
        }
      }

      updatedQuestions[qIndex][field] = value
      return updatedQuestions
    })

    const updatedQuestion = { ...questions[qIndex], [field]: value }

    if (typing) {
      clearTimeout(typing)
    }
    const editQuestion = async () => {
      await axios.post('/api/survey/edit-question', { uuid, question: updatedQuestion })
        .finally(() => {
          setSaving(false)
        })
    }
    const newTimeOut = setTimeout(() => {
      editQuestion()
    }, 2000)
    setTyping(newTimeOut)
  }

  const handleOptionChange = (qIndex, oIndex, value) => {
    setSaving(true)
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[qIndex].option[oIndex].text = value;
      return updatedQuestions;
    });

    const updatedOption = {
      id: questions[qIndex].option[oIndex].id,
      question_id: questions[qIndex].id,
      text: value,
    };

    if (typing) {
      clearTimeout(typing)
    }
    const editOption = async () => {
      await axios.post('/api/survey/edit-option', updatedOption)
        .finally(() => {
          setSaving(false)
        })
    }
    const newTimeOut = setTimeout(() => {
      editOption()
    }, 2000)
    setTyping(newTimeOut)
  };

  const addQuestion = async () => {
    const newQuestion = {
      id: uuidv4(),
      uuid: uuid,
      text: "Untitled question",
      type: "multiple_choice",
      required: 0,
      option: [
        {
          id: uuidv4(),
          text: "Question option"
        }
      ],
    }

    setQuestions((prev) => [
      ...prev,
      newQuestion
    ])

    await axios.post('/api/survey/add-question', newQuestion)
      .then(() => {
        getQuestion()
      })
  }

  const deleteQuestion = async (qIndex) => {
    const questionId = questions[qIndex].id
    const surveyId = questions[qIndex].survey_id

    setQuestions((prev) => prev.filter((_, i) => i !== qIndex));

    await axios.post(`/api/survey/delete-question`, {
      id: questionId,
      survey_id: surveyId
    })
  }

  const addOption = async (qIndex) => {
    const newOption = {
      id: uuidv4(),
      text: "Question option",
    }

    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((q, i) =>
        i === qIndex
          ? {
            ...q,
            option: [...q.option, newOption],
          }
          : q
      )
      return updatedQuestions;
    })

    await axios.post('/api/survey/add-option', {
      question_id: questions[qIndex].id,
      option: newOption,
    }).then(() => {
      getQuestion()
    })
  }

  const deleteOption = async (questionIndex, optIndex) => {
    const optionId = questions[questionIndex].option[optIndex].id
    const questionId = questions[questionIndex].id

    setQuestions((prevQuestions) => {
      return prevQuestions.map((q, i) => {
        if (i === questionIndex) {
          return {
            ...q,
            option: q.option.filter((_, oIndex) => oIndex !== optIndex),
          };
        }
        return q;
      })
    })

    await axios.post(`/api/survey/delete-option`, {
      id: optionId,
      question_id: questionId,
    })
      .then(() => {
        getQuestion()
      })
  }

  const handlePublishSurvey = async () => {
    await axios.post(`/api/survey/publish-survey`, {
      uuid
    })
  }

  return (
    <Tabs value={activeTab}>
      <div className="h-[100px] px-4 pt-4 z-10 fixed left-[272px] flex flex-col justify-between right-0 top-0 bg-white border-b">
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium">
              {header.title}
            </h1>
            <Tooltip content={!saving ? "Saved" : "Saving"} placement="bottom">
              {!saving ? <CloudArrowUpIcon className="size-5 text-blue-500" /> : <Spinner color="blue" className="size-4" />}
            </Tooltip>
          </div>
          <div className="flex justify-end">
            <Btn onClick={handlePublishSurvey} label="Publish" color="blue" />
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
            <div>
              <div className="p-2 bg-green-500 rounded-t-xl"></div>
              <div className="bg-white p-6 rounded-b-xl space-y-4">
                <Inpt value={header.title} onChange={(e) => handleHeaderChange("title", e.target.value)} label="Title" variant="standard" />
                <Textarea value={header.description} onChange={(e) => handleHeaderChange("description", e.target.value)} label="Description" color="green" />
              </div>
            </div>
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="bg-white p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-4">
                  <Inpt value={question.text} onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)} label={`Question ${qIndex + 1}`} variant="standard" />
                  <div className="w-72">
                    <Select value={question.type} onChange={(val) => handleQuestionChange(qIndex, "type", val)} label="Select type" color="green">
                      <Option value="multiple_choice">Multiple choice</Option>
                      <Option value="checkboxes">Checboxes</Option>
                      <Option value="dropdown">Dropdown</Option>
                      <Option value="text">Text</Option>
                    </Select>
                  </div>
                </div>
                {question.option.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    {question.type === 'multiple_choice' && <IoMdRadioButtonOff className="size-6 text-blue-gray-500 me-1.5" />}
                    {question.type === 'checkboxes' && <MdCheckBoxOutlineBlank className="size-6 text-blue-gray-500 me-1.5" />}
                    {question.type === 'dropdown' && <p className="w-5 text-base text-blue-gray-500">{oIndex + 1}.</p>}
                    {question.type === 'text' && <PiTextAlignLeft className="size-6 text-blue-gray-500 me-1.5" />}
                    <Inpt value={option.text} onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    } label={question.type !== 'text' && `Option ${oIndex + 1}`} variant="standard" disabled={question.type === 'text'} />
                    <div className={question.type === 'text' && 'hidden'}>
                      <Tooltip content="Remove" placement="bottom">
                        <Button onClick={() => deleteOption(qIndex, oIndex)} variant="text" className="p-1.5 rounded-full">
                          <IoCloseOutline className="size-5 text-blue-gray-500" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
                {question.type !== 'text' && (
                  <Btn onClick={() => addOption(qIndex)} label="Add option" variant="outlined" size="sm" color="green" />
                )}
                <hr className="border-blue-gray-200" />
                <div className="flex justify-end items-center gap-4">
                  <Tooltip content="Delete question" placement="bottom">
                    <Button onClick={() => deleteQuestion(qIndex)} variant="text" className="p-2 rounded-full">
                      <FiTrash2 className="size-5 text-blue-gray-500" />
                    </Button>
                  </Tooltip>
                  <Switch checked={question.required === 1} value={question.required === 1 ? 0 : 1} onChange={(e) => handleQuestionChange(qIndex, "required", e.target.checked ? 1 : 0)} labelProps={{ className: "text-sm" }} label="Required" color="green" />
                </div>
              </div>
            ))}
            <div className="left-[272px] fixed bottom-0 inset-x-0 flex items-center justify-center">
              <div className="flex items-center justify-center border-t max-w-[736px] w-full p-2 bg-white rounded-t-xl">
                <Tooltip content="Add question" placement="top">
                  <Button onClick={addQuestion} variant="text" className="p-2">
                    <PlusCircleIcon className="size-7 text-blue-gray-500" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </TabPanel>
        </TabsBody>
      </div>
    </Tabs>
  )
}

export default Form