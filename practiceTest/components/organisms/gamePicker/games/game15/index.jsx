import { useContext, useState } from 'react'

import Scrollbars from 'react-custom-scrollbars'

import useProgress from '../../../../../hook/useProgress'
import { TEST_MODE } from '../../../../../interfaces/constants'
import { PageTestContext } from '../../../../../interfaces/contexts'
import { CustomHeading } from '../../../../atoms/heading'
import { CustomImage } from '../../../../atoms/image'
import { FormatText } from '../../../../molecules/formatText'
import { ImageZooming } from '../../../../molecules/modals/imageZooming'
import { BlockPaper } from '../../../../organisms/blockPaper'
import { GameWrapper } from '../../../../templates/gameWrapper'
import { BlockBottomGradient } from '../../../blockBottomGradient'
import { BlockCloud } from '../../../blockCloud'

export const Game15 = ({ data }) => {
  const answers = data?.answers || []
  const imageInstruction = data?.imageInstruction || ''
  const instruction = data?.instruction || ''
  const questionInstruction = data?.questionInstruction || ''

  const choices = answers[0].answerList.split('/')

  const trueAnswers = answers.map((item) => item.answer)

  const { getProgressActivityValue, setProgressActivityValue } = useProgress()

  const [isZoom, setIsZoom] = useState(false)

  const defaultRadio = getProgressActivityValue(
    Array.from(Array(answers.length), () => null),
  )
  const [action, setAction] = useState(defaultRadio)

  const checkRadio = (index, bool) => {
    // update value
    let radioValueArr = action
    radioValueArr[index] = bool
    // check isCorrect
    let statusArr = []
    trueAnswers.forEach((item, i) => {
      statusArr.push(radioValueArr[i] === item ? true : false)
    })
    // save progress
    setProgressActivityValue(radioValueArr, statusArr)
    // display
    setAction([...radioValueArr])
  }

  return (
    <GameWrapper className="pt-o-game-15">
      {imageInstruction ? (
        <BlockCloud className="pt-o-game-15__left">
          <CustomImage
            className="__image"
            alt="instruction"
            yRate={0}
            src={`${imageInstruction}`}
            onClick={() => setIsZoom(true)}
          />
          <ImageZooming
            data={{ alt: 'instruction', src: `${imageInstruction}` }}
            status={{
              state: isZoom,
              setState: setIsZoom,
            }}
          />
        </BlockCloud>
      ) : (
        <div className="pt-o-game-15__left">
          <BlockPaper>
            <div className="__content">
              <FormatText tag="p">{questionInstruction}</FormatText>
            </div>
          </BlockPaper>
        </div>
      )}
      <div className="pt-o-game-15__right">
        <BlockBottomGradient className="__container">
          <div className="__header">
            <CustomHeading tag="h6" className="__description">
              <FormatText tag="span">{instruction}</FormatText>
            </CustomHeading>
          </div>
          <div className="__content">
            <div className="__title">
              {choices.map((item, i) => (
                <CustomHeading key={i} className="__heading">
                  <span>{item}</span>
                </CustomHeading>
              ))}
            </div>
            <div className="__list">
              <Scrollbars universal={true}>
                {answers.map((item, i) => (
                  <RadioItem
                    key={i}
                    choices={choices}
                    data={item.text}
                    index={i}
                    trueValue={trueAnswers[i]}
                    state={action}
                    setState={checkRadio}
                  />
                ))}
              </Scrollbars>
            </div>
          </div>
        </BlockBottomGradient>
      </div>
    </GameWrapper>
  )
}

const RadioItem = ({ choices, data, index, trueValue, state, setState }) => {
  const { mode } = useContext(PageTestContext)

  const handleRadioClick = (i, val) => setState(i, val)

  const checkDanger = (radio) => {
    if (
      mode.state === TEST_MODE.review &&
      state[index] === radio &&
      radio !== trueValue
    )
      return '--danger'
    return ''
  }

  const checkSuccess = (radio) => {
    if (
      (mode.state === TEST_MODE.review &&
        state[index] === radio &&
        radio === trueValue) ||
      (mode.state === TEST_MODE.check && radio === trueValue)
    )
      return '--success'
    return ''
  }

  const ganerateClassName = (radio) => {
    let className = ''
    className += checkDanger(radio)
    className += ' '
    className += checkSuccess(radio)
    className += ' '
    return className
  }

  return (
    <div className="__item">
      <div className="__text">
        <FormatText tag="p">{data}</FormatText>
      </div>
      <div
        className={`__radio ${
          state[index] === choices[0] ? '--true' : ''
        } ${ganerateClassName(choices[0])}`}
        style={{ pointerEvents: mode.state == TEST_MODE.play ? 'all' : 'none' }}
        onClick={() =>
          mode.state === TEST_MODE.play &&
          state[index] !== choices[0] &&
          handleRadioClick(index, choices[0])
        }
      ></div>
      <div
        className={`__radio ${
          state[index] === choices[1] ? '--false' : ''
        } ${ganerateClassName(choices[1])}`}
        style={{ pointerEvents: mode.state == TEST_MODE.play ? 'all' : 'none' }}
        onClick={() =>
          mode.state === TEST_MODE.play &&
          state[index] !== choices[1] &&
          handleRadioClick(index, choices[1])
        }
      ></div>
      <div
        className={`__radio ${
          state[index] === choices[2] ? '--not-given' : ''
        } ${ganerateClassName(choices[2])}`}
        style={{ pointerEvents: mode.state == TEST_MODE.play ? 'all' : 'none' }}
        onClick={() =>
          mode.state === TEST_MODE.play &&
          state[index] !== choices[2] &&
          handleRadioClick(index, choices[2])
        }
      ></div>
    </div>
  )
}
