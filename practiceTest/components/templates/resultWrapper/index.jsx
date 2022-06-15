import { useContext, useEffect } from 'react'

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { Progress } from 'rsuite'

// import { POST_RESULT_TEST } from '../../../api/paths'
import {
  AUTH_COOKIE,
  COLOR_RESULT_PROGRESS,
  PREFIX_APP_UUID,
} from '../../../interfaces/constants'
import { RESULT_SKILL_NAME } from '../../../interfaces/constants'
import { PageTestContext } from '../../../interfaces/contexts'
import { callApi, getApiPath } from '../../../utils/fetch'
import { hashId } from '../../../utils/router'
import { CustomButton } from '../../atoms/button'
import { CustomHeading } from '../../atoms/heading'
import { CustomImage } from '../../atoms/image'
import { CustomText } from '../../atoms/text'
import { Fireworks } from '../../molecules/fireworks'

export const ResultWrapper = ({ data, identifyData }) => {
  let skillData = data
  skillData.forEach((item) => {
    item.skill = item.list[0].list[0].skill
  })

  const router = useRouter()
  // const gradeStringId = router?.query?.gradeId ? router.query.gradeId : ''
  const testStringId = router?.query?.testId ? router.query.testId : ''
  // const testId = hashId(testStringId.replace('test-', ''), 'test', false)

  const { mode, progress, testInfo, studentInfo } = useContext(PageTestContext)

  console.log('progress===', progress.state, data);

  const countAnserPerSkill = (index) => {
    // console.log('index===', index)
    // const filterProgress = progress.state.filter(
    //   (item) => item[0].skill === skill,
    // )
    // let total = 0
    // let currentId = null
    // filterProgress.forEach((list) => {
    //   list.forEach((item) => {
    //     if (item.id !== currentId) {
    //       currentId = item.id
    //       if (Array.isArray(item.status))
    //         item.status.forEach((answer) => {
    //           if (answer === true) total += item.point
    //         })
    //       else {
    //         if (item.status === true) total += item.point
    //       }
    //     }
    //   })
    // })

    const value = {
      correctPoint: 0,
      totalPoint: 0
    }
    const progressItem = progress.state[index];
    progressItem.forEach(item => {
      value.totalPoint += item.point;
      if (item?.status) {
        if (Array.isArray(item.status)) {
          let subPoint = 0;
          // let countCorrect = 0;
          item.status.forEach(subItem => {
            if (subItem) {
              // subPoint += item.point / item.status.length
              // countCorrect += 1;
              subPoint += item.point
            }
          })
          // subPoint += item.point / item.status.length * countCorrect;
          value.correctPoint += subPoint
        } else {
          value.correctPoint += item.point;
        }
      }
    })
    return value;
  }

  const countTotalAnser = () => {
    const progressTotal = progress.state;
    const value = {
      correctPoint: 0,
      totalPoint: 0
    }
    progressTotal.forEach((progressItem, index) => {
      value.totalPoint += skillData[index].totalPoint;
      if(Array.isArray(progressItem)) {
        progressItem.forEach(item => {
          if (item?.status) {
            if (Array.isArray(item.status)) {
              let subPoint = 0;
              // let countCorrect = 0;
              item.status.forEach(subItem => {
                if (subItem) {
                  // subPoint += item.point / item.status.length
                  // countCorrect += 1;
                  subPoint += item.point
                }
              })
              // subPoint += item.point / item.status.length * countCorrect;
              value.correctPoint += subPoint
            } else {
              value.correctPoint += item.point;
            }
          }
        })
      }
    })
    return value;
  }

  const submitResult = async () => {
    // // get token
    // const userToken = Cookies.get(PREFIX_APP_UUID + identifyData?.AppId)
    //   ? process.env.NEXT_PUBLIC_PREFIX_AUTH_TOKEN +
    //     Cookies.get(PREFIX_APP_UUID + identifyData?.AppId)
    //   : ''
    // if (!userToken) return
    // // collect data
    // const data = { id: testId, point: countTrueTest() }
    // // fecth api
    // await callApi(getApiPath(POST_RESULT_TEST), 'POST', userToken, data)
  
    const userQuery = router?.query?.practiceTestSlug;
    const teacherId = userQuery.split('===')[0]
    const formData = { ...studentInfo };
    formData.teacherId = teacherId;
    formData.point = `${Math.round(countTotalAnser().correctPoint * 100) / 100} / ${Math.round(countTotalAnser().totalPoint)}`;
    formData.testName = testInfo?.testName;
    formData.gradeName = testInfo?.gradeName;
    console.log('formData===', testInfo);
    const res = await fetch('/api/unit-question/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
  }

  useEffect(() => submitResult(), [])

  return (
    <div className="pt-t-result-wrapper" data-animate="fade-in">
      <div className="pt-t-result-wrapper__container">
        <div className="__header">
          <Fireworks />
          <CustomImage
            className="__medal"
            alt="medal"
            src="/pt/images/collections/clt-medal.png"
            yRate={0}
          />
          <CustomHeading tag="h4" className="__heading">
            {`${testInfo.gradeName} - ${testInfo.testName}`}
          </CustomHeading>
          <CustomText tag="p" className="__description">
            Congratulations on completing the test! Here are the results:
          </CustomText>
        </div>
        <div className="__content">
          <div className="__total">
            Total: {Math.round(countTotalAnser().correctPoint * 100) / 100}/{Math.round(countTotalAnser().totalPoint)}
          </div>
          <div className="__progress-list">
            {skillData && skillData.map((item, i) => {
              const countAnswer = countAnserPerSkill(i).correctPoint;
              return (
                <div key={i} className="__progress-item">
                  <div className="__info">
                    <label className="__label">{item.name}</label>
                    <span className="__value">
                      {Math.round(countAnswer * 100) / 100}/{item.totalPoint}
                    </span>
                  </div>
                  <Progress.Line
                    className="__filter"
                    percent={
                      (countAnswer / item.totalPoint) * 100
                    }
                    showInfo={false}
                    strokeColor={
                      COLOR_RESULT_PROGRESS[i % COLOR_RESULT_PROGRESS.length]
                    }
                  />
                </div>
              )
              {/* } */ }
            })}
          </div>
        </div>
        <div className="__footer">
          {/* <CustomButton
            className="__btn --cancel"
            appearance="ghost"
            onClick={() => router.push('/[gradeId]', `/${gradeStringId}`)}
          >
            Back to menu
          </CustomButton> */}
          <CustomButton
            className="__btn --submit"
            appearance="primary"
            onClick={() => mode.setState('review')}
          >
            View the answer
          </CustomButton>
        </div>
      </div>
    </div>
  )
}
