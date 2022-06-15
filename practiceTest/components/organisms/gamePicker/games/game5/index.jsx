import { Fragment, useContext, useEffect, useRef, useState } from 'react'

import Scrollbars from 'react-custom-scrollbars'

import useProgress from '../../../../../hook/useProgress'
import { TEST_MODE } from '../../../../../interfaces/constants'
import { PageTestContext } from '../../../../../interfaces/contexts'
import { CustomHeading } from '../../../../atoms/heading'
import { FormatText } from '../../../../molecules/formatText'
import { GameWrapper } from '../../../../templates/gameWrapper'
import { BlockBottomGradientWithHeader } from '../../../blockBottomGradient/BlockBottomGradientWithHeader'

export const Game5 = ({ data }) => {
  const answers = data?.answers || []
  const instruction = data?.instruction || ''
  const question = data?.question || ''

  const trueAnswers = answers.map((answer) =>
    answer.answerList
      .trim()
      .split('/')
      .findIndex((item) => item.trim() === answer.answer.trim()),
  )

  const replaceQuestion = question.replace(/%[0-9]%/g, '%s%')

  const finalSentences = replaceQuestion.split('%s%')

  const pickers = answers.map((group) => group.answerList.split('/'))

  const { mode } = useContext(PageTestContext)

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

  const [currentGroupAnswer, setCurrentGroupAnswer] = useState(null)
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)

  const defaultArray = getProgressActivityValue(
    Array.from(Array(pickers.length), () => null),
  )
  const [chosenAnswers, setChosenAnswers] = useState(defaultArray)

  const drawer = useRef(null)

  const checkDanger = (i) => {
    if (mode.state === TEST_MODE.review && userAnswer.status[i] === false)
      return '--danger'
    return ''
  }

  const checkInline = (i) => {
    if (
      ([TEST_MODE.play, TEST_MODE.review].includes(mode.state) &&
        chosenAnswers[i] !== null &&
        pickers[i][chosenAnswers[i]]) ||
      mode.state === TEST_MODE.check
    )
      return '--inline'
    return ''
  }

  const checkSuccess = (i) => {
    if (
      mode.state === TEST_MODE.check ||
      (mode.state === TEST_MODE.review && userAnswer.status[i] === true)
    )
      return '--success'
    return ''
  }

  const closeCollapse = (e) => {
    if (
      e.target.classList.contains('__space') ||
      e.target.classList.contains('__drawer') ||
      e.target.closest('.__drawer')
    )
      return
    setIsOpenCollapse(false)
  }

  const generateClassName = (i) => {
    let className = ''
    className += checkInline(i)
    className += ' '
    className += checkDanger(i)
    className += ' '
    className += checkSuccess(i)
    return className
  }

  const handleSpaceClick = (e) => {
    let time = 0
    if (isOpenCollapse) {
      time = 500
      setIsOpenCollapse(false)
    }
    const index = e.target.getAttribute('data-index')
    setCurrentGroupAnswer(parseInt(index))
    setTimeout(() => setIsOpenCollapse(true), time)
  }

  const handlePickerClick = (groupIndex, index) => {
    // update value
    let currentChosenAnswers = chosenAnswers
    currentChosenAnswers[groupIndex] = index
    // check isCorrect
    let statusArr = []
    trueAnswers.forEach((item, i) =>
      statusArr.push(item === currentChosenAnswers[i] ? true : false),
    )
    // save progress
    setProgressActivityValue(currentChosenAnswers, statusArr)
    // display
    setChosenAnswers([...currentChosenAnswers])
    setIsOpenCollapse(false)
  }

  useEffect(() => {
    if (userAnswer.group !== 1 && userAnswer.value === null)
      setProgressActivityValue(
        Array.from(Array(pickers.length), () => null),
        Array.from(Array(pickers.length), () => false),
      )

    window.addEventListener('click', closeCollapse)
    return () => window.removeEventListener('click', closeCollapse)
  }, [])

  useEffect(() => {
    if (drawer?.current && mode.state === TEST_MODE.play)
      drawer.current.scrollTo({ top: 0, behaviour: 'smooth' })
  }, [isOpenCollapse, drawer.current])

  let spaceIndex = -1
  return (
    <GameWrapper className="pt-o-game-5">
      <div className="pt-o-game-5__container" data-animate="fade-in">
        <BlockBottomGradientWithHeader
          className="--sm-header"
          headerChildren={
            <CustomHeading tag="h6" className="__heading">
              <FormatText tag="span">{instruction}</FormatText>
            </CustomHeading>
          }
          customChildren={
            <div
              ref={drawer}
              className={`__drawer ${isOpenCollapse ? '--show' : ''}`}
            >
              {pickers.map((picker, i) => (
                <Fragment key={i}>
                  {picker.map(
                    (item, j) =>
                      i === currentGroupAnswer && (
                        <div
                          key={j}
                          className={`__drawer-item ${
                            j === chosenAnswers[i] ? '--active' : ''
                          }`}
                          style={{
                            pointerEvents:
                              mode.state === TEST_MODE.play ? 'all' : 'none',
                          }}
                          onClick={() =>
                            mode.state === TEST_MODE.play &&
                            handlePickerClick(i, j)
                          }
                        >
                          {item}
                        </div>
                      ),
                  )}
                </Fragment>
              ))}
            </div>
          }
        >
          <Scrollbars universal={true}>
            <div className="__content">
              {finalSentences.map((item, j) => {
                if (j !== 0) spaceIndex++
                return (
                  <Fragment key={j}>
                    {j !== 0 && (
                      <span
                        className={`__space ${generateClassName(spaceIndex)}`}
                        data-index={spaceIndex}
                        style={{
                          pointerEvents:
                            mode.state === TEST_MODE.play ? 'all' : 'none',
                        }}
                        onClick={(e) =>
                          mode.state === TEST_MODE.play && handleSpaceClick(e)
                        }
                      >
                        {/* check mode */}
                        {mode.state === TEST_MODE.check &&
                          pickers[spaceIndex][trueAnswers[spaceIndex]]}
                        {/* play mode & review mode */}
                        {[TEST_MODE.play, TEST_MODE.review].includes(
                          mode.state,
                        ) &&
                          chosenAnswers[spaceIndex] !== null &&
                          pickers[spaceIndex][chosenAnswers[spaceIndex]]}
                      </span>
                    )}
                    <FormatText tag="span">{item}</FormatText>
                  </Fragment>
                )
              })}
            </div>
          </Scrollbars>
        </BlockBottomGradientWithHeader>
      </div>
    </GameWrapper>
  )
}
