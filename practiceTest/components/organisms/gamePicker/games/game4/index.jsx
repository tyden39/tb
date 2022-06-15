import { Fragment, useContext, useState } from 'react'

import useProgress from '../../../../../hook/useProgress'
import { TEST_MODE } from '../../../../../interfaces/constants'
import { PageTestContext } from '../../../../../interfaces/contexts'
import { CustomText } from '../../../../atoms/text'
import { FormatText } from '../../../../molecules/formatText'
import { GameWrapper } from '../../../../templates/gameWrapper'
import { BlockBottomGradient } from '../../../blockBottomGradient'

export const Game4 = ({ data }) => {
  const answers = data?.answers || []
  const instruction = data?.instruction || ''

  const trueAnswer = answers.findIndex((item) => item.isCorrect === true)

  const answersTransform = answers.map((item) => item.text.split('%'))

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

    console.log('userAnswer===', userAnswer)
  const { mode } = useContext(PageTestContext)

  const defaultRadio = getProgressActivityValue(null)
  const [radio, setRadio] = useState(defaultRadio)

  const checkDanger = (i) => {
    if (
      mode.state === TEST_MODE.review &&
      userAnswer.status === false &&
      userAnswer.value === i
    )
      return '--danger'
    return ''
  }

  const checkPrimary = (i, value) => {
    if (mode.state === TEST_MODE.play && value === i) return '--primary'
    return ''
  }

  const checkSuccess = (i) => {
    if (
      (mode.state === TEST_MODE.review &&
        userAnswer.status === true &&
        userAnswer.value === i) ||
      (mode.state === TEST_MODE.check && trueAnswer === i)
    )
      return '--success'
    return ''
  }

  const generateClassName = (i, value) => {
    let className = ''
    className += checkPrimary(i, value)
    className += ' '
    className += checkDanger(i)
    className += ' '
    className += checkSuccess(i)
    return className
  }

  const handleRadioClick = (i) => {
    // save progress
    setProgressActivityValue(i, i === trueAnswer ? true : false)
    // display
    setRadio(i)
  }

  return (
    <GameWrapper className="pt-o-game-4">
      <div className="pt-o-game-4__container" data-animate="fade-in">
        <BlockBottomGradient className="__content">
          <div className="__description">
            <CustomText tag="p" className="__text">
              <FormatText tag="span">{instruction}</FormatText>
            </CustomText>
          </div>
          <div className="__list">
            {answersTransform.map((item, i) => (
              <div
                key={i}
                className={`__item ${generateClassName(i, radio)}`}
                style={{
                  pointerEvents: mode.state === TEST_MODE.play ? 'all' : 'none',
                }}
                onClick={() =>
                  mode.state === TEST_MODE.play && handleRadioClick(i)
                }
              >
                <CustomText tag="span">
                  {item.map((text, j) =>
                    j % 2 === 0 ? (
                      <Fragment key={j}>{text}</Fragment>
                    ) : (
                      <u key={j}>{text}</u>
                    ),
                  )}
                </CustomText>
              </div>
            ))}
          </div>
        </BlockBottomGradient>
      </div>
    </GameWrapper>
  )
}
