import { TextAreaField } from 'components/atoms/textAreaField'
import { QuestionDataType } from 'interfaces/types'
import { useEffect } from 'react'
import { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import DragDropBoxWord from './boxWord'

type PropsType = {
  question: QuestionDataType
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
}

export default function DragAndDrop({
  question,
  register,
  setValue,
}: PropsType) {
  useEffect(() => {
    register('correct_answers', {
      required: 'Đáp án không được để trống',
      maxLength: {
        value: 500,
        message: 'Đáp án không được lớn hơn 500 ký tự',
      },
      value: question?.correct_answers,
    })
  }, [])

  const onCorrectAnswerChange = (data: any) => {
    console.log(data)
    setValue('answers', data.answers)
    setValue('correct_answers', data.correct_answers)
  }

  return (
    <div className="m-drag-and-drop">
      <TextAreaField
        label="Yêu cầu đề bài"
        defaultValue={question?.question_description}
        register={register('question_description', {
          required: 'Yêu cầu đề bài không được để trống',
          maxLength: {
            value: 200,
            message: 'Yêu cầu đề bài không được lớn hơn 200 ký tự',
          },
        })}
        className="form-input-stretch"
        style={{ height: '6rem' }}
      />
      <DragDropBoxWord
        answerStr={question?.answers}
        correctStr={question?.correct_answers}
        onChange={onCorrectAnswerChange}
        className="form-input-stretch"
      />
    </div>
  )
}
