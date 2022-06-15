import { Fragment, useContext, useState } from 'react'

import Scrollbars from 'react-custom-scrollbars'

import useProgress from '../../../../../hook/useProgress'
import { TEST_MODE } from '../../../../../interfaces/constants'
import { PageTestContext } from '../../../../../interfaces/contexts'
import { CustomHeading } from '../../../../atoms/heading'
import { CustomText } from '../../../../atoms/text'
import { FormatText } from '../../../../molecules/formatText'
import { GameWrapper } from '../../../../templates/gameWrapper'
import { BlockBottomGradient } from '../../../blockBottomGradient'

import { useWindowSize } from 'utils/hook'

export const Game1 = ({ data }) => {
  const answers = data?.answers || []
  const instruction = data?.instruction || ''
  const question = data?.question || ''

  console.log('data?.question===', data?.question)

  const trueAnswer = answers.findIndex((item) => item.isCorrect === true)

  const questionDataTransform = question ? question.split('%s%') : []

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

  const { mode } = useContext(PageTestContext)
  const [width, height] = useWindowSize();

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
    <GameWrapper className="pt-o-game-1">
      <div className="pt-o-game-1__animation" data-animate="fade-in">
        <BlockBottomGradient
          className={`pt-o-game-1__container ${question ? '' : '--center'}`}
        >
          {question &&  (
            <div className="__left">
            {width <= 1024 ? <div className="__header">
              <CustomHeading tag="h6" className="__description">
                <FormatText tag="span">{instruction}</FormatText>
              </CustomHeading>
            </div> : 
            <CustomText tag="p" className="__sample">
              {questionDataTransform.map((item, i) => (
                <Fragment key={i}>
                  {i !== 0 && (
                    <CustomText tag="span" className="__space">
                      {''}
                    </CustomText>
                  )}
                  <FormatText tag="span">{item}</FormatText>
                </Fragment>
              ))}
            </CustomText>
            }
              
            </div>
          )}
          <div className="__right">
            {(question && width <= 1024) ? 
            <CustomText tag="p" className="__sample">
            {questionDataTransform.map((item, i) => (
              <Fragment key={i}>
                {i !== 0 && (
                  <CustomText tag="span" className="__space">
                    {''}
                  </CustomText>
                )}
                <FormatText tag="span">{item}</FormatText>
              </Fragment>
            ))}
          </CustomText> :  
            <div className="__header">
              <CustomHeading tag="h6" className="__description">
                <FormatText tag="span">{instruction}</FormatText>
              </CustomHeading>
            </div>
            }
            <div className="__content">
              <Scrollbars universal={true}>
                <div className="__radio-list">
                  {answers.map((item, i) => (
                    <div
                      key={i}
                      className={`__radio-item ${generateClassName(i, radio)}`}
                      style={{
                        pointerEvents:
                          mode.state === TEST_MODE.play ? 'all' : 'none',
                      }}
                      onClick={() =>
                        mode.state === TEST_MODE.play &&
                        radio !== i &&
                        handleRadioClick(i)
                      }
                    >
                      <CustomText tag="span">{item.text}</CustomText>
                    </div>
                  ))}
                </div>
              </Scrollbars>
            </div>
          </div>
        </BlockBottomGradient>
      </div>
    </GameWrapper>
  )
}
