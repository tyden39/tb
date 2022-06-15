import { useContext, useState } from 'react'

import { questionListTransform } from '../../../api/dataTransform'
import usePagination from '../../../hook/usePagination'
import { PageTestContext } from '../../../interfaces/contexts'
import { CustomButton } from '../../atoms/button'
import { CustomImage } from '../../atoms/image'
import { useWindowSize } from 'utils/hook'

export const PartPagination = () => {
  const { currentGroupBtn, currentPart, currentQuestion, partData } =
    useContext(PageTestContext)

  const questionList = questionListTransform(partData, currentPart.index);

  
  const [width, height] = useWindowSize();
  const numberPerPage = width < 1024 ? 5 : 10;
  const { getNumberBtnState, paginate } = usePagination();

  const handleNextGroupBtnClick = () => {
    // if (currentQuestion.index.includes(questionList.length - 1)) return

    // next group
    currentGroupBtn.setIndex(currentGroupBtn.index + 1);
  }

  const handlePrevGroupBtnClick = () => {
    if (questionList.length <= numberPerPage || currentGroupBtn.index <= 0) return

    // prev group
    currentGroupBtn.setIndex(currentGroupBtn.index - 1);
  }

  return (
    <div className="pt-m-part-pagination">
      <div className="__prev">
        <CustomButton
          className={
            questionList.length <= numberPerPage || currentGroupBtn.index === 0
              ? '--disabled'
              : ''
          }
          onClick={() => handlePrevGroupBtnClick()}
        >
          <CustomImage
            alt="prev arrow"
            src="/pt/images/icons/ic-long-arrow-alt-left-blue.svg"
          />
        </CustomButton>
      </div>
      <div className="__list">
        {Array.from(Array(questionList.length), (e, i) => {
          if (i < numberPerPage * currentGroupBtn.index || i >= numberPerPage * (currentGroupBtn.index + 1)) {
            return null;
          }
          return (
            <CustomButton
            key={i}
            className={getNumberBtnState(i, numberPerPage)}
            onClick={() => paginate(questionList, [i], null, numberPerPage)}
            >
            {i + 1}
          </CustomButton>
          )}
        )}
      </div>
      <div className="__next">
        <CustomButton
          className={
            questionList.length <= numberPerPage ||
            currentGroupBtn.index === Math.ceil(questionList.length / numberPerPage) - 1
              ? '--disabled'
              : ''
          }
          onClick={() => handleNextGroupBtnClick()}
        >
          <CustomImage
            alt="next arrow"
            src="/pt/images/icons/ic-long-arrow-alt-left-blue.svg"
          />
        </CustomButton>
      </div>
    </div>
  )
}
