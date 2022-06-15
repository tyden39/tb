import { useCallback, useEffect, useRef, useState } from 'react'

import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { useForm } from 'react-hook-form'
import { Button, Message, toaster } from 'rsuite'
import { Modal } from 'rsuite'
import { mutate } from 'swr'

import { paths } from 'api/paths'
import { Card } from 'components/atoms/card'
import { InputField } from 'components/atoms/inputField'
import { SelectField } from 'components/atoms/selectField'
import { TextAreaField } from 'components/atoms/textAreaField'
import { BreadCrumbNav } from 'components/molecules/breadCrumbNav'
import DragAndDrop from 'components/molecules/templateQuestion/DragAndDrop'
import FillInBlank from 'components/molecules/templateQuestion/FillInBlank'
import FillInBlank5 from 'components/molecules/templateQuestion/FillInBlank5'
import FillInBlankGroup from 'components/molecules/templateQuestion/FillInBlankGroup'
import LikertScale from 'components/molecules/templateQuestion/LikertScale'
import MatchingGame from 'components/molecules/templateQuestion/MatchingGame'
import MultiChoice from 'components/molecules/templateQuestion/MultiChoice'
import MultiChoiceGroup from 'components/molecules/templateQuestion/MultiChoiceGroup'
import MultiChoicePronoun from 'components/molecules/templateQuestion/MultiChoicePronoun'
import MultiResponse from 'components/molecules/templateQuestion/MultiResponse'
import SelectFromList from 'components/molecules/templateQuestion/SelectFromList'
import ShortAnswer from 'components/molecules/templateQuestion/ShortAnswer'
import TrueFalse from 'components/molecules/templateQuestion/TrueFalse'
import { ActivityPicker } from 'components/organisms/questionPreviewSection'
import { StickyFooter } from 'components/organisms/stickyFooter'
import { Wrapper } from 'components/templates/wrapper'
import { USER_ROLES } from 'interfaces/constants'
import {
  CERF_SELECTIONS,
  FORMAT_SELECTIONS,
  GRADE_SELECTIONS,
  LEVEL_SELECTIONS,
  PRACTICE_TEST_ACTIVITY,
  PUBLISHER_SELECTIONS,
  SERIES_SELECTIONS,
  SKILLS_SELECTIONS,
  TASK_SELECTIONS,
  TEST_TYPE_SELECTIONS,
  TYPES_SELECTIONS,
} from 'interfaces/struct'
import { BreadcrumbItemType, QuestionDataType } from 'interfaces/types'
import { useQuestion } from 'lib/swr-hook'
import { userInRight } from 'utils'
import { SelectField2 } from 'components/atoms/selectField2'
import { Loader } from 'rsuite'

type PropsType = {
  idQuestion: string
}

export default function QuestionUpdatePage({ idQuestion }: PropsType) {
  const router = useRouter()
  const [session] = useSession()
  const user: any = session?.user
  const viewMode = router.query.mode === 'view'

  const breadcrumbData: BreadcrumbItemType[] = [
    { name: 'Tổng quan', url: '/' },
    { name: 'Ngân hàng câu hỏi', url: '/questions' },
    {
      name: viewMode
        ? 'Xem câu hỏi'
        : idQuestion !== '-1'
        ? 'Cập nhật'
        : 'Tạo câu hỏi mới',
      url: null,
    },
  ]

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    unregister,
  } = useForm<any>()
  const [dataReview, setDataReview] = useState(null)
  const { question } = useQuestion(idQuestion)
  const [questionType, setQuestionType] = useState(question?.question_type)
  const isEditable =
    user?.is_admin ||
    question === undefined ||
    user?.id === (question as any)?.created_by

  const initQuestion = useRef(null)
  if (initQuestion.current == null && question) {
    initQuestion.current = question
  }

  const formRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (question) {
      setQuestionType(question.question_type)
      console.log('questionSlug', question)
    }
  }, [question])

  const onSubmit = async (formData: any) => {
    console.log('formData', formData)
    if (!isEditable) return
    try {
      // const isGroupChange = checkDataGroupChange(
      //   initQuestion.current,
      //   formData,
      //   checkProperties,
      // )
      // if (isGroupChange) {
      //   //to be continue
      // }
      formData.id = idQuestion
      const formData1 = new FormData()
      Object.keys(formData).forEach(
        (key) =>
          formData[key] != undefined && formData1.append(key, formData[key]),
      )
      setIsLoading(true)
      const res = await fetch(paths.api_questions, {
        method: idQuestion === '-1' ? 'POST' : 'PUT',
        body: formData1,
      })
      const json = await res.json()

      if (!res.ok) throw Error(json.message)

      toaster.push(
        <Message showIcon type="success">
          Lưu thành công
        </Message>,
      )
      if (idQuestion === '-1') {
        router.push({
          pathname: '/questions/[questionSlug]',
          query: { questionSlug: json.id },
        })
      } else {
        await mutate(`${paths.api_questions}/${idQuestion}`, json, false)
        if (json.image) {
          setValue('image', json.image)
        }
        if (json.audio) {
          setValue('audio', json.audio)
        }
      }
    } catch (e: any) {
      throw Error(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const checkDataGroupChange = useCallback(
    (oldData: any, newData: any, properties: string[]) => {
      for (const property of properties) {
        if ((oldData[property] ?? '') != newData[property]) return true
      }
      return false
    },
    [],
  )

  const renderError = useCallback((errors: any) => {
    const list = []
    for (const prop in errors) {
      list.push(
        <p
          key={prop}
          className="form-error-message"
        >{`* ${errors[prop].message}`}</p>,
      )
    }
    return list
  }, [])

  const onSelectChange = (name: string, value: any) => {
    setValue(name, value, {
      shouldValidate: true,
    })
    if (name === 'question_type') {
      if (value != questionType) {
        unregister('audio')
        unregister('audio_file')
        unregister('image')
        unregister('image_file')
        unregister('video')
        unregister('parent_question_text')
        unregister('parent_question_description')
        unregister('audio_script')
        unregister('question_text')
        unregister('question_description')
        unregister('answers')
        unregister('correct_answers')
        setQuestionType(null)
        setTimeout(() => {
          setQuestionType(value)
        }, 0)
      }
    }
  }

  const hasImage = questionImage.includes(questionType)
  const hasAudio = questionAudio.includes(questionType)
  const isOperator = userInRight([USER_ROLES.Operator], session)

  const renderQuestionType = () => {
    if (PRACTICE_TEST_ACTIVITY[questionType] === 1) {
      return (
        <MultiChoice
          question={question}
          register={register}
          setValue={setValue}
          isReading={questionType !== 'MC3'}
          isImage={hasImage}
        />
      )
    } else if (PRACTICE_TEST_ACTIVITY[questionType] === 4) {
      return (
        <MultiChoicePronoun
          question={question}
          register={register}
          setValue={setValue}
        />
      )
    } else if (PRACTICE_TEST_ACTIVITY[questionType] === 11) {
      return (
        <MultiChoiceGroup
          question={question}
          register={register}
          setValue={setValue}
          isAudio={hasAudio}
        />
      )
    } else if (PRACTICE_TEST_ACTIVITY[questionType] === 2) {
      return (
        <FillInBlank
          question={question}
          register={register}
          setValue={setValue}
        />
      )
    } else if (PRACTICE_TEST_ACTIVITY[questionType] === 3) {
      return (
        <FillInBlankGroup
          question={question}
          register={register}
          setValue={setValue}
          isAudio={hasAudio}
          isImage={hasImage}
        />
      )
    } else if (PRACTICE_TEST_ACTIVITY[questionType] === 5) {
      return (
        <SelectFromList
          question={question}
          register={register}
          setValue={setValue}
        />
      )
    } else if (PRACTICE_TEST_ACTIVITY[questionType] === 6) {
      return (
        <DragAndDrop
          question={question}
          register={register}
          setValue={setValue}
        />
      )
    } else if (PRACTICE_TEST_ACTIVITY[questionType] === 7) {
      return (
        <ShortAnswer
          question={question}
          register={register}
          setValue={setValue}
        />
      )
    } else if (PRACTICE_TEST_ACTIVITY[questionType] === 8) {
      return (
        <TrueFalse
          question={question}
          register={register}
          setValue={setValue}
          isAudio={hasAudio}
          isReading={questionType === 'TF2'}
        />
      )
    } else if (PRACTICE_TEST_ACTIVITY[questionType] === 9) {
      return (
        <MatchingGame
          question={question}
          register={register}
          setValue={setValue}
          isAudio={hasAudio}
          isReading={questionType === 'MG1'}
        />
      )
    } else if (PRACTICE_TEST_ACTIVITY[questionType] === 12) {
      return (
        <MultiResponse
          question={question}
          register={register}
          setValue={setValue}
          isAudio={hasAudio}
        />
      )
    } else if (PRACTICE_TEST_ACTIVITY[questionType] === 14) {
      return (
        <FillInBlank5
          question={question}
          register={register}
          setValue={setValue}
        />
      )
    } else if (PRACTICE_TEST_ACTIVITY[questionType] === 15) {
      return (
        <LikertScale
          question={question}
          register={register}
          setValue={setValue}
          isAudio={hasAudio}
        />
      )
    }
    return null
  }

  const onClickReview = () => {
    handleSubmit((data) => {
      console.log(data)
      setDataReview(null)
      setTimeout(() => {
        setDataReview({ ...data })
      }, 0)
    })(formRef.current)
  }

  return (
    <Wrapper
      className="p-question-update"
      pageTitle={`${
        viewMode ? 'Xem' : idQuestion !== '-1' ? 'Cập nhật' : 'Tạo mới'
      } câu hỏi`}
    >
      <div className="p-detail-format__breadcrumb">
        <BreadCrumbNav data={breadcrumbData} />
      </div>
      {(idQuestion === '-1' || question) && (
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Card
            title={'THÔNG TIN CHUNG'}
            style={{ marginTop: '1.8rem', zIndex: 3 }}
          >
            <div className="p-question-update__container">
              <div
                className="__form-control __form-container"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  pointerEvents: viewMode ? 'none' : 'auto',
                }}
              >
                <SelectField2
                  label="Loại câu hỏi"
                  register={register('question_type', {
                    required: 'Loại câu hỏi không được để trống',
                  })}
                  defaultValue={question?.question_type}
                  data={TASK_SELECTIONS}
                  onChange={onSelectChange.bind(null, 'question_type')}
                  className="form-input col-4"
                  disabled={question != null}
                  style={{ zIndex: 11 }}
                />
                <SelectField
                  label="Khối lớp"
                  register={register('grade', {
                    required: 'Khối lớp không được để trống',
                  })}
                  defaultValue={question?.grade}
                  data={GRADE_SELECTIONS}
                  onChange={onSelectChange.bind(null, 'grade')}
                  className="form-input col-4"
                  style={{ zIndex: 10 }}
                />
                <SelectField
                  label="Môn học"
                  register={register('test_type', {
                    required: 'Môn học không được để trống',
                  })}
                  defaultValue={question?.test_type}
                  data={TEST_TYPE_SELECTIONS}
                  onChange={onSelectChange.bind(null, 'test_type')}
                  className="form-input col-4"
                  style={{ zIndex: 9 }}
                />
                <SelectField
                  label="Kỹ năng"
                  register={register('skills', {
                    required: 'Kỹ năng không được để trống',
                  })}
                  defaultValue={question?.skills.toString()}
                  data={SKILLS_SELECTIONS}
                  onChange={onSelectChange.bind(null, 'skills')}
                  className="form-input col-4"
                  style={{ zIndex: 8 }}
                />
                <SelectField
                  label="Độ khó"
                  register={register('level', {
                    required: 'Độ khó không được để trống',
                  })}
                  defaultValue={question?.level.toString()}
                  data={LEVEL_SELECTIONS}
                  onChange={onSelectChange.bind(null, 'level')}
                  className="form-input col-4"
                  style={{ zIndex: 4 }}
                />
                {isOperator && (
                  <>
                    <SelectField
                      label="Nhà xuất bản"
                      register={register('publisher', {
                        required: 'Nhà xuất bản không được để trống',
                      })}
                      defaultValue={question?.publisher}
                      data={PUBLISHER_SELECTIONS}
                      onChange={onSelectChange.bind(null, 'publisher')}
                      className="form-input col-4"
                      style={{ zIndex: 6 }}
                    />
                    <SelectField
                      label="Chương trình"
                      register={register('series', {
                        required: 'Chương trình không được để trống',
                      })}
                      defaultValue={question?.series}
                      data={SERIES_SELECTIONS}
                      onChange={onSelectChange.bind(null, 'series')}
                      className="form-input col-4"
                      style={{ zIndex: 5 }}
                    />

                    <SelectField
                      label="Tiêu chuẩn"
                      register={register('format', {
                        required: 'Tiêu chuẩn không được để trống',
                      })}
                      defaultValue={question?.format}
                      data={FORMAT_SELECTIONS}
                      onChange={onSelectChange.bind(null, 'format')}
                      className="form-input col-4"
                      style={{ zIndex: 3 }}
                    />
                    <SelectField
                      label="Kỳ thi"
                      register={register('types', {
                        required: 'Kỳ thi không được để trống',
                      })}
                      defaultValue={question?.types}
                      data={TYPES_SELECTIONS}
                      onChange={onSelectChange.bind(null, 'types')}
                      className="form-input col-4"
                      style={{ zIndex: 2 }}
                    />
                    <SelectField
                      label="CEFR"
                      register={register('cerf', {
                        required: 'CEFR không được để trống',
                      })}
                      defaultValue={question?.cerf}
                      data={CERF_SELECTIONS}
                      onChange={onSelectChange.bind(null, 'cerf')}
                      className="form-input col-4"
                      style={{ zIndex: 1 }}
                    />
                    <InputField
                      label="Nhóm (Không bắt buộc)"
                      type="text"
                      register={register('group', {
                        maxLength: {
                          value: 20,
                          message: 'Nhóm không được lớn hơn 20 ký tự',
                        },
                      })}
                      defaultValue={question?.group}
                      className="form-input col-4"
                    />
                  </>
                )}
              </div>
            </div>
          </Card>
          {questionType && (
            <Card
              title={TASK_SELECTIONS.find(
                (m) => m.code === questionType,
              )?.display.toUpperCase()}
              style={{
                marginTop: '1.8rem',
                pointerEvents: viewMode ? 'none' : 'auto',
                backgroundColor: '#C9ECF8',
              }}
            >
              <div className="p-question-update__container">
                <div className="__form-control __form-container">
                  {/* <div style={{ width: '33.3%' }}>
                    <InputField
                      label="Hình ảnh"
                      type="text"
                      register={register('image', {
                        maxLength: {
                          value: 255,
                          message: 'Hình ảnh không được lớn hơn 255 ký tự',
                        },
                        required: hasImage
                          ? 'Hình ảnh không được để trống'
                          : false,
                        value: question?.image,
                      })}
                      disabled={!hasImage}
                      defaultValue={question?.image}
                      className="form-input-stretch"
                    />
                    <InputField
                      label="Audio"
                      type="text"
                      register={register('audio', {
                        maxLength: {
                          value: 255,
                          message: 'Audio không được lớn hơn 255 ký tự',
                        },
                        required: hasAudio
                          ? 'Audio không được để trống'
                          : false,
                        value: question?.audio,
                      })}
                      disabled={!hasAudio}
                      defaultValue={question?.audio}
                      className="form-input-stretch"
                    />
                    <InputField
                      label="Video"
                      type="text"
                      register={register('video', {
                        maxLength: {
                          value: 255,
                          message: 'Video không được lớn hơn 255 ký tự',
                        },
                        value: question?.video,
                      })}
                      disabled={true}
                      defaultValue={question?.video}
                      className="form-input-stretch"
                    />
                  </div>
                  <TextAreaField
                    label="Hướng dẫn chung (Không bắt buộc)"
                    register={register('parent_question_description', {
                      maxLength: {
                        value: 200,
                        message: 'Hướng dẫn chung không được lớn hơn 200 ký tự',
                      },
                    })}
                    defaultValue={question?.parent_question_description}
                    className="form-input-haft"
                  />
                  <TextAreaField
                    label="Câu hỏi chung (Không bắt buộc)"
                    register={register('parent_question_text', {
                      maxLength: {
                        value: 2000,
                        message: 'Câu hỏi chung không được lớn hơn 2000 ký tự',
                      },
                    })}
                    defaultValue={question?.parent_question_text}
                    className="form-input-haft"
                  /> */}
                  {renderQuestionType()}
                </div>
                <div className={'group-error'}>{renderError(errors)}</div>
              </div>
            </Card>
          )}
          <StickyFooter containerStyle={{ justifyContent: 'space-between' }}>
            <Button className="__main-btn" onClick={onClickReview}>
              <img src="/images/icons/ic-show-white.png" alt="Review" />
              <span>Xem trước</span>
            </Button>
            {!viewMode && isEditable && (
              <Button
                className="__main-btn"
                type="submit"
                style={{ backgroundColor: '#6868AC' }}
              >
                <span>Lưu lại</span>
              </Button>
            )}
          </StickyFooter>
        </form>
      )}
      <Modal
        className="review-modal"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0,
        }}
        open={dataReview != null}
        onClose={() => setDataReview(null)}
      >
        <Modal.Header>
          <Modal.Title>XEM TRƯỚC CÂU HỎI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ActivityPicker data={dataReview} type={dataReview?.question_type} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setDataReview(null)} appearance="subtle">
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000045',
          }}
        >
          <Loader size="md" />
        </div>
      )}
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context

  return { props: { idQuestion: query.questionSlug } }
}

const questionImage = ['MC2', 'FB4', 'FB5']

const questionAudio = [
  'MC6',
  'FB3',
  'FB4',
  'FB5',
  'TF1',
  'MG3',
  'MR2',
  'MR3',
  'LS2',
]
