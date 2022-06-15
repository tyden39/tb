import { useContext, useState } from 'react'

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { Collapse } from 'react-collapse'

import { partDataTransform } from '../../../api/dataTransform'
import { GET_PART_LIST_BY_TEST_ID } from '../../../api/paths'
import {
  COLOR_TEST_TYPE,
  EDU_MODE,
  PREFIX_APP_UUID,
} from '../../../interfaces/constants'
import { PageGradeContext } from '../../../interfaces/contexts'
import { CARD_TEST_TYPE } from '../../../interfaces/types'
import { callApi, getApiPath } from '../../../utils/fetch'
import { hashId } from '../../../utils/router'
import { CustomButton } from '../../atoms/button'
import { CustomHeading } from '../../atoms/heading'
import { CustomImage } from '../../atoms/image'
import { CustomText } from '../../atoms/text'
import { Parts } from '../../organisms/parts'

export const CardTest = ({ active, color, data, isShowModal }) => {
  const { identify } = useContext(PageGradeContext)

  const [parts, setParts] = useState([])

  const router = useRouter()
  const gradeId = router.query.gradeId

  const { id, isFree, name } = data
  const { state, setState } = active

  const eduMode = Cookies.get(EDU_MODE)

  const handleCardClick = async (e) => {
    setState(!state || state !== id ? id : null)
    // not exist data
    if (!parts || parts.length <= 0) {
      const userToken = Cookies.get(PREFIX_APP_UUID + identify.AppId)
        ? process.env.NEXT_PUBLIC_PREFIX_AUTH_TOKEN +
          Cookies.get(PREFIX_APP_UUID + identify.AppId)
        : ''
      if (!userToken) return
      const partApiData = await callApi(
        getApiPath(GET_PART_LIST_BY_TEST_ID, [{ key: 'id', value: id }]),
        'GET',
        userToken,
      )
      if (!partApiData || partApiData.length <= 0) return
      const partData = partApiData.map(partDataTransform)
      if (partData && Array.isArray(partData)) setParts(partData)
    }
  }

  const handleStartBtnClick = (e) => {
    e.stopPropagation()
    if (parts[0]) {
      router.push(
        '/[gradeId]/[testId]',
        `/${gradeId}/test-${hashId(id, 'test')}`,
      )
    }
  }

  return (
    <div
      className={`pt-m-card-test --${COLOR_TEST_TYPE[color].name} ${
        eduMode === 'true' || isFree ? '' : '--disabled'
      }`}
    >
      <div
        className="pt-m-card-test__toggle"
        onClick={(e) =>
          eduMode === 'true' || isFree
            ? handleCardClick(e)
            : isShowModal.setState(true)
        }
      >
        <CustomImage
          className="__banner"
          alt={`${COLOR_TEST_TYPE[color].name} document`}
          src={color ? COLOR_TEST_TYPE[color].icon : COLOR_TEST_TYPE[0].icon}
        />
        <CustomHeading tag="h6" className="__name">
          {name}
        </CustomHeading>
        {eduMode !== 'true' && !isFree && (
          <CustomButton className="__btn --locked">
            <CustomText>Locked</CustomText>
            <CustomImage
              alt="Locekd"
              src="/pt/images/icons/ic-lock-dark-blue.svg"
            />
          </CustomButton>
        )}
        {(eduMode === 'true' || isFree) && state === id && (
          <CustomButton
            className="__btn"
            isDisabled={parts && parts.length > 0 ? false : true}
            isLoading={parts && parts.length > 0 ? false : true}
            onClick={(e) =>
              (eduMode === 'true' || isFree) && handleStartBtnClick(e)
            }
          >
            Start Now
          </CustomButton>
        )}
      </div>
      {parts && parts.length > 0 && (
        <Collapse isOpened={state === id ? true : false}>
          <Parts parts={parts} />
        </Collapse>
      )}
    </div>
  )
}

// CardTest.propTypes = CARD_TEST_TYPE
