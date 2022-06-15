import { useContext, useState } from 'react'

import useProgress from '../../../../../hook/useProgress'
import { TEST_MODE } from '../../../../../interfaces/constants'
import { PageTestContext } from '../../../../../interfaces/contexts'
import { CustomHeading } from '../../../../atoms/heading'
import { CustomImage } from '../../../../atoms/image'
import { CustomText } from '../../../../atoms/text'
import { FormatText } from '../../../../molecules/formatText'
import { GameWrapper } from '../../../../templates/gameWrapper'
import { BlockBottomGradient } from '../../../blockBottomGradient'
import { BlockCloud } from '../../../blockCloud'

export const Game7 = ({ data }) => {
  const answers = data?.answers || []
  const instruction = data?.instruction || ''
  const question = data?.question || ''

  const trueAnswer = answers[0].answer

  let hintSentence = ''
  const hint = answers[0].start.split('%s%')
  if (hint.length > 1)
    hint.forEach(
      (item, i) => (hintSentence += i !== 0 ? `.......... ${item}` : item),
    )
  else hintSentence = hint[0] + ' ..........'

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

  const { mode } = useContext(PageTestContext)

  const defaultString = getProgressActivityValue('')
  const [fillText, setFillText] = useState(defaultString)

  const checkDanger = () => {
    if (mode.state === TEST_MODE.review && userAnswer.status === false)
      return '--danger'
    return ''
  }

  const checkSuccess = () => {
    if (
      (mode.state === TEST_MODE.review && userAnswer.status === true) ||
      mode.state === TEST_MODE.check
    )
      return '--success'
    return ''
  }

  const generateClassName = () => {
    let className = ''
    className += checkDanger()
    className += ' '
    className += checkSuccess()
    return className
  }

  const handleTextareaBlur = () => {
    const trueArr = trueAnswer
      .trim()
      .toLowerCase()
      .replace(/’/g, "'")
      .split('/')
    setProgressActivityValue(
      fillText,
      trueArr.includes(fillText.trim().toLowerCase()) ||
        trueArr.includes(fillText.trim().toLowerCase() + '.')
        ? true
        : false,
    )
  }

  const handleTextareaChange = (text) => setFillText(text)

  return (
    <GameWrapper className="pt-o-game-7">
      <div className="pt-o-game-7__left" data-animate="fade-right">
        <BlockCloud className="__container">
          <div className="__box">
            <FormatText tag="span" className="__text">
              {question}
            </FormatText>
          </div>
        </BlockCloud>
      </div>
      <div className="pt-o-game-7__right" data-animate="fade-left">
        <BlockBottomGradient className="__container">
          <div className="__header">
            <CustomHeading tag="h6" className="__description">
              <FormatText tag="span">{instruction}</FormatText>
            </CustomHeading>
          </div>
          <div className="__content">
            {answers[0]?.start &&
              <div className="__hint">
                <CustomImage
                  className="__icon"
                  alt="hint"
                  src="/pt/images/icons/ic-hint.svg"
                  yRate={0}
                />
                {hintSentence && (
                  <CustomText tag="p" className="__text">
                    HINT: {hintSentence}
                  </CustomText>
                )}
              </div>
            }
            <div className="__textarea">
              <textarea
                className={`__textarea-box ${generateClassName()}`}
                autoFocus={mode.state === TEST_MODE.play ? true : false}
                placeholder="Write your answer here ..."
                value={mode.state === TEST_MODE.check ? trueAnswer : fillText}
                style={{
                  pointerEvents: mode.state === TEST_MODE.play ? 'all' : 'none',
                }}
                onChange={(e) =>
                  mode.state === TEST_MODE.play &&
                  handleTextareaChange(e.target.value)
                }
                onBlur={() =>
                  mode.state === TEST_MODE.play && handleTextareaBlur()
                }
              />
            </div>
          </div>
        </BlockBottomGradient>
      </div>
    </GameWrapper>
  )
}
