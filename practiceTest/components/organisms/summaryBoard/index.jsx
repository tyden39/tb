import { useContext, useState } from 'react'

import Scrollbars from 'react-custom-scrollbars'

import { questionListTransform } from '../../../api/dataTransform'
import usePagination from '../../../hook/usePagination'
import { COLOR_TEST_TYPE } from '../../../interfaces/constants'
import { PageTestContext } from '../../../interfaces/contexts'
import { CustomButton } from '../../atoms/button'
import { CustomHeading } from '../../atoms/heading'
import { CustomImage } from '../../atoms/image'
import { CustomText } from '../../atoms/text'

export const SummaryBoard = () => {
  const { paginate } = usePagination()

  const { currentPart, partData, progress, testInfo } =
    useContext(PageTestContext)

  const questionGroup = partData.map((item, i) => ({
    name: item.name,
    questionList: questionListTransform(partData, i),
  }))

  const [isOpen, setIsOpen] = useState(false)

  const checkDone = (i, j) => {
    let className = ''
    const selectorList = progress.state[i]
    const selectorGroup = selectorList.filter(
      (item) => item.id === selectorList[j].id,
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
          selectorList[firstIndex].value[j - firstIndex] !== null &&
          selectorList[firstIndex].value[j - firstIndex] !== ''
        )
          className += '--done'
      }
    }
    return className
  }

  const getDoneNumber = (i) => {
    let total = 0
    const selectorList = progress.state[i]
    selectorList.forEach((item, j) => {
      const selectorGroup = selectorList.filter((e) => e.id === item.id)
      if (selectorGroup.length > 0) {
        if (selectorGroup[0].group === 1) {
          if (selectorGroup[0].value !== null && selectorGroup[0].value !== '')
            total++
        } else {
          const firstIndex = selectorList.findIndex(
            (item) => item.id === selectorGroup[0].id,
          )
          if (
            selectorList[firstIndex].value !== null &&
            selectorList[firstIndex].value !== '' &&
            Array.isArray(selectorList[firstIndex].value) &&
            selectorList[firstIndex].value[j - firstIndex] !== null &&
            selectorList[firstIndex].value[j - firstIndex] !== ''
          )
            total++
        }
      }
    })
    return total
  }

  return (
    <div className={`pt-o-summary-board ${isOpen ? '--open' : ''}`}>
      <div
        className="pt-o-summary-board__container"
        style={{ cursor: isOpen ? 'default' : 'pointer' }}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <div className="__toggle" onClick={() => setIsOpen(!isOpen)}>
          <CustomImage
            className="__image-bg"
            alt="Toggle background"
            src="/pt/images/backgrounds/bg-summary.png"
            yRate={0}
          />
          <CustomImage
            className="__image-icon"
            alt="Toggle icon"
            src={
              isOpen
                ? '/pt/images/icons/ic-arrow-left.svg'
                : '/pt/images/icons/ic-menu.svg'
            }
          />
          <CustomHeading tag="h6" className="__heading">
            SUMMARY BOARD
          </CustomHeading>
        </div>
        <div className="__header">
          <CustomHeading tag="h6" className="__title">
            SUMMARY BOARD
          </CustomHeading>
          <div className="__info">
            <CustomImage
              className="__icon"
              alt="document"
              src={COLOR_TEST_TYPE[currentPart.index % 4]?.icon || ''}
              yRate={0}
            />
            <CustomHeading tag="h6" className="__title">
              {testInfo.gradeName} {testInfo.testName}
            </CustomHeading>
          </div>
        </div>
        <div className="__content">
          <Scrollbars universal={true}>
            <div className="__part-list">
              {questionGroup.map((item, i) => (
                <div key={i} className="__part-item">
                  <div className="__top">
                    <CustomHeading tag="h6" className="__name">
                      Part {i + 1}: <span>{item.name}</span>
                    </CustomHeading>
                    <div className="__total">
                      <CustomText tag="span">
                        {getDoneNumber(i)}/{item.questionList.length}
                      </CustomText>
                    </div>
                  </div>
                  <div className="__bottom">
                    {item.questionList.map((e, j) => (
                      <CustomButton
                        key={j}
                        className={`__btn ${checkDone(i, j)}`}
                        onClick={() =>
                          paginate(questionGroup[i].questionList, [j], i)
                        }
                      >
                        {j + 1}
                      </CustomButton>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Scrollbars>
        </div>
      </div>
    </div>
  )
}
