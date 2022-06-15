import { Fragment, useContext, useEffect, useRef, useState } from 'react'

import Scrollbars from 'react-custom-scrollbars'

import useProgress from '../../../../../hook/useProgress'
import { TEST_MODE } from '../../../../../interfaces/constants'
import { PageTestContext } from '../../../../../interfaces/contexts'
import { CustomHeading } from '../../../../atoms/heading'
import { FormatText } from '../../../../molecules/formatText'
import { GameWrapper } from '../../../../templates/gameWrapper'
import { BlockBottomGradientWithHeader } from '../../../blockBottomGradient/BlockBottomGradientWithHeader'

export const Game3 = ({ data }) => {
  const answers = data?.answers || []
  const instruction = data?.instruction || ''
  const question = data?.question || ''

  const trueAnswers = answers.map((item) => item.answer)

  let tmpQuestion = question.replace(/%[0-9]%/g, '%s%')
  const questionArr = tmpQuestion.split('%s%')

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

  const { mode } = useContext(PageTestContext)

  const defaultRadio = getProgressActivityValue(
    Array.from(Array(answers.length), () => ''),
  )
  const [fillTextArr, setFillTextArr] = useState(defaultRadio)

  const contentRef = useRef(null)

  const checkDanger = (i) => {
    if (mode.state === TEST_MODE.review && userAnswer.status[i] === false)
      return '--danger'
    return ''
  }

  const checkEmpty = (i) => {
    if (fillTextArr[i] === '' && mode.state !== TEST_MODE.check)
      return '--empty'
    return ''
  }

  const checkSuccess = (i) => {
    if (
      (mode.state === TEST_MODE.review && userAnswer.status[i] === true) ||
      mode.state === TEST_MODE.check
    )
      return '--success'
    return ''
  }

  const generateClassName = (i) => {
    let className = ''
    className += checkEmpty(i)
    className += ' '
    className += checkDanger(i)
    className += ' '
    className += checkSuccess(i)
    return className
  }

  const handleInputBlur = () => {
    // update value
    const textArr = fillTextArr
    // check isCorrect
    let statusArr = []
    trueAnswers.forEach((item, i) =>
      statusArr.push(
        item
          .toLowerCase()
          .trim()
          .replace(/’/g, "'")
          .split('/')
          .includes(
            textArr[i]
              .replace(/&nbsp;/g, ' ')
              .trim()
              .toLowerCase(),
          )
          ? true
          : false,
      ),
    )
    // save progress
    setProgressActivityValue(textArr, statusArr)
  }

  const handleInputChange = (e) => {
    const index = e.target.getAttribute('data-index')
    const textArr = fillTextArr
    if (typeof textArr[index] !== 'string') return
    textArr[index] = e.target.innerHTML
    setFillTextArr([...textArr])
  }

  useEffect(() => {
    if (!contentRef?.current) return
    const spaceList = contentRef.current.querySelectorAll('.__editable')
    spaceList.forEach((item, i) => {
      if ([TEST_MODE.review, TEST_MODE.play].includes(mode.state)) {
        item.innerHTML = fillTextArr[i]
        if (i !== 0 || mode.state === TEST_MODE.review) return
        item.focus()
      } else if (mode.state === TEST_MODE.check) item.innerHTML = trueAnswers[i]
    })
  }, [contentRef, mode.state])

  let editableIndex = -1
  return (
    <GameWrapper className="pt-o-game-3">
      <div className="pt-o-game-3__container" data-animate="fade-in">
        <BlockBottomGradientWithHeader
          headerChildren={
            <CustomHeading tag="h6" className="__heading">
              <FormatText tag="span">{instruction}</FormatText>
            </CustomHeading>
          }
        >
          <Scrollbars universal={true}>
            <div ref={contentRef} className="__content">
              {questionArr.map((item, i) => {
                if (i !== 0) editableIndex++
                return (
                  <Fragment key={i}>
                    {i !== 0 && (
                      <span
                        className={`__editable ${generateClassName(
                          editableIndex,
                        )}`}
                        contentEditable={
                          mode.state === TEST_MODE.play ? true : false
                        }
                        data-index={editableIndex}
                        style={{
                          pointerEvents:
                            mode.state === TEST_MODE.play ? 'all' : 'none',
                        }}
                        onBlur={() =>
                          mode.state === TEST_MODE.play && handleInputBlur()
                        }
                        onInput={(e) =>
                          mode.state === TEST_MODE.play && handleInputChange(e)
                        }
                      ></span>
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
