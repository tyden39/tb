import { Fragment, useContext, useEffect } from 'react'

import { questionListTransform } from '../../../api/dataTransform'
import { PageTestContext } from '../../../interfaces/contexts'
import { Game1 } from './games/game1'
import { Game1Image } from './games/game1/Game1Image'
import { Game10 } from './games/game10'
import { Game11 } from './games/game11'
import { Game11Audio } from './games/game11/Game11Audio'
import { Game12 } from './games/game12'
import { Game13 } from './games/game13'
import { Game14 } from './games/game14'
import { Game15 } from './games/game15'
import { Game15Audio } from './games/game15/Game15Audio'
import { Game2 } from './games/game2'
import { Game3 } from './games/game3'
import { Game3Audio } from './games/game3/Game3Audio'
import { Game4 } from './games/game4'
import { Game5 } from './games/game5'
import { Game6 } from './games/game6'
import { Game7 } from './games/game7'
import { Game8 } from './games/game8'
import { Game8Audio } from './games/game8/Game8Audio'
import { Game9 } from './games/game9'

export const GamePicker = () => {
  const { currentPart, currentQuestion, partData } = useContext(PageTestContext)

  const questionList = questionListTransform(partData, currentPart.index)

  useEffect(() => {
    const currentArr = [0]
    if (questionList[0].group > 1)
      for (let i = 1; i < questionList[0].group; i++) currentArr.push(i)
    currentQuestion.setIndex(currentArr)
  }, [currentPart.index])

  return (
    <div className="pt-o-game-picker">
      {questionList.map((item, i) => {
        // first item in arr currentQuestion
        if (currentQuestion.index[0] === i) {
          switch (item.activityType) {
            case 1:
              return item.imageInstruction ? (
                <Game1Image key={i} data={item} />
              ) : (
                <Game1 key={i} data={item} />
              )
            case 2:
              return <Game2 key={i} data={item} />
            case 3:
              return item.audioInstruction ? (
                <Game3Audio key={i} data={item} />
              ) : (
                <Game3 key={i} data={item} />
              )
            case 4:
              return <Game4 key={i} data={item} />
            case 5:
              return <Game5 key={i} data={item} />
            case 6:
              return <Game6 key={i} data={item} />
            case 7:
              return <Game7 key={i} data={item} />
            case 8:
              return item.audioInstruction ? (
                <Game8Audio key={i} data={item} />
              ) : (
                <Game8 key={i} data={item} />
              )
            case 9:
              return <Game9 key={i} data={item} />
            case 10:
              return <Game10 key={i} data={item} />
            case 11:
              return item.audioInstruction ? (
                <Game11Audio key={i} data={item} />
              ) : (
                <Game11 key={i} data={item} />
              )
            case 12:
              return <Game12 key={i} data={item} />
            case 13:
              return <Game13 key={i} data={item} />
            case 14:
              return <Game14 key={i} data={item} />
            case 15:
              return item.audioInstruction ? (
                <Game15Audio key={i} data={item} />
              ) : (
                <Game15 key={i} data={item} />
              )
            default:
              return <Fragment key={i}></Fragment>
          }
        } else return <Fragment key={i}></Fragment>
      })}
    </div>
  )
}
