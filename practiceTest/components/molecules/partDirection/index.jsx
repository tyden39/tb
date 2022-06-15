import { useContext, useEffect } from 'react'

import { questionListTransform } from '../../../api/dataTransform'
import usePagination from '../../../hook/usePagination'
import { PageTestContext } from '../../../interfaces/contexts'
import { CustomButton } from '../../atoms/button'
import { CustomImage } from '../../atoms/image'

export const PartDirection = () => {
  const { currentGroupBtn, currentPart, currentQuestion, partData } =
    useContext(PageTestContext)

  const { getDirectionBtnState, paginate } = usePagination()

  const questionList = questionListTransform(partData, currentPart.index)

  const handleNextBtnClick = () => {
    // next part
    if (currentQuestion.index.includes(questionList.length - 1)) {
      if (currentPart.index >= partData.length - 1) return
      currentPart.setIndex(currentPart.index + 1)
      currentGroupBtn.setIndex(0)
      return
    }

    const target = currentQuestion.index[currentQuestion.index.length - 1] + 1
    // paginate
    paginate(questionList, target)
  }

  const handlePrevBtnClick = () => {
    // previous part
    if (currentQuestion.index.includes(0)) {
      if (currentPart.index !== 0) {
        currentPart.setIndex(currentPart.index - 1)
        paginate(questionList, [0])
      }
      return
    }

    const target = currentQuestion.index[0] - 1
    // paginate
    paginate(questionList, target)
  }

  const handleKeyPress = (e) => {
    switch (e.keyCode) {
      case 37:
        handlePrevBtnClick()
        break
      case 39:
        handleNextBtnClick()
        break
      default:
        break
    }
  }

  useEffect(() => {
    window.addEventListener('keyup', handleKeyPress)
    return () => window.removeEventListener('keyup', handleKeyPress)
  })

  return (
    <div className="pt-m-part-direction">
      <CustomButton
        className={`__prev ${getDirectionBtnState(
          'prev',
          questionList.length,
        )}`}
        onClick={() => handlePrevBtnClick()}
      >
        {currentPart.index > 0 && currentQuestion.index.includes(0) ? (
          <span>Previous Part</span>
        ) : (
          <CustomImage
            alt="chevron bar left"
            src="/pt/images/icons/ic-chevron-bar-left.svg"
          />
        )}
      </CustomButton>
      <CustomButton
        className={`__next ${getDirectionBtnState(
          'next',
          questionList.length,
        )}`}
        onClick={() => handleNextBtnClick()}
      >
        {currentQuestion.index.includes(questionList.length - 1) &&
        (currentPart.index < partData.length - 1 ||
          !currentQuestion.index.includes(questionList.length - 1)) ? (
          <span>Next Part</span>
        ) : (
          <CustomImage
            alt="chevron bar left"
            src="/pt/images/icons/ic-chevron-bar-left.svg"
          />
        )}
      </CustomButton>
    </div>
  )
}
