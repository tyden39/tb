import { Fragment, useContext, useEffect, useRef, useState } from 'react'

import Scrollbars from 'react-custom-scrollbars'

import useProgress from '../../../../../hook/useProgress'
import { TEST_MODE } from '../../../../../interfaces/constants'
import { PageTestContext } from '../../../../../interfaces/contexts'
import { CustomHeading } from '../../../../atoms/heading'
import { CustomText } from '../../../../atoms/text'
import { FormatText } from '../../../../molecules/formatText'
import { GameWrapper } from '../../../../templates/gameWrapper'
import { BlockBottomGradient } from '../../../blockBottomGradient'
import { BlockCloud } from '../../../blockCloud'

export const Game2 = ({ data }) => {
  const answers = data?.answers || []
  const instruction = data?.instruction || ''
  const question = data?.question || ''

  const trueAnswer = answers[0].answerList.trim()

  const splitQuestion = question.split('%s%')

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

  const { mode } = useContext(PageTestContext)

  const defaultString = getProgressActivityValue('')
  const [fillText, setFillText] = useState(defaultString)

  const space = useRef(null)

  const checkDanger = () => {
    if (mode.state === TEST_MODE.review && userAnswer.status === false)
      return '--danger'
    return ''
  }

  const checkInline = () => {
    if (
      (mode.state === TEST_MODE.play && fillText.length <= 0) ||
      (mode.state === TEST_MODE.review &&
        userAnswer.value &&
        userAnswer.value.length <= 0) ||
      (mode.state === TEST_MODE.review && !userAnswer.value) ||
      (mode.state === TEST_MODE.check && trueAnswer.length <= 0)
    )
      return '--inline'
    return ''
  }

  const checkSuccess = () => {
    if (
      mode.state === TEST_MODE.check ||
      (mode.state === TEST_MODE.review && userAnswer.status === true)
    )
      return '--success'
    return ''
  }

  const generateClassName = () => {
    let className = ''
    className += checkInline()
    className += ' '
    className += checkDanger()
    className += ' '
    className += checkSuccess()
    return className
  }

  // const handleInputBlur = (text = '') => {
  //   setProgressActivityValue(
  //     text,
  //     trueAnswer
  //       .toLowerCase()
  //       .trim()
  //       .replace(/’/g, "'")
  //       .split('/')
  //       .includes(
  //         text
  //           .replace(/&nbsp;/g, ' ')
  //           .trim()
  //           .toLowerCase(),
  //       )
  //       ? true
  //       : false,
  //   )
  // }

  const handleInputChange = (text) => {
    setFillText(text)
    setProgressActivityValue(
      text,
      trueAnswer
        .toLowerCase()
        .trim()
        .replace(/’/g, "'")
        .split('/')
        .includes(
          text
            .replace(/&nbsp;/g, ' ')
            .trim()
            .toLowerCase(),
        )
        ? true
        : false,
    )
  }

  useEffect(() => {
    if (!space?.current) return
    let appendText = ''
    switch (mode.state) {
      case TEST_MODE.play:
        space.current.focus()
        appendText = fillText
        break
      case TEST_MODE.review:
        appendText = userAnswer?.value ? userAnswer.value : ''
        break
      case TEST_MODE.check:
        appendText = trueAnswer
        break
      default:
        break
    }
    space.current.innerHTML = appendText
  }, [space, mode.state])

  return (
    <GameWrapper className="pt-o-game-2">
      <div className="pt-o-game-2__left" data-animate="fade-right">
        <BlockCloud className="__container">
          <div className="__box">
            <CustomText tag="span" className="__text">
              {answers[0].word}
            </CustomText>
          </div>
        </BlockCloud>
      </div>
      <div className="pt-o-game-2__right" data-animate="fade-left">
        <BlockBottomGradient className="__container">
          <div className="__header">
            <CustomHeading tag="h6" className="__description">
              {instruction}
            </CustomHeading>
          </div>
          <div className="__content">
            <Scrollbars universal={true}>
              <div className="__content-container">
                <CustomText tag="p" className="__text">
                  {splitQuestion.map((item, i) => (
                    <Fragment key={i}>
                      {i !== 0 && (
                        <span
                          ref={space}
                          className={`__editable ${generateClassName()}`}
                          contentEditable={
                            mode.state === TEST_MODE.play ? true : false
                          }
                          style={{
                            pointerEvents:
                              mode.state === TEST_MODE.play ? 'all' : 'none',
                          }}
                          // onBlur={(e) =>
                          //   mode.state === TEST_MODE.play && handleInputBlur(e.target.innerHTML)
                          // }
                          onInput={(e) =>
                            mode.state === TEST_MODE.play &&
                            handleInputChange(e.target.innerHTML)
                          }
                          onLoadedMetadata={(e) =>
                            mode.state === TEST_MODE.play && e.target.click()
                          }
                        ></span>
                      )}
                      <FormatText tag="span">{item}</FormatText>
                    </Fragment>
                  ))}
                </CustomText>
              </div>
            </Scrollbars>
          </div>
        </BlockBottomGradient>
      </div>
    </GameWrapper>
  )
}
