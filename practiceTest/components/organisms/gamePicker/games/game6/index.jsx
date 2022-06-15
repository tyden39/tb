import { useContext, useEffect, useRef, useState } from 'react'

import useProgress from '../../../../../hook/useProgress'
import { TEST_MODE } from '../../../../../interfaces/constants'
import { PageTestContext } from '../../../../../interfaces/contexts'
import { CustomHeading } from '../../../../atoms/heading'
import { FormatText } from '../../../../molecules/formatText'
import { GameWrapper } from '../../../../templates/gameWrapper'
import { BlockBottomGradientWithHeader } from '../../../blockBottomGradient/BlockBottomGradientWithHeader'

export const Game6 = ({ data }) => {
  const answer = data?.answer || ''
  const instruction = data?.instruction || ''
  const question = data?.question || ''

  const questionArr = question.split('/')
  const dragList = questionArr.map((item, i) => ({ index: i, value: item }))

  const trueAnswer = answer
  let trueArr = []
  let tmpTrueArr = []

  questionArr
    .sort((a, b) => b.length - a.length)
    .forEach((item, i) => {
      let indexOf = ` ${trueAnswer.toLowerCase()} `.indexOf(
        ` ${item.toLowerCase().trim()} `,
      )
      let filterList = tmpTrueArr.filter((filter) => filter.pos === indexOf)
      while (filterList.length > 0) {
        indexOf = trueAnswer
          .toLowerCase()
          .indexOf(item.toLowerCase().trim(), filterList[0].pos + 1)
        filterList = tmpTrueArr.filter((filter) => filter.pos === indexOf)
      }
      tmpTrueArr.push({ index: i, pos: indexOf, value: item })
    })
  trueArr = tmpTrueArr.sort((a, b) => a.pos - b.pos)

  const { userAnswer, getProgressActivityValue, setProgressActivityValue } =
    useProgress()

  const { mode } = useContext(PageTestContext)

  const [cordinate, setCordinate] = useState([0, 0])
  const [currentPosition, setCurrentPosition] = useState([])
  const [currentSplitItem, setCurrentSplitItem] = useState(null)
  const [dragingText, setDraggingText] = useState('')
  const [isDraggingBottom, setIsDraggingBottom] = useState(null)
  const [isDraggingTop, setIsDraggingTop] = useState(null)

  const defaultRadio = getProgressActivityValue([])
  const [chosenList, setChosenList] = useState(defaultRadio)

  const cloneDragger = useRef(null)
  const dropBox = useRef(null)

  const allowDrop = (e) => e.preventDefault()

  const checkDanger = (i) => {
    if (
      mode.state === TEST_MODE.review &&
      userAnswer.value[i]?.value !== trueArr[i].value
    )
      return '--danger'
    return ''
  }

  const checkInvisible = (i) => {
    if (i === isDraggingTop) return '--invisible'
    return ''
  }

  const checkSuccess = (i) => {
    if (
      mode.state === TEST_MODE.review &&
      userAnswer.value[i]?.value === trueArr[i].value
    )
      return '--success'
    return ''
  }

  const dragging = (e) => {
    setCordinate([e.clientX, e.clientY])
    const dropItems = dropBox.current.querySelectorAll('.__drop-item')
    if (currentPosition.length <= 0) return
    const findIndex = currentPosition.findIndex((item, i) =>
      i === currentPosition.length - 1
        ? e.clientX >= item[0]
        : e.clientX <
            item[0] +
              dropItems[i].offsetWidth +
              cloneDragger.current.offsetWidth &&
          e.clientX >= item[0] &&
          e.clientY < item[1] + dropItems[i].offsetHeight &&
          e.clientY >= item[1],
    )
    setCurrentSplitItem(findIndex)
  }

  const dragEnd = (e, position) => {
    setCurrentSplitItem(-2)
    setCordinate([e.clientX, e.clientY])
    if (position === 'bottom') setIsDraggingBottom(null)
    else if (position === 'top') setIsDraggingTop(null)
  }

  const dragStart = (e, index, item, position) => {
    const img = new Image()
    img.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
    e.dataTransfer.setDragImage(img, 0, 0)
    e.dataTransfer.setData('index', item.index)
    e.dataTransfer.setData('value', item.value)
    setCordinate([e.clientX, e.clientY])
    if (position === 'bottom') setIsDraggingBottom(index)
    else if (position === 'top') setIsDraggingTop(index)
    setDraggingText(item.value)
  }

  const drop = (e, action) => {
    e.preventDefault()
    setIsDraggingBottom(null)
    setIsDraggingTop(null)
    const index = e.dataTransfer.getData('index')
    const value = e.dataTransfer.getData('value')
    const item = { index: parseInt(index), value }
    if (action) {
      insertItem(item)
      return
    }
    removeItem(item)
  }

  const generateClassName = (i) => {
    let className = ''
    className += checkInvisible(i)
    className += ' '
    className += checkDanger(i)
    className += ' '
    className += checkSuccess(i)
    return className
  }

  const insertItem = (selector) => {
    let newArr = chosenList
    // check duplicate item
    if (newArr.filter((item) => item.index === selector.index).length > 0)
      newArr = newArr.filter((item) => item.index !== selector.index)
    // update value
    newArr.splice(currentSplitItem + 1, 0, selector)
    // check isCorrect
    let checkStr = ''
    newArr.forEach((item) => (checkStr += `${item.value} `))
    // save progress
    setProgressActivityValue(
      newArr,
      checkStr.toLowerCase().trim() === trueAnswer.toLowerCase().trim()
        ? true
        : false,
    )
    // display
    setChosenList([...newArr])
    setCurrentSplitItem(null)
  }

  const quickInsertItem = (selector) => {
    // update value
    let newArr = chosenList
    newArr.push(selector)
    // check isCorrect
    let checkStr = ''
    newArr.forEach((item) => (checkStr += `${item.value} `))
    // save progress
    setProgressActivityValue(
      newArr,
      checkStr.toLowerCase().trim() === trueAnswer.toLowerCase().trim()
        ? true
        : false,
    )
    // display
    setChosenList([...newArr])
  }

  const quickRemoveItem = (selector) => {
    // update value
    const beforeArr = chosenList
    const afterArr = beforeArr.filter((item) => item.index !== selector.index)
    // check isCorrect
    let checkStr = ''
    afterArr.forEach((item) => (checkStr += `${item.value} `))
    // save progress
    setProgressActivityValue(afterArr, checkStr === trueAnswer ? true : false)
    // display
    setChosenList([...afterArr])
  }

  const removeItem = (selector) => {
    // update value
    const beforeArr = chosenList
    const afterArr = beforeArr.filter((item) => item.index !== selector.index)
    // check isCorrect
    let checkStr = ''
    afterArr.forEach((item) => (checkStr += `${item.value} `))
    // save progress
    setProgressActivityValue(afterArr, checkStr === trueAnswer ? true : false)
    // display
    setChosenList([...afterArr])
  }

  const updatePosition = () => {
    const dropItems = dropBox.current.querySelectorAll('.__drop-item')
    if (chosenList.length !== dropItems.length) return
    let positionArr = []
    dropItems.forEach((item) => {
      const rect = item.getBoundingClientRect()
      positionArr.push([rect.left, rect.top])
    })
    setCurrentPosition([...positionArr])
  }

  useEffect(() => {
    if (!dropBox?.current) return
    updatePosition(chosenList)
  }, [chosenList, dropBox])

  return (
    <GameWrapper className="pt-o-game-6">
      <div
        className="pt-o-game-6__container"
        data-animate="fade-in"
        onDrop={(e) => mode.state === TEST_MODE.play && drop(e, false)}
        onDragOver={(e) => mode.state === TEST_MODE.play && allowDrop(e)}
      >
        <BlockBottomGradientWithHeader
          className="--shadow"
          headerChildren={
            <CustomHeading tag="h6" className="__heading">
              <FormatText tag="span">{instruction}</FormatText>
            </CustomHeading>
          }
        >
          <div
            ref={dropBox}
            className="__drop-box"
            onDrop={(e) => {
              if (mode.state === TEST_MODE.play) {
                e.stopPropagation()
                drop(e, true)
              }
            }}
            onDragOver={(e) => mode.state === TEST_MODE.play && allowDrop(e)}
          >
            {[TEST_MODE.review, TEST_MODE.play].includes(mode.state) &&
              chosenList.map((item, i) => (
                <div
                  key={i}
                  className="__drop-item"
                  style={{
                    transform:
                      mode.state === TEST_MODE.review ||
                      currentSplitItem === -2 ||
                      currentSplitItem === null
                        ? 'translateX(0)'
                        : i <= currentSplitItem
                        ? 'translateX(-3rem)'
                        : 'translateX(3rem)',
                  }}
                >
                  <div
                    className={`__drop-content ${generateClassName(i)}`}
                    draggable={true}
                    style={{
                      pointerEvents:
                        mode.state === TEST_MODE.play ? 'all' : 'none',
                    }}
                    onClick={() =>
                      mode.state === TEST_MODE.play && quickRemoveItem(item)
                    }
                    onDrag={(e) => mode.state === TEST_MODE.play && dragging(e)}
                    onDragStart={(e) =>
                      mode.state === TEST_MODE.play &&
                      dragStart(e, i, item, 'top')
                    }
                    onDragEnd={(e) =>
                      mode.state === TEST_MODE.play && dragEnd(e, 'top')
                    }
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            {mode.state === TEST_MODE.check &&
              trueArr.map((item, i) => (
                <div key={i} className="__drop-item">
                  <div className="__drop-content --success">{item.value}</div>
                </div>
              ))}
          </div>
          <div className="__drag-box">
            <div className="__drag-length">
              {mode.state !== TEST_MODE.check &&
                dragList.map((item, i) => (
                  <div
                    key={i}
                    className={`__drag-item  ${
                      chosenList.findIndex((find) => find.index === i) !== -1
                        ? '--hidden'
                        : ''
                    }`}
                  >
                    <div
                      className={`__drag-content ${
                        isDraggingBottom === i ? '--invisible' : ''
                      }`}
                      draggable={true}
                      style={{
                        pointerEvents:
                          mode.state === TEST_MODE.play ? 'all' : 'none',
                      }}
                      onClick={() =>
                        mode.state === TEST_MODE.play && quickInsertItem(item)
                      }
                      onDrag={(e) =>
                        mode.state === TEST_MODE.play && dragging(e)
                      }
                      onDragStart={(e) =>
                        mode.state === TEST_MODE.play &&
                        dragStart(e, i, item, 'bottom')
                      }
                      onDragEnd={(e) =>
                        mode.state === TEST_MODE.play && dragEnd(e, 'bottom')
                      }
                    >
                      <span>{item.value}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </BlockBottomGradientWithHeader>
      </div>
      <div
        ref={cloneDragger}
        className={`pt-o-game-6__dragging-clone ${
          isDraggingBottom !== null ? '--bottom' : ''
        } ${isDraggingTop !== null ? '--top' : ''}`}
        style={{ top: cordinate[1], left: cordinate[0] }}
      >
        {dragingText}
      </div>
    </GameWrapper>
  )
}
