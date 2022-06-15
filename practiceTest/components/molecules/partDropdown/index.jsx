import { useContext, useRef, useState } from 'react'

import { Scrollbars } from 'react-custom-scrollbars'
import { Dropdown } from 'rsuite'

import { questionListTransform } from '../../../api/dataTransform'
import usePagination from '../../../hook/usePagination'
import { COLOR_TEST_TYPE } from '../../../interfaces/constants'
import { PageTestContext } from '../../../interfaces/contexts'
import { CustomHeading } from '../../atoms/heading'
import { CustomImage } from '../../atoms/image'

export const PartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)

  const hiddenTriggerBtn = useRef(null)

  const { currentGroupBtn, currentPart, partData, testInfo } =
    useContext(PageTestContext)
  const { gradeName, testName } = testInfo

  const { paginate } = usePagination()

  if (!partData) return <></>

  const parts = partData

  const activeIndex = parts.findIndex((part, i) => i === currentPart.index)

  const questionList = questionListTransform(partData, currentPart.index)

  const handleDropdownItemClick = (id) => {
    currentPart.setIndex(id)
    currentGroupBtn.setIndex(0)
    paginate(questionList, [0])
    if (hiddenTriggerBtn?.current) hiddenTriggerBtn.current.click()
  }

  return (
    <div
      className="pt-m-part-dropdown"
      style={{
        '--height': `${
          parts && parts.length >= 6 ? 31.2 : 5.2 * parts.length
        }rem`,
      }}
    >
      {parts && parts.length > 0 && (
        <>
          <Dropdown
            className="pt-m-part-dropdown__menu"
            title="Default"
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
          >
            <Scrollbars className="__scroll-container" universal={true}>
              {parts.map((part, i) => (
                <Dropdown.Item
                  key={part.id}
                  active={i === currentPart.index ? true : false}
                  onSelect={() =>
                    part.id !== currentPart.id && handleDropdownItemClick(i)
                  }
                >
                  {`Part ${i + 1}: ${part?.name || ''}`}
                </Dropdown.Item>
              ))}
            </Scrollbars>
          </Dropdown>
          <div ref={hiddenTriggerBtn} style={{ display: 'none' }}></div>
        </>
      )}
      <div className="pt-m-part-dropdown__container">
        <div className="__banner">
          <CustomImage
            alt={`${
              COLOR_TEST_TYPE[activeIndex % 4]
                ? COLOR_TEST_TYPE[activeIndex % 4].name
                : COLOR_TEST_TYPE[0].icon
            } document`}
            src={
              COLOR_TEST_TYPE[activeIndex % 4]
                ? COLOR_TEST_TYPE[activeIndex % 4].icon
                : COLOR_TEST_TYPE[0].icon
            }
          />
        </div>
        <div className="__info">
          <CustomHeading tag="h6" className="__test-name">
            {`${gradeName ? `${gradeName} - ` : ''}${testName}`}
          </CustomHeading>
          <CustomHeading tag="h6" className="__part-name">
            Part {activeIndex + 1}:{' '}
            <span className="__name">
              {parts[activeIndex]?.name ? parts[activeIndex].name : ''}
            </span>
          </CustomHeading>
        </div>
        <CustomImage
          className={`__toggle ${isOpen ? '--up' : ''}`}
          alt="angle down blue"
          src="/pt/images/icons/ic-angle-down-blue.svg"
          yRate={0}
        />
      </div>
    </div>
  )
}
