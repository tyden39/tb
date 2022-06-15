import { Fragment, useContext, useEffect, useRef, useState } from 'react'

import Scrollbars from 'react-custom-scrollbars'

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

export const Game15Audio = ({ data }) => {
  const answers = data?.answers || []
  const audioInstruction = data?.audioInstruction || ''
  const audioScript = data?.audioScript || ''
  const instruction = data?.instruction || ''

  const choices = answers[0].answerList.split('/')

  const trueAnswers = answers.map((item) => item.answer)

  const { getProgressActivityValue, setProgressActivityValue } = useProgress()

  const { mode } = useContext(PageTestContext)

  const [countDown, setCountDown] = useState(null)
  const [isPlaying, setIsPLaying] = useState(false)
  const [isShowTapescript, setIsShowTapescript] = useState(false)

  const defaultRadio = getProgressActivityValue(
    Array.from(Array(answers.length), () => null),
  )
  const [action, setAction] = useState(defaultRadio)

  const audio = useRef(null)

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

  return (
    <GameWrapper className="pt-o-game-15 --audio">
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
      <div className="pt-o-game-15__container">
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
            <div className="pt-o-game-15__right">
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
          </>
        )}
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
        <CustomText tag="p">{data}</CustomText>
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
