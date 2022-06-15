import { Fragment, useContext, useEffect, useRef, useState } from 'react'

import Scrollbars from 'react-custom-scrollbars'

import useProgress from '../../../../../hook/useProgress'
import { TEST_MODE } from '../../../../../interfaces/constants'
import { PageTestContext } from '../../../../../interfaces/contexts'
import { formatDateTime } from '../../../../../utils/functions'
import { CustomButton } from '../../../../atoms/button'
import { CustomHeading } from '../../../../atoms/heading'
import { CustomImage } from '../../../../atoms/image'
import { AudioPlayer } from '../../../../molecules/audioPlayer'
import { FormatText } from '../../../../molecules/formatText'
import { ImageZooming } from '../../../../molecules/modals/imageZooming'
import { GameWrapper } from '../../../../templates/gameWrapper'
import { BlockBottomGradientWithHeader } from '../../../blockBottomGradient/BlockBottomGradientWithHeader'
import { BlockPaper } from '../../../blockPaper'
import { BlockWave } from '../../../blockWave'

export const Game3Audio = ({ data }) => {
  const answers = data?.answers || []
  const audioInstruction = data?.audioInstruction || ''
  const audioScript = data?.audioScript || ''
  const imageInstruction = data?.imageInstruction || ''
  const instruction = data?.instruction || ''
  const question = data?.question || ''

  const trueAnswer = answers.map((item) => item.answer)

  const replaceQuestion = question.replace(/%[0-9]+%/g, '%s%')
  const questionArr = replaceQuestion.split('%s%')

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

  const { mode } = useContext(PageTestContext)

  const [countDown, setCountDown] = useState(null)
  const [isPlaying, setIsPLaying] = useState(false)
  const [isShowTapescript, setIsShowTapescript] = useState(false)
  const [isZoom, setIsZoom] = useState(false)

  const defaultTextArr = getProgressActivityValue(
    Array.from(Array(questionArr.length), () => ''),
  )
  const [fillTextArr, setFillTextArr] = useState(defaultTextArr)

  const audio = useRef(null)
  const contentRef = useRef(null)

  const checkDanger = (i) => {
    if (
      mode.state === TEST_MODE.review &&
      userAnswer.value &&
      userAnswer.value[i] !== '' &&
      userAnswer.status[i] === false
    )
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
      (mode.state === TEST_MODE.review &&
        userAnswer.value &&
        userAnswer.value[i] !== '' &&
        userAnswer.status[i] === true) ||
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
    const answerValue = fillTextArr
    let statusArr = []
    trueAnswer.forEach((item, i) => {
      statusArr.push(
        item
          .toLowerCase()
          .trim()
          // .replace(/\*/g, "'")
          .split('\*')
          .includes(
            answerValue[i]
              .replace(/&nbsp;/g, ' ')
              .trim()
              .toLowerCase(),
          )
          ? true
          : false,
      )
    })
          
    setProgressActivityValue(answerValue, statusArr)
  }

  const handleInputChange = (index, text) => {
    const textArr = fillTextArr
    if (typeof textArr[index] !== 'string') return
    textArr[index] = text
    setFillTextArr([...textArr])
  }

  const handleAudioTimeUpdate = () => {
    if (!audio?.current) return
    const countDowntValue = audio.current.duration - audio.current.currentTime
    if (countDowntValue > 0)
      setCountDown(formatDateTime(Math.ceil(countDowntValue) * 1000))
    else {
      setIsPLaying(false)
      audio.current.currentTime = 0
    }
  }

  useEffect(() => {
    if (!audio?.current) return
    if (isPlaying) audio.current.play()
    else audio.current.pause()
  }, [isPlaying, audio])

  useEffect(() => {
    if (!contentRef?.current) return
    const spaceList = contentRef.current.querySelectorAll('.__editable')
    spaceList.forEach((item, i) => {
      if ([TEST_MODE.review, TEST_MODE.play].includes(mode.state)) {
        item.innerHTML = fillTextArr[i]
        if (i !== 0 && mode.state === TEST_MODE.play) return
        item.focus()
      } else if (mode.state === TEST_MODE.check) item.innerHTML = trueAnswer[i].replace(/\*/g, '\/ ')
    })
  }, [contentRef, mode.state, isShowTapescript])

  return (
    <GameWrapper className="pt-o-game-3-audio">
      <audio
        ref={audio}
        style={{ display: 'none' }}
        onLoadedMetadata={() =>
          setCountDown(formatDateTime(Math.ceil(audio.current.duration) * 1000))
        }
        onTimeUpdate={() => handleAudioTimeUpdate()}
      >
        <source src={audioInstruction} />
      </audio>
      <div className="pt-o-game-3-audio__container" data-animate="fade-in">
        {isShowTapescript ? (
          <div className="__paper">
            <div
              className="__toggle"
              onClick={() => setIsShowTapescript(false)}
            >
              <CustomImage alt="close" src="/pt/images/icons/ic-plus.svg" />
            </div>
            <BlockPaper>
              <div className="__content">
                <FormatText>{audioScript}</FormatText>
              </div>
            </BlockPaper>
          </div>
        ) : (
          <>
            <BlockWave className="pt-o-game-3-audio__left">
              <AudioPlayer
                className="__player"
                isPlaying={isPlaying}
                setIsPlaying={() => setIsPLaying(!isPlaying)}
              />
              <span className="__duration">{countDown}</span>
            </BlockWave>
            <div
              className={`pt-o-game-3-audio__right ${
                imageInstruction ? '--image' : ''
              }`}
            >
              {mode.state !== TEST_MODE.play && (
                <CustomButton
                  className="__tapescript"
                  onClick={() => setIsShowTapescript(true)}
                >
                  Tapescript
                </CustomButton>
              )}
              <BlockBottomGradientWithHeader
                headerChildren={
                  <CustomHeading tag="h6" className="__heading">
                    <FormatText tag="span">{instruction}</FormatText>
                  </CustomHeading>
                }
              >
                {imageInstruction && (
                  <>
                    <div className="__image-instruction">
                      <CustomImage
                        alt="Image instruction"
                        src={`${imageInstruction}`}
                        yRate={0}
                        onClick={() => setIsZoom(true)}
                      />
                    </div>
                    <ImageZooming
                      data={{
                        alt: 'Image Instruction',
                        src: `${imageInstruction}`,
                      }}
                      status={{
                        state: isZoom,
                        setState: setIsZoom,
                      }}
                    />
                  </>
                )}
                <Scrollbars universal={true}>
                  <div ref={contentRef} className="__content">
                    {questionArr.map((item, i) => (
                      <Fragment key={i}>
                        {i !== 0 && (
                          <span
                            className={`__editable ${generateClassName(i - 1)}`}
                            contentEditable={
                              mode.state === TEST_MODE.play ? true : false
                            }
                            style={{
                              pointerEvents:
                                mode.state === TEST_MODE.play ? 'all' : 'none',
                            }}
                            onBlur={() =>
                              mode.state === TEST_MODE.play && handleInputBlur()
                            }
                            onInput={(e) =>
                              mode.state === TEST_MODE.play &&
                              handleInputChange(i - 1, e.target.innerHTML)
                            }
                          ></span>
                        )}
                        <FormatText tag="span">{item}</FormatText>
                      </Fragment>
                    ))}
                  </div>
                </Scrollbars>
              </BlockBottomGradientWithHeader>
            </div>
          </>
        )}
      </div>
    </GameWrapper>
  )
}
