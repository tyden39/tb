import { useContext, useEffect, useRef, useState } from 'react'

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import Scrollbars from 'react-custom-scrollbars'

import useProgress from '../../../../../hook/useProgress'
import { TEST_MODE } from '../../../../../interfaces/constants'
import { PageTestContext } from '../../../../../interfaces/contexts'
import { formatDateTime } from '../../../../../utils/functions'
import { CustomButton } from '../../../../atoms/button'
import { CustomImage } from '../../../../atoms/image'
import { AudioPlayer } from '../../../../molecules/audioPlayer'
import { FormatText } from '../../../../molecules/formatText'
import { GameWrapper } from '../../../../templates/gameWrapper'
import { BlockPaper } from '../../../blockPaper'
import { BlockWave } from '../../../blockWave'

export const Game9 = ({ data }) => {
  const answers = data?.answers || []
  const audioInstruction = data?.audioInstruction || ''
  const audioScript = data?.audioScript || ''
  const instruction = data?.instruction || ''
  const questionInstruction = data?.questionInstruction || ''

  let defaultRightColumn = []
  let leftColumn = []
  let trueAnswer = []
  let wrongAnswer = Array.from(Array(answers.length), (e, i) => i)
  answers.forEach((item, i) => {
    item.left && leftColumn.push(item.left)
    defaultRightColumn.push({
      id: `item-${i}`,
      content: item.right,
      index: i,
      isMatched: false,
    })
    if (item.rightAnswerPosition !== -1) {
      trueAnswer.push(item.rightAnswerPosition)
      wrongAnswer = wrongAnswer.filter(
        (filter) => filter !== item.rightAnswerPosition,
      )
    }
  })
  trueAnswer = trueAnswer.concat(wrongAnswer)

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

  const { mode } = useContext(PageTestContext)

  const [countDown, setCountDown] = useState(null)
  const [isPlaying, setIsPLaying] = useState(false)
  const [isShowTapescript, setIsShowTapescript] = useState(false)
  const [isTransparent, setIsTransparent] = useState(true)

  if (userAnswer.value !== null) {
    let sortDefaultRightColumn = []
    userAnswer.value.forEach((item, i) => {
      const target = defaultRightColumn[item.index]
      target.isMatched = item.isMatched
      sortDefaultRightColumn.push(target)
    })
    defaultRightColumn = sortDefaultRightColumn
  }
  const orderRightColumn = getProgressActivityValue(
    Array.from(Array(defaultRightColumn.length), (e, i) => ({
      index: i,
      isMatched: false,
    })),
  )
  let defaultArr = []
  orderRightColumn.forEach((item, i) => {
    const target = defaultRightColumn[i]
    target.isMatched = item.isMatched
    defaultArr.push(target)
  })
  const [rightColumn, setRightColumn] = useState({ items: defaultArr })

  const audio = useRef(null)

  const checkDanger = (i) => {
    if (
      userAnswer.value !== null &&
      mode.state === TEST_MODE.review &&
      userAnswer.value[i].index !== trueAnswer[i] &&
      userAnswer.value[i].isMatched
    )
      return '--danger'
    return ''
  }

  const checkSuccess = (i) => {
    if (
      (userAnswer.value !== null &&
        mode.state === TEST_MODE.review &&
        userAnswer.value[i].index === trueAnswer[i] &&
        userAnswer.value[i].isMatched) ||
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

  const getStyle = (style, snapshot) => {
    if (!snapshot.isDragging) return {}
    if (!snapshot.isDropAnimating) return style
    return {
      ...style,
      transitionDuration: `0.001s`,
    }
  }

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) return
    const items = reorder(
      rightColumn.items,
      result.source.index,
      result.destination.index,
    )
    const newArr = items.map((item) => item)
    setProgressActivityValue(
      newArr.map((item) => ({
        index: item.index,
        isMatched: item.isMatched,
      })),
      leftColumn.map((item, i) =>
        trueAnswer[i] === newArr.slice(0, trueAnswer.length)[i].index
          ? true
          : false,
      ),
    )
    setRightColumn({ items })
  }

  const reorder = (list, startIndex, endIndex) => {
    // a little function to help us with reordering the result
    const result = Array.from(list)
    // drag at same positon
    if (startIndex === endIndex) {
      if (result[startIndex].isMatched) result[startIndex].isMatched = false
      else result[startIndex].isMatched = true
      return result
    }
    // drag to other position
    const temp = result[endIndex]
    const deafultStartMatched = result[startIndex].isMatched
    result[endIndex] = result[startIndex]
    result[endIndex].isMatched = true
    result[startIndex] = temp
    result[startIndex].isMatched = deafultStartMatched
    return result
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

  useEffect(() => setIsTransparent(false), [])

  useEffect(() => {
    if (!audio?.current) return
    if (isPlaying) audio.current.play()
    else audio.current.pause()
  }, [isPlaying, audio])

  return (
    <GameWrapper
      className={`pt-o-game-9 ${questionInstruction ? '--text' : ''} ${
        audioInstruction ? '--audio' : ''
      } ${isTransparent ? '--transparent' : ''}`}
    >
      {audioInstruction && (
        <audio
          ref={audio}
          style={{ display: 'none' }}
          onLoadedMetadata={() =>
            setCountDown(
              formatDateTime(Math.ceil(audio.current.duration) * 1000),
            )
          }
          onTimeUpdate={() => handleAudioTimeUpdate()}
        >
          <source src={audioInstruction} />
        </audio>
      )}
      {audioInstruction && isShowTapescript ? (
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
          {questionInstruction && (
            <div className="pt-o-game-9__left">
              <BlockPaper>
                <div className="__content">
                  <FormatText tag="p">{questionInstruction}</FormatText>
                </div>
              </BlockPaper>
            </div>
          )}
          {audioInstruction && (
            <BlockWave className="pt-o-game-9__left">
              <AudioPlayer
                className="__player"
                isPlaying={isPlaying}
                setIsPlaying={() => setIsPLaying(!isPlaying)}
              />
              <span className="__duration">{countDown}</span>
            </BlockWave>
          )}
          <div className="pt-o-game-9__right">
            {mode.state !== TEST_MODE.play && audioInstruction && (
              <CustomButton
                className="__tapescript"
                onClick={() => setIsShowTapescript(true)}
              >
                Tapescript
              </CustomButton>
            )}
            <div className="__header">
              <FormatText tag="p">{instruction}</FormatText>
            </div>
            <div className="__content">
              <Scrollbars universal={true}>
                <div className="__left">
                  {leftColumn.map((item, i) => (
                    <div
                      key={i}
                      className={`__tag ${
                        rightColumn.items[i].isMatched === true
                          ? '--matched'
                          : ''
                      } ${generateClassName(i)}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div
                  className="__right"
                  style={{
                    pointerEvents:
                      mode.state === TEST_MODE.play ? 'all' : 'none',
                  }}
                >
                  <DragDropContext
                    onDragEnd={(result) =>
                      mode.state === TEST_MODE.play && onDragEnd(result)
                    }
                  >
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {rightColumn.items.map((item, index) => (
                            <div key={item.id} className="__item">
                              <Draggable draggableId={item.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    className={`__tag ${
                                      snapshot.isDragging ? '--dragging' : ''
                                    } ${
                                      item.isMatched === true ? '--matched' : ''
                                    } ${generateClassName(index)}`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getStyle(
                                      provided.draggableProps.style,
                                      snapshot,
                                    )}
                                  >
                                    {mode.state === TEST_MODE.check
                                      ? answers[trueAnswer[index]].right
                                      : item.content}
                                    <div className="__circle">
                                      <span></span>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            </div>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </Scrollbars>
            </div>
          </div>
        </>
      )}
    </GameWrapper>
  )
}
