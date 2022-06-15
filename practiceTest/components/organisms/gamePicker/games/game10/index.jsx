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

export const Game10 = ({ data }) => {
  const answers = data?.answers || []
  const audioInstruction = data?.audioInstruction || ''
  const audioScript = data?.audioScript || ''
  const imageInstruction = data?.imageInstruction || ''
  const instruction = data?.instruction || ''

  const trueAnswers = answers.map((item) => item.answer)

  const questionArr = answers.map((item) => item.question.split('%s%'))

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

  const { mode } = useContext(PageTestContext)

  const [countDown, setCountDown] = useState(formatDateTime(0))
  const [isPlaying, setIsPLaying] = useState(false)
  const [isShowTapescript, setIsShowTapescript] = useState(false)
  const [isZoom, setIsZoom] = useState(false)

  const defaultArray = getProgressActivityValue(
    Array.from(Array(answers.length), () => ''),
  )
  const [fillTextArr, setFillTextArr] = useState(defaultArray)

  const audio = useRef(null)
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
    // check isCorrect
    let statusArr = []
    trueAnswers.forEach((item, i) =>
      statusArr.push(
        item
          .trim()
          .toLowerCase()
          .replace(/’/g, "'")
          .split('/')
          .includes(
            fillTextArr[i]
              .replace(/&nbsp;/g, ' ')
              .trim()
              .toLowerCase(),
          )
          ? true
          : false,
      ),
    )
    // save progress
    setProgressActivityValue(fillTextArr, statusArr)
  }

  const handleInputChange = (e) => {
    const index = e.target.getAttribute('data-index')
    const textArr = fillTextArr
    if (typeof textArr[index] !== 'string') return
    textArr[index] = e.target.innerHTML
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
        if (i !== 0 || mode.state === TEST_MODE.review) return
        item.focus()
      } else if (mode.state === TEST_MODE.check) item.innerHTML = trueAnswers[i]
    })
  }, [contentRef, mode.state, isShowTapescript])

  let editableIndex = -1
  return (
    <GameWrapper className="pt-o-game-10">
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
      <div className="pt-o-game-10__container" data-animate="fade-in">
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
                <FormatText tag="p">{audioScript}</FormatText>
              </div>
            </BlockPaper>
          </div>
        ) : (
          <>
            <BlockWave className="__left">
              <AudioPlayer
                className="__player"
                isPlaying={isPlaying}
                setIsPlaying={() => setIsPLaying(!isPlaying)}
              />
              <span className="__duration">{countDown}</span>
            </BlockWave>
            <div className={`__right ${imageInstruction ? '--image' : ''}`}>
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
                    <FormatText>{instruction}</FormatText>
                  </CustomHeading>
                }
              >
                <Scrollbars universal={true}>
                  <div ref={contentRef} className="__content">
                    {questionArr.map((item, i) => (
                      <Fragment key={i}>
                        {i !== 0 && <br />}
                        {item.map((txt, j) => {
                          if (j !== 0) editableIndex++
                          return (
                            <Fragment key={j}>
                              {j !== 0 && (
                                <>
                                  <span
                                    className={`__editable ${generateClassName(
                                      editableIndex,
                                    )}`}
                                    contentEditable={
                                      mode.state === TEST_MODE.play
                                        ? true
                                        : false
                                    }
                                    data-index={editableIndex}
                                    style={{
                                      margin: '0 0.5rem',
                                      pointerEvents:
                                        mode.state === TEST_MODE.play
                                          ? 'all'
                                          : 'none',
                                    }}
                                    onBlur={() =>
                                      mode.state === TEST_MODE.play &&
                                      handleInputBlur()
                                    }
                                    onInput={(e) =>
                                      mode.state === TEST_MODE.play &&
                                      handleInputChange(e)
                                    }
                                  ></span>
                                </>
                              )}
                              <FormatText tag="span">{txt}</FormatText>
                            </Fragment>
                          )
                        })}
                      </Fragment>
                    ))}
                  </div>
                </Scrollbars>
                {imageInstruction && (
                  <>
                    <div className="__image-instruction">
                      <CustomImage
                        alt="Image Instruction"
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
              </BlockBottomGradientWithHeader>
            </div>
          </>
        )}
      </div>
    </GameWrapper>
  )
}
