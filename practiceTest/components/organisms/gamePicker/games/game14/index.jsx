import { useContext, useEffect, useRef, useState } from 'react'

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
import { BlockBottomGradient } from '../../../blockBottomGradient'
import { BlockPaper } from '../../../blockPaper'
import { BlockWave } from '../../../blockWave'

export const Game14 = ({ data }) => {
  const answers = data?.answers || []
  const audioInstruction = data?.audioInstruction || ''
  const audioScript = data?.audioScript || ''
  const imageInstruction = data?.imageInstruction || ''
  const instruction = data?.instruction || ''

  const answerData = answers[0]

  const trueAnswers = answerData.answers

  let replaceQuestion = []

  // if (questions.length > 0) {
  //   replaceQuestion = questions.map((sentence) =>
  //     sentence.map((item) => item.replace(/\([0-9]+\)/g, '%n%')),
  //   )
  // }

  const { currentQuestion, mode } = useContext(PageTestContext)

  const firstIndex = currentQuestion.index[0] + 1

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

  const [countDown, setCountDown] = useState(null)
  const [isPlaying, setIsPLaying] = useState(false)
  const [isShowTapescript, setIsShowTapescript] = useState(false)
  const [isZoom, setIsZoom] = useState(false)

  const defaultTextArr = getProgressActivityValue(
    Array.from(Array(answerData.answers.length), () => ''),
  )
  const [textArr, setTextArr] = useState(defaultTextArr)

  const audio = useRef(null)

  const checkDanger = (i) => {
    if (mode.state === TEST_MODE.review && userAnswer.status[i] === false)
      return '--danger'
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
    className += checkDanger(i)
    className += ' '
    className += checkSuccess(i)
    return className
  }

  let quoteIndex = 0
  const generateQuoteNumber = (str) => {
    const splitArr = str.split('%n%')
    let returnStr = ''
    splitArr.forEach(
      (item, i) =>
        (returnStr +=
          i === 0 ? item : `<b> (${firstIndex + quoteIndex++})</b>${item}`),
    )
    return returnStr
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

  const handleInputBlur = (i, value) => {
    // update value
    let newTextArr = textArr
    if (newTextArr[i] || newTextArr[i] === '') {
      newTextArr[i] = value
      // check isCorrect
      let statusArr = []
      trueAnswers.forEach((item, i) =>
        statusArr.push(
          item
            .trim()
            .toLowerCase()
            .replace(/’/g, "'")
            .split('/')
            .includes(newTextArr[i].trim().toLowerCase())
            ? true
            : false,
        ),
      )
      // save progress
      setProgressActivityValue(newTextArr, statusArr)
      // display
      setTextArr([...newTextArr])
    }
  }

  useEffect(() => {
    if (!audio?.current) return
    if (isPlaying) audio.current.play()
    else audio.current.pause()
  }, [isPlaying, audio])

  return (
    <GameWrapper className="pt-o-game-14">
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
      <div className="pt-o-game-14__container">
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
            <BlockWave className="__left">
              <AudioPlayer
                className="__player"
                isPlaying={isPlaying}
                setIsPlaying={() => setIsPLaying(!isPlaying)}
              />
              <span className="__duration">{countDown}</span>
            </BlockWave>
            <BlockBottomGradient className="__right">
              {mode.state !== TEST_MODE.play && (
                <CustomButton
                  className="__tapescript"
                  onClick={() => setIsShowTapescript(true)}
                >
                  Tapescript
                </CustomButton>
              )}
              <div className="__header">
                <CustomHeading tag="h6" className="__heading">
                  <FormatText tag="span">{instruction}</FormatText>
                </CustomHeading>
              </div>
              <div className="__content">
                <div className="__top">
                  <Scrollbars universal={true}>
                    <div className="__table">
                      {imageInstruction ? (
                        <>
                          <CustomImage
                            className="__image-instruction"
                            alt="Image instruction"
                            src={`${imageInstruction}`}
                            yRate={0}
                            onClick={() => setIsZoom(true)}
                          />
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
                      ) : (
                        <>
                          <div className="__thead">
                            <div className="__tr">
                              {/* {headers.map(
                                (item, i) =>
                                  item && (
                                    <div
                                      key={i}
                                      className="__th"
                                      style={{ width: `${ratio[i]}%` }}
                                    >
                                      <CustomHeading
                                        tag="h6"
                                        className="__heading"
                                      >
                                        {item}
                                      </CustomHeading>
                                    </div>
                                  ),
                              )} */}
                            </div>
                          </div>
                          <div className="__tbody">
                            {/* {replaceQuestion.map((tr, i) => (
                              <div
                                key={i}
                                className={`__tr ${
                                  i === questions.length - 1 ? '--last-tr' : ''
                                }`}
                              >
                                {tr.map((td, j) => (
                                  <div
                                    key={j}
                                    className="__td"
                                    style={{ width: `${ratio[j]}%` }}
                                  >
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: generateQuoteNumber(td),
                                      }}
                                    ></span>
                                  </div>
                                ))}
                              </div>
                            ))} */}
                          </div>
                        </>
                      )}
                    </div>
                  </Scrollbars>
                  <div className="__background">
                    <CustomImage
                      className="__image"
                      alt="background"
                      src="/pt/images/backgrounds/bg-game-2.png"
                      fit="cover"
                      yRate={0}
                    />
                  </div>
                </div>
                <div className="__bottom">
                  <Scrollbars universal={true}>
                    <div className="__list">
                      <div className="__left">
                        {Array.from(
                          Array(
                            Math.ceil(
                              answerData.answers.length > 1
                                ? answerData.answers.length / 2
                                : answerData.answers.length,
                            ),
                          ),
                          (e, i) => (
                            <InputItem
                              key={i}
                              className={generateClassName(i)}
                              defaultValue={textArr[i]}
                              index={i}
                              indexStr={`(${i + firstIndex})`}
                              trueValue={trueAnswers[i]}
                              onBlur={handleInputBlur}
                            />
                          ),
                        )}
                      </div>
                      {answerData.answers.length > 1 && (
                        <div className="__right">
                          {Array.from(
                            Array(Math.ceil(answerData.answers.length / 2) - 1),
                            (e, i) => (
                              <InputItem
                                key={i}
                                className={generateClassName(
                                  Math.ceil(answerData.answers.length / 2) + i,
                                )}
                                defaultValue={
                                  textArr[
                                    Math.ceil(answerData.answers.length / 2) + i
                                  ]
                                }
                                index={
                                  Math.ceil(answerData.answers.length / 2) + i
                                }
                                indexStr={`(${
                                  Math.ceil(answerData.answers.length / 2) +
                                  i +
                                  firstIndex
                                })`}
                                trueValue={
                                  trueAnswers[
                                    Math.ceil(answerData.answers.length / 2) + i
                                  ]
                                }
                                onBlur={handleInputBlur}
                              />
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </Scrollbars>
                </div>
              </div>
            </BlockBottomGradient>
          </>
        )}
      </div>
    </GameWrapper>
  )
}

const InputItem = ({
  className,
  defaultValue,
  index,
  indexStr,
  trueValue,
  onBlur,
}) => {
  const { mode } = useContext(PageTestContext)

  const [textValue, setTextValue] = useState(defaultValue)

  const handleInputType = (e) => setTextValue(e.target.value)

  return (
    <div className="__input-item">
      <label>{indexStr}</label>
      <input
        className={`${className} ${
          textValue && textValue.length > 0 ? '--primary' : ''
        }`}
        disabled={mode.state === TEST_MODE.play ? false : true}
        type="text"
        placeholder="Type here ..."
        value={mode.state === TEST_MODE.check ? trueValue : textValue}
        onBlur={() => mode.state === TEST_MODE.play && onBlur(index, textValue)}
        onChange={(e) => mode.state === TEST_MODE.play && handleInputType(e)}
      />
    </div>
  )
}
