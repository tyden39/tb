import { useEffect, useState } from 'react'
import { QuestionDataType } from 'interfaces/types'
import { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import MultiChoiceTable from '../MultiChoice/table'
import { InputField } from 'components/atoms/inputField'

type PropsType = {
  question: QuestionDataType
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
}

export default function MultiChoicePronoun({
  question,
  register,
  setValue,
}: PropsType) {
  useEffect(() => {
    register('answers', {
      validate: (value: string) => {
        return (value ?? '').split('*').some((m) => m === '')
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
      required: 'Đáp án không được để trống',
      maxLength: {
        value: 500,
        message: 'Đáp án không được lớn hơn 500 ký tự',
      },
      value: question?.correct_answers,
    })
  }, [])

  const updateFormData = (data: any) => {
    console.log(data)
    setValue('answers', data.answers)
    setValue('correct_answers', data.correct_answers)
  }

  return (
    <div className="m-multi-choice">
      <InputField
        label="Yêu cầu đề bài"
        type="text"
        register={register('question_description', {
          required: 'Yêu cầu đề bài không được để trống',
          maxLength: {
            value: 200,
            message: 'Yêu cầu đề bài không được lớn hơn 200 ký tự',
          },
        })}
        defaultValue={question?.question_description}
        className="form-input-stretch"
      />
      <MultiChoiceTable
        className="form-input-stretch"
        answerStr={question?.answers ?? '***'}
        correctStr={question?.correct_answers}
        styleBold={true}
        onChange={updateFormData}
      />
    </div>
  )
}
