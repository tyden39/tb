import { useContext, useEffect, useState } from 'react'

import Scrollbars from 'react-custom-scrollbars'
import { Icon, Toggle } from 'rsuite'

import useProgress from '../../../../../hook/useProgress'
import { TEST_MODE } from '../../../../../interfaces/constants'
import { PageTestContext } from '../../../../../interfaces/contexts'
import { CustomHeading } from '../../../../atoms/heading'
import { FormatText } from '../../../../molecules/formatText'
import { BlockPaper } from '../../../../organisms/blockPaper'
import { GameWrapper } from '../../../../templates/gameWrapper'
import { BlockBottomGradient } from '../../../blockBottomGradient'

export const Game8 = ({ data }) => {
  const answers = data?.answers || []
  const questionInstruction = data?.questionInstruction || ''
  const instruction = data?.instruction || ''

  const trueAnswers = answers.map((item) => item.isCorrect)

  const { getProgressActivityValue, setProgressActivityValue } = useProgress()

  const defaultRadio = getProgressActivityValue(
    Array.from(Array(answers.length), () => false),
  )

  const [action, setAction] = useState(defaultRadio)

  const checkRadio = (index, bool) => {
    // update value
    let radioValueArr = action
    radioValueArr[index] = bool
    // check isCorrect
    let statusArr = []
    trueAnswers.forEach((item, i) =>
      statusArr.push(item === radioValueArr[i] ? true : false),
    )
    // save progress
    setProgressActivityValue(radioValueArr, statusArr)
    setAction([...radioValueArr])
  }

  useEffect(
    () =>
      setProgressActivityValue(
        action,
        trueAnswers.map((item, i) => (item === action[i] ? true : false)),
      ),
    [],
  )

  return (
    <GameWrapper className="pt-o-game-8">
      <div className="pt-o-game-8__left" data-animate="fade-right">
        <BlockPaper>
          <div className="__content">
            <FormatText tag="p">{questionInstruction}</FormatText>
          </div>
        </BlockPaper>
      </div>
      <div className="pt-o-game-8__right" data-animate="fade-left">
        <BlockBottomGradient className="__container">
          <div className="__header">
            <CustomHeading tag="h6" className="__description">
              <FormatText tag="span">{instruction}</FormatText>
            </CustomHeading>
          </div>
          <div className="__content">
            <div className="__list">
              <Scrollbars universal={true}>
                {answers.map((item, i) => (
                  <RadioItem
                    key={i}
                    content={item.text}
                    index={i}
                    trueAnswer={trueAnswers[i]}
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

const RadioItem = ({ content, index, trueAnswer, state, setState }) => {
  const { mode } = useContext(PageTestContext)

  const { userAnswer } = useProgress()

  const checkDanger = () => {
    if (mode.state === TEST_MODE.review && userAnswer.status[index] === false)
      return '--danger'
    return ''
  }

  const checkSuccess = () => {
    if (
      (mode.state === TEST_MODE.review && userAnswer.status[index] === true) ||
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

  const handleRadioClick = (i, val) => setState(i, val)

  return (
    <div className="__item">
      <div className={`__text ${generateClassName()}`}>
        <FormatText tag="p">{content}</FormatText>
      </div>
      <div
        className="__toggle"
        style={{
          pointerEvents: mode.state === TEST_MODE.play ? 'all' : 'none',
        }}
      >
        <Toggle
          className="__switcher"
          checked={mode.state === TEST_MODE.check ? trueAnswer : state[index]}
          checkedChildren="True"
          unCheckedChildren="False"
          onChange={() =>
            mode.state === TEST_MODE.play &&
            handleRadioClick(index, !state[index])
          }
        />
      </div>
    </div>
  )
}
