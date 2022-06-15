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

export const Game12 = ({ data }) => {
  const answers = data?.answers || []
  const audioInstruction = data?.audioInstruction || ''
  const audioScript = data?.audioScript || ''
  const instruction = data?.instruction || ''

  let isMr3 = false;

  const trueAnswer = answers.filter((item, i) => {
    if(item.text.length > 20) {
      isMr3 = true;
    }
    item.index = i
    return item.isCorrect === true
  })

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

  const { mode } = useContext(PageTestContext)

  const [countDown, setCountDown] = useState(null)
  const [isPlaying, setIsPLaying] = useState(false)
  const [isShowTapescript, setIsShowTapescript] = useState(false)
  const [shakingItem, setShakingItem] = useState(null)

  const defaultCheckbox = getProgressActivityValue([])
  const [chosenList, setChosenList] = useState(defaultCheckbox)

  const audio = useRef(null)

  const checkPrimary = (i) => {
    if (mode.state === TEST_MODE.play && chosenList.includes(i))
      return '--checked'
    return ''
  }

  const checkDanger = (i) => {
    if (!userAnswer?.value) return ''
    const findIndex = userAnswer.value.findIndex((item) => item === i)
    if (
      mode.state === TEST_MODE.review &&
      chosenList.includes(i) &&
      findIndex !== -1 &&
      userAnswer.status[findIndex] === false
    )
      return '--danger'
    return ''
  }

  const checkNumber = (i) => {
    if (isMr3) return ''
    if (answers.length <= 9) return (i % 3 === 1) ? '--down' : ''
    if (answers.length >= 12) return i % 2 === 1 ? '--down' : ''
    switch (answers.length) {
      case 10:
        if (i % 3 === 1 || i === 9) return '--up'
        return ''
      case 11:
        if (i % 3 === 0 || i * 3 === 2 || i === 11) return '--up'
        return ''
      default:
        return ''
    }
  }

  const checkSuccess = (i) => {
    if (
      mode.state === TEST_MODE.check &&
      trueAnswer.map((item) => item.index).includes(i)
    ) {
      return '--success'
    }
    if (!userAnswer?.value) return ''
    const findIndex = userAnswer.value.findIndex((item) => item === i)
    if (
      mode.state === TEST_MODE.review &&
      chosenList.includes(i) &&
      findIndex !== -1 &&
      userAnswer.status[findIndex] === true
    )
      return '--success'
    return ''
  }

  const generateClassName = (i) => {
    let className = ''
    className += checkNumber(i)
    className += ' '
    className += checkPrimary(i)
    className += ' '
    className += checkDanger(i)
    className += ' '
    className += checkSuccess(i)
    return className
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

  const handleCheckboxClick = (i) => {
    // update value
    let newArr = chosenList
    const maxNumber = trueAnswer.length
    if (newArr.includes(i)) newArr = newArr.filter((item) => item !== i)
    else {
      if (chosenList.length >= maxNumber) {
        shakeCheckbox(i)
        return
      }
      newArr.push(i)
    }

    // save progress
    setProgressActivityValue(
      newArr,
      // newArr.map((item) => (trueAnswer.includes(item) ? true : false)),
      newArr.map((item) => checkEachUserAnswer(item)),
    )
    // display
    setChosenList([...newArr])
  }

  const checkEachUserAnswer = (item) => {
    let isCorrect = false;
    trueAnswer.forEach(ans => {
      if (ans.index === item) {
        isCorrect = true;
      }
    })
    return isCorrect
  }

  const shakeCheckbox = (i) => {
    setShakingItem(i)
    setTimeout(() => setShakingItem(null), 1000)
  }

  useEffect(() => {
    if (!audio?.current) return
    if (isPlaying) audio.current.play()
    else audio.current.pause()
  }, [isPlaying, audio])

  return (
    <GameWrapper className="pt-o-game-12">
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
      <div className="pt-o-game-12__container" data-animate="fade-in">
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
            {audioInstruction &&
              <BlockWave className="__left">
                <AudioPlayer
                  className="__player"
                  isPlaying={isPlaying}
                  setIsPlaying={() => setIsPLaying(!isPlaying)}
                />
                <span className="__duration">{countDown}</span>
              </BlockWave>
            }
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
                <Scrollbars universal={true}>
                  <div
                    className={`__list ${isMr3 ? '--list-mr3' : ''} ${answers.length >= 12 ? '--lg' : ''}`}
                  >
                    {answers.map((item, i) => (
                      <CheckboxItem
                        key={i}
                        className={`${generateClassName(i)} ${
                          i === shakingItem ? '--shake' : ''
                        } ${ isMr3 ? '--mr3' : ''} `}
                        data={item}
                        style={{
                          pointerEvents:
                            mode.state === TEST_MODE.play ? 'all' : 'none',
                          
                        }}
                        onClick={() =>
                          mode.state === TEST_MODE.play &&
                          handleCheckboxClick(i)
                        }
                      />
                    ))}
                  </div>
                </Scrollbars>
              </div>
            </BlockBottomGradient>
          </>
        )}
      </div>
    </GameWrapper>
  )
}

const CheckboxItem = ({ className = '', data, style, onClick }) => {
  const { text } = data

  return (
    <div
      className={`__checkbox-item ${className}`}
      style={style}
      onClick={onClick}
    >
      <div className="__container">
        <CustomText tag="span" className="__text">
          {text}
        </CustomText>
      </div>
      <div className="__shadow"></div>
    </div>
  )
}
