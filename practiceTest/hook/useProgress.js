import { useContext } from 'react'

import { PageTestContext } from '../interfaces/contexts'

const useProgress = () => {
  const { currentPart, currentQuestion, progress } = useContext(PageTestContext)

  const userAnswer = progress.state[currentPart.index][currentQuestion.index[0]]

  const getProgressActivityValue = (backUpValue) =>
    progress.state[currentPart.index] !== undefined &&
    userAnswer !== undefined &&
    userAnswer.value !== null
      ? userAnswer.value
      : backUpValue

  const setProgressActivityValue = (value, isCorrect) => {
    let progressData = progress.state
    progressData[currentPart.index][currentQuestion.index[0]].status = isCorrect
    progressData[currentPart.index][currentQuestion.index[0]].value = value
    progress.setState([...progressData])
  }

  return { userAnswer, getProgressActivityValue, setProgressActivityValue }
}

export default useProgress
