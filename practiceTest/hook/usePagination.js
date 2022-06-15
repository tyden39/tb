import { useContext } from 'react'

import { questionListTransform } from '../api/dataTransform'
import { PageTestContext } from '../interfaces/contexts'

const usePagination = () => {
  const { currentPart, currentGroupBtn, currentQuestion, partData, progress } =
    useContext(PageTestContext)

  const questionList = questionListTransform(partData, currentPart.index)

  const getDirectionBtnState = (type, length) => {
    if (type === 'prev' && currentQuestion.index.includes(0)) {
      if (currentPart.index <= 0) {
        return '--disabled'
      }
      return '--prev-part'
    } else if (type === 'next') {
      if (
        !(
          currentPart.index < partData.length - 1 ||
          !currentQuestion.index.includes(questionList.length - 1)
        )
      )
        return '--disabled'
      if (currentQuestion.index.includes(length - 1)) return '--next-part'
    }
    return ''
  }

  const getNumberBtnState = (key, numberPerPage = 10) => {
    let className = ''
    const selectorList = progress.state[currentPart.index]
    const selectorGroup = selectorList.filter(
      (item) => item.id === selectorList[key].id,
    )
    if (selectorGroup.length > 0) {
      if (selectorGroup[0].group === 1) {
        if (selectorGroup[0].value !== null && selectorGroup[0].value !== '')
          className += '--done '
      } else {
        const firstIndex = selectorList.findIndex(
          (item) => item.id === selectorGroup[0].id,
        )
        if (
          selectorList[firstIndex].value !== null &&
          selectorList[firstIndex].value !== '' &&
          Array.isArray(selectorList[firstIndex].value) &&
          selectorList[firstIndex].value[key - firstIndex] !== null &&
          selectorList[firstIndex].value[key - firstIndex] !== ''
        )
          className += '--done '
      }
    }
    if (currentQuestion.index.includes(key)) className += '--active '
    if (
      key < currentGroupBtn.index * numberPerPage ||
      key >= (currentGroupBtn.index + 1) * numberPerPage
    )
      className += '--hidden'
    return className
  }

  const paginate = (list, target, partIndex = null, numberPerPage = 10) => {
    if (partIndex !== null) currentPart.setIndex(partIndex)
    // find first duplicate index
    const targetItem = list.findIndex((item) => item.id === list[target].id)
    if (targetItem === -1) return
    // add all duplicate index
    let pushArr = []
    for (let count = 0; count < list[targetItem].group; count++)
      pushArr.push(targetItem + count)
    currentQuestion.setIndex(pushArr)
    // move to current group btn
    const groupIndex = Math.ceil((targetItem + 1) / numberPerPage) - 1
    if (currentGroupBtn.index === groupIndex) return
    currentGroupBtn.setIndex(groupIndex)
  }

  return { getDirectionBtnState, getNumberBtnState, paginate }
}

export default usePagination
