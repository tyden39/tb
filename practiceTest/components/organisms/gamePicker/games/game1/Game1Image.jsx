import { useContext, useState } from 'react'

import Scrollbars from 'react-custom-scrollbars'

import useProgress from '../../../../../hook/useProgress'
import { TEST_MODE } from '../../../../../interfaces/constants'
import { PageTestContext } from '../../../../../interfaces/contexts'
import { CustomHeading } from '../../../../atoms/heading'
import { CustomImage } from '../../../../atoms/image'
import { CustomText } from '../../../../atoms/text'
import { FormatText } from '../../../../molecules/formatText'
import { ImageZooming } from '../../../../molecules/modals/imageZooming'
import { GameWrapper } from '../../../../templates/gameWrapper'
import { BlockBottomGradient } from '../../../blockBottomGradient'

export const Game1Image = ({ data }) => {
  const answers = data?.answers || []
  const imageInstruction = data?.imageInstruction || ''
  const instruction = data?.instruction || ''
  const question = data?.question || ''

  const trueAnswer = answers.findIndex((item) => item.isCorrect === true)

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

  const { mode } = useContext(PageTestContext)

  const [isZoom, setIsZoom] = useState(false)

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
    <GameWrapper className="pt-o-game-1-image">
      <div className="pt-o-game-1-image__left" data-animate="fade-right">
        <div className="__image">
          <CustomImage
            className="__image-container"
            alt={question}
            src={`${imageInstruction}`}
            onClick={() => setIsZoom(true)}
          />
          <ImageZooming
            data={{ alt: question, src: `${imageInstruction}` }}
            status={{
              state: isZoom,
              setState: setIsZoom,
            }}
          />
          <FormatText className="__image-description">{question}</FormatText>
        </div>
        <div className="__letter"></div>
      </div>
      <div className="pt-o-game-1-image__right" data-animate="fade-left">
        <BlockBottomGradient className="__container">
          <div className="__header">
            <CustomHeading tag="h6" className="__description">
              <FormatText tag="span">{instruction}</FormatText>
            </CustomHeading>
          </div>
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
                    <CustomText tag="p">{item.text}</CustomText>
                  </div>
                ))}
              </div>
            </Scrollbars>
          </div>
        </BlockBottomGradient>
      </div>
    </GameWrapper>
  )
}
