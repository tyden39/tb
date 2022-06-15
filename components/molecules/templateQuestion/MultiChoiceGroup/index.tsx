import { ChangeEvent, useEffect, useState, useRef } from 'react'

import { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Button } from 'rsuite'

import { InputField } from 'components/atoms/inputField'
import { TextAreaField } from 'components/atoms/textAreaField'
import { QuestionDataType } from 'interfaces/types'

import MultiChoiceTable from '../MultiChoice/table'
import { ContentField } from 'components/atoms/contentField'

type PropsType = {
  question: QuestionDataType
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
  isAudio?: boolean
}

export default function MultiChoiceGroup({
  question,
  register,
  setValue,
  isAudio = false,
}: PropsType) {
  const correctList = question?.correct_answers?.split('#') ?? []
  const answerList = question?.answers?.split('#') ?? ['***']
  const questionList = question?.question_text?.split('#') ?? []
  const [answerGroup, setAnswerGroup] = useState<AnswerGroup[]>(
    answerList.map((g: string, gIndex: number) => {
      return {
        key: new Date().getTime().toString() + gIndex,
        answerStrs: g,
        correctStrs: correctList[gIndex],
        questionText: questionList[gIndex],
      }
    }),
  )
  const fileRef = useRef(null)
  const [hasAudio, setHasAudio] = useState(
    question?.audio != '' && question?.audio != undefined,
  )

  useEffect(() => {
    register('question_text', {
      validate: (value: string) => {
        return (value ?? '').split('#').some((m) => m === '')
          ? 'Câu hỏi không được để trống'
          : true
      },
      maxLength: {
        value: 2000,
        message: 'Câu hỏi không được lớn hơn 2000 ký tự',
      },
      value: question?.question_text,
    })
    register('answers', {
      validate: (value: string) => {
        return (value ?? '')
          .split('#')
          .some((m) => m.split('*').some((g) => g === ''))
          ? 'Danh sách đáp án không được để trống'
          : true
      },
      maxLength: {
        value: 500,
        message: 'Danh sách đáp án không được lớn hơn 500 ký tự',
      },
      value: question?.answers,
    })
    register('correct_answers', {
      validate: (value: string) => {
        return (value ?? '').split('#').some((m) => m === '')
          ? 'Đáp án không được để trống'
          : true
      },
      maxLength: {
        value: 500,
        message: 'Đáp án không được lớn hơn 500 ký tự',
      },
      value: question?.correct_answers,
    })
    if (isAudio) {
      register('audio_file')
      register('audio', {
        maxLength: {
          value: 255,
          message: 'Audio không được lớn hơn 255 ký tự',
        },
        required: 'Audio không được để trống',
        value: question?.audio,
      })
      register('audio_script', {
        maxLength: {
          value: 2000,
          message: 'Nội dung bài nghe không được lớn hơn 2000 ký tự',
        },
        required: 'Nội dung bài nghe không được để trống',
        value: question?.audio_script,
      })
    } else {
      register('parent_question_text', {
        maxLength: {
          value: 2000,
          message: 'Câu hỏi chung không được lớn hơn 2000 ký tự',
        },
        required: 'Câu hỏi chung không được để trống',
        value: question?.parent_question_text,
      })
    }
  }, [])

  useEffect(() => {
    console.log(answerGroup)
    if (answerGroup) {
      updateFormData(answerGroup)
    }
  }, [answerGroup])

  const updateFormData = (answers: AnswerGroup[]) => {
    setValue('answers', answers.map((m) => m.answerStrs).join('#'))
    setValue('correct_answers', answers.map((m) => m.correctStrs).join('#'))
    setValue('question_text', answers.map((m) => m.questionText).join('#'))
  }

  const onAddQuestion = () => {
    const newQuestion: any = {
      key: new Date().getTime().toString() + (answerGroup?.length ?? 0),
      questionText: '',
      answerStrs: '***',
      correctStrs: null,
    }
    if (answerGroup) {
      setAnswerGroup([...answerGroup, newQuestion])
    } else {
      setAnswerGroup([newQuestion])
    }
  }

  const onChange = (index: number, data: any) => {
    const answer = answerGroup[index]
    answer.answerStrs = data.answers
    answer.correctStrs = data.correct_answers
    setAnswerGroup([...answerGroup])
  }

  const onChangeText = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const answer = answerGroup[index]
    answer.questionText = event.currentTarget.value
    setAnswerGroup([...answerGroup])
  }

  const onRemoveQuestion = (index: number) => {
    const ans = answerGroup.filter((m: any, mIndex: any) => mIndex !== index)
    setAnswerGroup([...ans])
  }

  const onChangeAudioScript = (data: any) => {
    if (isAudio) {
      setValue('audio_script', data.replaceAll('%lb%', '\n'))
    }
  }

  const onChangeFile = () => {
    if (fileRef.current.files.length > 0) {
      setValue('audio_file', fileRef.current.files[0])
      const urlAudio = URL.createObjectURL(fileRef.current.files[0])
      setValue('audio', urlAudio)
      setHasAudio(true)
    }
  }

  return (
    <div className="m-multi-choice">
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
        {!isAudio ? (
          <TextAreaField
            label="Nội dung bài đọc"
            register={register('parent_question_text', {
              maxLength: {
                value: 2000,
                message: 'Nội dung bài đọc không được lớn hơn 2000 ký tự',
              },
            })}
            defaultValue={question?.parent_question_text}
            className="form-input-stretch"
            style={{ flex: 1 }}
          />
        ) : (
          <ContentField
            className="form-input-stretch"
            label={'Nội dung bài nghe'}
            strValue={question?.audio_script}
            disableTab={true}
            onChange={onChangeAudioScript}
            style={{ flex: 1 }}
          />
        )}
      </div>
      <div style={{ width: '50%' }}>
        <div className="form-input-stretch" style={{ position: 'relative' }}>
          <TextAreaField
            label="Yêu cầu đề bài"
            register={register('parent_question_description', {
              maxLength: {
                value: 200,
                message: 'Yêu cầu đề bài chung không được lớn hơn 200 ký tự',
              },
            })}
            defaultValue={question?.parent_question_description}
            style={{ height: '9rem' }}
            inputStyle={isAudio ? { paddingBottom: '4.5rem' } : {}}
          />
          {isAudio && (
            <div className="box-action-info">
              <span className="add-new-answer"></span>
              <div className="box-media">
                <div
                  className={`box-media-input ${hasAudio ? 'has-data' : ''}`}
                  onClick={() =>
                    fileRef.current.dispatchEvent(new MouseEvent('click'))
                  }
                >
                  <img
                    src="/images/icons/ic-audio.png"
                    width={16}
                    height={16}
                  />
                  Audio
                  <input
                    ref={fileRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept=".mp3"
                    onChange={onChangeFile}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {answerGroup?.map((m, mIndex) => (
          <div
            key={m.key}
            className="form-input-stretch"
            style={{ position: 'relative' }}
          >
            <InputField
              label="Câu hỏi"
              type="text"
              defaultValue={m?.questionText}
              style={{ marginBottom: '1rem' }}
              inputStyle={{ paddingRight: '3rem' }}
              autoFocus={mIndex === answerGroup.length - 1}
              onChange={onChangeText.bind(null, mIndex)}
            />
            <MultiChoiceTable
              answerStr={m?.answerStrs}
              correctStr={m?.correctStrs}
              onChange={onChange.bind(null, mIndex)}
            />
            <img
              className="ic-delete-question"
              src="/images/icons/ic-trash.png"
              onClick={onRemoveQuestion.bind(null, mIndex)}
            />
          </div>
        ))}
        <div className="form-input-stretch">
          <Button
            appearance={'primary'}
            type="button"
            style={{
              backgroundColor: 'white',
              width: '20rem',
              color: '#5CB9D8',
              fontSize: '1.6rem',
              fontWeight: 600,
            }}
            onClick={onAddQuestion}
          >
            <label className="add-new-answer">
              <img src="/images/icons/ic-plus-sub.png" width={17} height={17} />{' '}
              Thêm câu hỏi
            </label>
          </Button>
        </div>
      </div>
    </div>
  )
}

type AnswerGroup = {
  key: string
  answerStrs: string
  correctStrs: string
  questionText: string
}
