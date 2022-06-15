import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { practiceTestDataTransform } from '../../../api/dataTransform'
import { questionListTransform } from '../../../practiceTest/api/dataTransform'
import { DingSound } from '../../../practiceTest/components/molecules/dingSound'
import { GamePicker } from '../../../practiceTest/components/organisms/gamePicker'
import { SummaryBoard } from '../../../practiceTest/components/organisms/summaryBoard'
import { StartTestScreen } from '../../../practiceTest/components/organisms/startTestScreen'
import { ResultWrapper } from '../../../practiceTest/components/templates/resultWrapper'
import { TestWrapper } from '../../../practiceTest/components/templates/testWrapper'
import { Wrapper } from '../../../practiceTest/components/templates/wrapper'
import { TEST_MODE } from '../../../practiceTest/interfaces/constants'
import { PageTestContext } from '../../../practiceTest/interfaces/contexts'
import { callApi } from '../../../practiceTest/utils/fetch'

export default function Test({ query }) {
  const router = useRouter()

  const [currentGroupBtn, setCurrentGroupbtn] = useState(0)
  const [currentPart, setCurrentPart] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState([0])
  const [identifyData, setIdentifyData] = useState(null)
  const [mode, setMode] = useState(TEST_MODE.play) // check | play | result | review
  const [partData, setPartData] = useState([])
  const [progress, setProgress] = useState([])
  // const [testName, setTestName] = useState('')
  // const [testTime, setTestTime] = useState('')
  const [testInfo, setTestInfo] = useState({
    testName: '',
    testTime: '',
    gradeName: ''
  })
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    class: '',
    email: ''
  })

  const [showStartScreen, setShowStartScreen] = useState(true)

  const pageData = { id: 'test' }

  const handleRouteComplete = () => setMode(TEST_MODE.play)

  useEffect(() => {
    const fetchData = async () => {
      const id = query?.practiceTestSlug
        ? query.practiceTestSlug.split('===')[1] || null
        : null
      if (!id) return

      const response = await callApi(`/api/unit-question/${id}`, 'get')
      console.log("response=====", response)
      if (!response) return
      const skillListData = response?.sections
        ? response.sections.map(practiceTestDataTransform)
        : []
      // setTestName(response?.name || '')
      // setTestTime(response?.time)
      setTestInfo({
        testName: response?.name || '',
        testTime: response?.time || 0,
        gradeName: response?.template_level_id || '',
      })
      setPartData([...skillListData])

      // console.log("skillListData=====", skillListData)

      const tq = skillListData.map((item, i) =>
        questionListTransform(skillListData, i),
      )

      setProgress(
        tq.map((questions) =>
          questions.map((item) => {
            return {
              id: item.id,
              group: item.group,
              point: item.point,
              skill: item.skill,
              status: false,
              value: null,
            }
          }),
        ),
      )

      // console.log("tqtqtqtq=====", tq)
    }

    fetchData()
  }, [])

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteComplete)
    return () => router.events.off('routeChangeComplete', handleRouteComplete)
  }, [])

  if (partData.length <= 0 || progress.length <= 0) return <></>

  const onStart = (data) => {
    setStudentInfo(data)
    setShowStartScreen(false)
  }

  return (
    <Wrapper isHavingHeader={false} isLoading={false} page={pageData}>
      <PageTestContext.Provider
        value={{
          currentGroupBtn: {
            index: currentGroupBtn,
            setIndex: setCurrentGroupbtn,
          },
          currentPart: { index: currentPart, setIndex: setCurrentPart },
          currentQuestion: {
            index: currentQuestion,
            setIndex: setCurrentQuestion,
          },
          identifyData,
          mode: { state: mode, setState: setMode },
          partData,
          progress: { state: progress, setState: setProgress },
          testInfo,
          studentInfo: studentInfo
        }}
      >
        {showStartScreen ?
          <StartTestScreen onStart={onStart} testName={testInfo?.testName} testTime={testInfo?.testTime}/> :
          <div>
            {[TEST_MODE.check, TEST_MODE.play, TEST_MODE.review].includes(mode) && (
              <TestWrapper>
                <GamePicker />
                <DingSound />
              </TestWrapper>
            )}
            {mode === TEST_MODE.result && (
              <ResultWrapper identifyData={identifyData} data={partData} />
            )}
            {(mode === TEST_MODE.play || mode !== TEST_MODE.result) && <SummaryBoard />}
          </div>
        }
      </PageTestContext.Provider>
    </Wrapper>
  )
}

export const getServerSideProps = async (context) => {
  const { query } = context

  return { props: { query } }
}
