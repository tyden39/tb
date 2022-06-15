import { Fragment } from 'react'
import { useContext, useEffect, useRef, useState } from 'react'

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

export const Game11Audio = ({ data }) => {
  console.log('Daaaattatata===', data)
  const instruction = data?.instruction || ''
  const audioInstruction = data?.audioInstruction || ''
  const audioScript = data?.audioScript || ''
  const questionsGroup = data?.questionsGroup || []

  const trueAnswer = questionsGroup.map((list) =>
    list.answers.findIndex((item) => item.isCorrect === true),
  )

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

  const { mode } = useContext(PageTestContext)

  const [countDown, setCountDown] = useState(null)
  const [isPlaying, setIsPLaying] = useState(false)
  const [isShowTapescript, setIsShowTapescript] = useState(false)

  const defaultRadio = getProgressActivityValue(
    Array.from(Array(questionsGroup.length), (e, i) => null),
  )
  const [radio, setRadio] = useState(defaultRadio)

  const audio = useRef(null)

  const checkPrimary = (i, j) => {
    if (
      mode.state === TEST_MODE.play &&
      radio[i] !== undefined &&
      radio[i] === j
    )
      return '--checked'
    return ''
  }

  const checkDanger = (i, j) => {
    if (
      mode.state === TEST_MODE.review &&
      userAnswer.status[i] === false &&
      radio[i] !== undefined &&
      radio[i] === j
    )
      return '--danger'
    return ''
  }

  const checkSuccess = (i, j) => {
    if (
      (mode.state === TEST_MODE.review &&
        userAnswer.status[i] === true &&
        radio[i] !== undefined &&
        radio[i] === j) ||
      (mode.state === TEST_MODE.check && trueAnswer[i] === j)
    )
      return '--success'
    return ''
  }

  const generateClassName = (i, j) => {
    let className = ''
    className += checkPrimary(i, j)
    className += ' '
    className += checkDanger(i, j)
    className += ' '
    className += checkSuccess(i, j)
    return className
  }

  const handleRadioClick = (i, j) => {
    let beforeArr = radio
    if (beforeArr[i] === undefined) return
    beforeArr[i] = j
    // check isCorrect
    let statusArr = []
    trueAnswer.forEach((item, i) =>
      statusArr.push(item === beforeArr[i] ? true : false),
    )
    // save progress
    setProgressActivityValue(beforeArr, statusArr)
    // display
    setRadio([...beforeArr])
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
    <GameWrapper className="pt-o-game-11-audio">
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
      {isShowTapescript ? (
        <div className="__paper">
          <div className="__toggle" onClick={() => setIsShowTapescript(false)}>
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
          <BlockWave className="pt-o-game-11-audio__left">
            <AudioPlayer
              className="__player"
              isPlaying={isPlaying}
              setIsPlaying={() => setIsPLaying(!isPlaying)}
            />
            <span className="__duration">{countDown}</span>
          </BlockWave>
          <BlockBottomGradient className="pt-o-game-11-audio__right">
            {mode.state !== TEST_MODE.play && (
              <CustomButton
                className="__tapescript"
                onClick={() => setIsShowTapescript(true)}
              >
                Tapescript
              </CustomButton>
            )}
            <div className="__header">
              <CustomHeading tag="h6" className="__description">
                <FormatText tag="span">{instruction}</FormatText>
              </CustomHeading>
            </div>
            <div className="__content">
              <Scrollbars universal={true}>
                {questionsGroup.map((item, i) => (
                  <div key={i} className="__radio-group">
                    <CustomHeading tag="h6" className="__radio-heading">
                      {item.question.split('%s%').map((splitItem, j) => (
                        <Fragment key={j}>
                          {j % 2 === 1 && <div className="__space"></div>}
                          <FormatText tag="span">{splitItem}</FormatText>
                        </Fragment>
                      ))}
                    </CustomHeading>
                    <div className="__radio-list">
                      {item.answers.map((childItem, j) => (
                        <div
                          key={j}
                          className={`__radio-item ${generateClassName(i, j)}`}
                          style={{
                            pointerEvents:
                              mode.state === TEST_MODE.play ? 'all' : 'none',
                          }}
                          onClick={() =>
                            mode.state === TEST_MODE.play &&
                            handleRadioClick(i, j)
                          }
                        >
                          <CustomText tag="p">{childItem.text}</CustomText>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </Scrollbars>
            </div>
          </BlockBottomGradient>
        </>
      )}
    </GameWrapper>
  )
}
