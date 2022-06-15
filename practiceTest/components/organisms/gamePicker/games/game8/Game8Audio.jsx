import { useContext, useEffect, useRef, useState } from 'react'

import Scrollbars from 'react-custom-scrollbars'
import { Icon, Toggle } from 'rsuite'

import useProgress from '../../../../../hook/useProgress'
import { TEST_MODE } from '../../../../../interfaces/constants'
import { PageTestContext } from '../../../../../interfaces/contexts'
import { formatDateTime } from '../../../../../utils/functions'
import { CustomButton } from '../../../../atoms/button'
import { CustomHeading } from '../../../../atoms/heading'
import { CustomImage } from '../../../../atoms/image'
import { CustomText } from '../../../../atoms/text'
import { AudioPlayer } from '../../../../molecules/audioPlayer'
import { FormatText } from '../../../../molecules/formatText'
import { GameWrapper } from '../../../../templates/gameWrapper'
import { BlockBottomGradient } from '../../../blockBottomGradient'
import { BlockPaper } from '../../../blockPaper'
import { BlockWave } from '../../../blockWave'

export const Game8Audio = ({ data }) => {
  const answers = data?.answers || []
  const audioInstruction = data?.audioInstruction || ''
  const audioScript = data?.audioScript || ''
  const instruction = data?.instruction || ''

  const trueAnswers = answers.map((item) => item.isCorrect)

  const { getProgressActivityValue, setProgressActivityValue } = useProgress()

  const { mode } = useContext(PageTestContext)

  const [countDown, setCountDown] = useState(null)
  const [isPlaying, setIsPLaying] = useState(false)
  const [isShowTapescript, setIsShowTapescript] = useState(false)

  const defaultArray = getProgressActivityValue(
    Array.from(Array(answers.length), () => false),
  )
  const [action, setAction] = useState(defaultArray)

  const audio = useRef(null)

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
    // display
    setAction([...radioValueArr])
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

  useEffect(
    () =>
      setProgressActivityValue(
        action,
        trueAnswers.map((item, i) => (item === action[i] ? true : false)),
      ),
    [],
  )

  useEffect(() => {
    if (!audio?.current) return
    if (isPlaying) audio.current.play()
    else audio.current.pause()
  }, [audio, isPlaying])

  return (
    <GameWrapper className="pt-o-game-8-audio">
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
      <div className="pt-o-game-8-audio__container" data-animate="fade-in">
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
            <BlockWave className="pt-o-game-8-audio__left">
              <AudioPlayer
                className="__player"
                isPlaying={isPlaying}
                setIsPlaying={() => setIsPLaying(!isPlaying)}
              />
              <span className="__duration">{countDown}</span>
            </BlockWave>
            <div className="pt-o-game-8-audio__right">
              {mode.state !== TEST_MODE.play && (
                <CustomButton
                  className="__tapescript"
                  onClick={() => setIsShowTapescript(true)}
                >
                  Tapescript
                </CustomButton>
              )}
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
          </>
        )}
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
        <CustomText tag="p">{content}</CustomText>
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
