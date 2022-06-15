import { useEffect, useRef, useState } from 'react'

import { UseFormRegister, UseFormSetValue } from 'react-hook-form'

import { ContentField } from 'components/atoms/contentField'
import { TextAreaField } from 'components/atoms/textAreaField'
import { QuestionDataType } from 'interfaces/types'
import FillInBlank5Table from './table'

type PropsType = {
  question: QuestionDataType
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
}

export default function FillInBlank5({
  question,
  register,
  setValue,
}: PropsType) {
  const inputRef = useRef(null)
  const fileRef = useRef(null)
  const fileImgRef = useRef(null)
  const [hasAudio, setHasAudio] = useState(
    question?.audio != '' && question?.audio != undefined,
  )
  const [hasImage, setHasImage] = useState(
    question?.image != '' && question?.image != undefined,
  )

  useEffect(() => {
    register('image_file')
    register('image', {
      maxLength: {
        value: 255,
        message: 'Hình ảnh không được lớn hơn 255 ký tự',
      },
      required: 'Hình ảnh không được để trống',
      value: question?.image,
    })
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
      required: 'Nội dung bài nghe không được để trống',
      maxLength: {
        value: 2000,
        message: 'Nội dung bài nghe không được lớn hơn 2000 ký tự',
      },
      value: question?.audio_script,
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
  }, [])

  const onChangeAudioScript = (data: any) => {
    setValue('audio_script', data.replaceAll('%lb%', '\n'))
  }

  const onChange = (data: any) => {
    setValue('correct_answers', data.correct_answers)
  }

  const onChangeFile = () => {
    if (fileRef.current.files.length > 0) {
      setValue('audio_file', fileRef.current.files[0])
      const urlAudio = URL.createObjectURL(fileRef.current.files[0])
      setValue('audio', urlAudio)
      setHasAudio(true)
    }
  }

  const onChangeImageFile = () => {
    if (fileImgRef.current.files.length > 0) {
      setValue('image_file', fileImgRef.current.files[0])
      const urlAudio = URL.createObjectURL(fileImgRef.current.files[0])
      setValue('image', urlAudio)
      setHasImage(true)
    }
  }

  return (
    <div className="m-fill-in-blank">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ContentField
          label={'Nội dung bài nghe'}
          strValue={question?.audio_script}
          disableTab={true}
          //styleAction={['b', 'i', 'u']}
          onChange={onChangeAudioScript}
          className="form-input-stretch"
          style={{ flex: 1 }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div className="form-input-stretch" style={{ position: 'relative' }}>
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
            style={{ height: '9rem' }}
            inputStyle={{ padding: '1rem 1.2rem 4.5rem 1.2rem' }}
          />
          <div className="box-action-info">
            <span className="add-new-answer"></span>
            <div className="box-media">
              <div
                className={`box-media-input ${hasImage ? 'has-data' : ''}`}
                onClick={() =>
                  fileImgRef.current.dispatchEvent(new MouseEvent('click'))
                }
              >
                <img src="/images/icons/ic-image.png" width={16} height={16} />
                Hình ảnh
                <input
                  ref={fileImgRef}
                  type="file"
                  style={{ display: 'none' }}
                  accept=".png,.jpeg"
                  onChange={onChangeImageFile}
                />
              </div>
              <div
                className={`box-media-input ${hasAudio ? 'has-data' : ''}`}
                onClick={() =>
                  fileRef.current.dispatchEvent(new MouseEvent('click'))
                }
              >
                <img src="/images/icons/ic-audio.png" width={16} height={16} />
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
        </div>
        <FillInBlank5Table
          className="form-input-stretch"
          answerStr={question?.answers}
          correctStr={question?.correct_answers}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
