import { CSSProperties, useContext } from 'react'

import { AiFillEdit } from 'react-icons/ai'

import { PreviewResultContext } from '../../../interfaces/contexts'

type PropsType = {
  className?: string
  index: number
  style?: CSSProperties
  data: any
}

type QuestionPropsType = {
  index: number
  type: string
}

const questionType = ['radio', 'checkbox', 'text']

export const PreviewQuestionCard = ({
  className = '',
  index,
  style,
}: PropsType) => {
  const { previewModal } = useContext(PreviewResultContext)

  return (
    <div className={`a-preview-question-card ${className}`} style={style}>
      {/* <AiFillEdit
        className="__edit-toggle"
        onClick={() => previewModal.setState('replace')}
      /> */}
      <div className="__question" data-index={index}>
        simply dummy text of the printing and typesetting industry.
      </div>
      <Answer index={index} type={questionType[index % 3]} />
    </div>
  )
}

const Answer = ({ index, type }: QuestionPropsType) => {
  switch (type) {
    case 'checkbox':
      return (
        <div className="__answers">
          {Array.from(Array(4), (e, i: number) => (
            <div key={i + index} className="__answer-item">
              <input
                type="checkbox"
                name={`answer-checkbox-${index}`}
                defaultChecked={i === 0 ? true : false}
                style={{ pointerEvents: 'none' }}
              />
              <label htmlFor="">Answer {i + 1}</label>
            </div>
          ))}
        </div>
      )
    case 'radio':
      return (
        <div className="__answers">
          {Array.from(Array(4), (e, i: number) => (
            <div key={i + index} className="__answer-item">
              <input
                type="radio"
                name={`answer-radio-${index}`}
                defaultChecked={i === 0 ? true : false}
                style={{ pointerEvents: 'none' }}
              />
              <label htmlFor="">Answer {i + 1}</label>
            </div>
          ))}
        </div>
      )
    case 'text':
      return (
        <div className="__answers">
          <div className="__text">
            It is a long established fact that a reader will be distracted by
            the readable content of <span className="__result"> a page</span>{' '}
            when looking at its layout.
          </div>
        </div>
      )
    default:
      return <></>
  }
}
