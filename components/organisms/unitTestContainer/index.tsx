import { CSSProperties, useEffect, useState } from 'react'

import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { Collapse } from 'react-collapse'
import { Button, Pagination } from 'rsuite'

import { callApi } from 'api/utils'
import { DateInput } from 'components/atoms/dateInput'
import { InputWithLabel } from 'components/atoms/inputWithLabel'
import { SelectPicker } from 'components/atoms/selectPicker'
import { MultiSelectPicker } from 'components/atoms/selectPicker/multiSelectPicker'
import { UnitTestTable } from 'components/molecules/unitTestTable'
import { USER_ROLES } from 'interfaces/constants'
import {
  ACTIVE_STATUS,
  GRADE_SELECTIONS,
  SKILLS_SELECTIONS,
} from 'interfaces/struct'
import { userInRight } from 'utils'

import { StickyFooter } from '../stickyFooter'

type PropsType = {
  className?: string
  style?: CSSProperties
}

export const UnitTestContainer = ({ className = '', style }: PropsType) => {
  const router = useRouter()
  const [session] = useSession()
  const isImportable = userInRight([USER_ROLES.Operator], session)
  const isCreatable =
    router.query.m !== undefined || (!router.query.m && isImportable)

  const [unitTestList, setUnitTestList] = useState([] as any[])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  const [isOpenFilterCollapse, setIsOpenFilterCollapse] = useState(false)
  const [triggerReset, setTriggerReset] = useState(false)

  const [filterName, setFilterName] = useState('')
  const [filterGrade, setFilterGrade] = useState([] as any[])
  const [filterTime, setFilterTime] = useState('')
  const [filterTotalQuestion, setFilterTotalQuestion] = useState('')
  const [filterSkill, setFilterSkill] = useState([] as any[])
  const [filterStartDate, setFilterStartDate] = useState(null as any)
  const [filterEndDate, setFilterEndDate] = useState(null as any)
  const [filterStatus, setFilterStatus] = useState('' as '' | 'AC' | 'DI')

  const [isFilter, setIsFilter] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  const handleNameChange = (val: string) => setFilterName(val)
  const handleNameSubmit = (e: any, val: string) => {
    if (e.keyCode === 13) {
      handleFilterSubmit(false, { name: val })
      e.target.blur()
    }
  }
  const handleGradeChange = (val: any[]) => {
    setFilterGrade([...val])
    handleFilterSubmit(false, { templateLevelId: [...val] })
  }
  const handleTimeChange = (val: string) => setFilterTime(val)
  const handleTimeSubmit = (e: any, val: string) => {
    if (e.keyCode === 13) {
      handleFilterSubmit(false, { time: val })
      e.target.blur()
    }
  }
  const handleTotalQuestionChange = (val: string) => setFilterTotalQuestion(val)
  const handleTotalQuestionSubmit = (e: any, val: string) => {
    if (e.keyCode === 13) {
      handleFilterSubmit(false, { totalQuestion: val })
      e.target.blur()
    }
  }
  const handleSkillChange = (val: any[]) => {
    setFilterSkill([...val])
    handleFilterSubmit(false, { skills: [...val] })
  }
  const handleStartDateChange = (date: number) => {
    setFilterStartDate(date)
    handleFilterSubmit(false, { startDate: date })
  }
  const handleEndDateChange = (date: number) => {
    setFilterEndDate(date)
    handleFilterSubmit(false, { endDate: date })
  }
  const handleStatusChange = (val: '' | 'AC' | 'DI') => {
    setFilterStatus(val)
    handleFilterSubmit(false, { status: val })
  }

  const filterBagde = [
    filterGrade.length > 0,
    filterTime ? true : false,
    filterTotalQuestion ? true : false,
    filterSkill.length > 0,
    filterStartDate ? true : false,
    filterEndDate ? true : false,
    filterStatus ? true : false,
  ].filter((item) => item === true).length

  const checkExistFilter = () =>
    (filterName ||
      filterGrade.length > 0 ||
      filterTime ||
      filterTotalQuestion ||
      filterSkill.length > 0 ||
      filterStartDate ||
      filterEndDate ||
      filterStatus) &&
    isFilter
      ? true
      : false

  const collectData = (isReset: boolean, page = 0, body: any = null) => {
    const collection: any = { page }
    if (!isReset) {
      if (filterName || body?.name)
        collection['name'] = body?.name || filterName
      if (
        (filterGrade && filterGrade.length > 0) ||
        (body?.templateLevelId && body.templateLevelId.length > 0)
      )
        collection['template_level_id'] = body?.templateLevelId || filterGrade
      if (filterTime || body?.time)
        collection['time'] = body?.time || filterTime
      if (filterTotalQuestion || body?.totalQuestion)
        collection['total_question'] =
          body?.totalQuestion || filterTotalQuestion
      if (
        (filterSkill && filterSkill.length > 0) ||
        (body?.skills && body.skills.length > 0)
      )
        collection['skills'] = body?.skills || filterSkill
      if (filterStartDate || body?.startDate)
        collection['start_date'] = body?.startDate || filterStartDate
      if (filterEndDate || body?.endDate)
        collection['end_date'] = body?.endDate || filterEndDate
      if (filterStatus || body?.status)
        collection['status'] = body?.status || filterStatus
    }
    return collection
  }

  const handleItemDelete = async (id: number) => {
    const body = collectData(false, currentPage - 1)
    setIsFilter(true)
    const response = await callApi(`/api/unit-test/${id}`, 'delete')
    if (response) {
      const scope = router.query?.m
        ? ['mine', 'teacher'].findIndex((item) => item === router.query.m)
        : null
      const newUnitTest: any = await callApi(
        '/api/unit-test/search',
        'post',
        'Token',
        {
          ...body,
          scope: (scope && scope !== -1) || scope === 0 ? scope + 1 : null,
        },
      )
      if (newUnitTest?.unitTests) setUnitTestList([...newUnitTest.unitTests])
      if (
        newUnitTest?.totalPages &&
        newUnitTest.totalPages < totalPage &&
        newUnitTest.totalPage > 0
      )
        setCurrentPage(currentPage - 1)
      setTotalPage(newUnitTest?.totalPages)
    }
  }

  const handleFilterSubmit = async (
    isReset: boolean,
    customData: any = null,
  ) => {
    const body = collectData(isReset, 0, customData)
    setIsFilter(!isReset)
    const scope = router.query?.m
      ? ['mine', 'teacher'].findIndex((item) => item === router.query.m)
      : null
    const response: any = await callApi(
      '/api/unit-test/search',
      'post',
      'Token',
      {
        ...body,
        scope: (scope && scope !== -1) || scope === 0 ? scope + 1 : null,
      },
    )
    if (response) {
      if (response?.unitTests) setUnitTestList([...response.unitTests])
      if (response?.currentPage)
        setCurrentPage(
          response.currentPage + 1 > 0 ? response.currentPage + 1 : 1,
        )
      if (response?.totalPages) setTotalPage(response.totalPages)
    }
  }

  const handlePageChange = async (page: number) => {
    const body = collectData(false, page - 1)
    setIsFilter(true)
    const scope = router.query?.m
      ? ['mine', 'teacher'].findIndex((item) => item === router.query.m)
      : null
    const response: any = await callApi(
      '/api/unit-test/search',
      'post',
      'Token',
      {
        ...body,
        scope: (scope && scope !== -1) || scope === 0 ? scope + 1 : null,
      },
    )
    if (response) {
      if (response?.unitTests) setUnitTestList([...response.unitTests])
      if (response?.currentPage || response.currentPage === 0)
        setCurrentPage(response.currentPage + 1)
      if (response?.totalPages) setTotalPage(response.totalPages)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const scope = router.query?.m
        ? ['mine', 'teacher'].findIndex((item) => item === router.query.m)
        : null
      const bodyData = {
        page: 0,
        scope: (scope && scope !== -1) || scope === 0 ? scope + 1 : null,
        isSystem: router.query?.m === 'mine' ? false : true,
      }
      const response: any = await callApi(
        '/api/unit-test/search',
        'post',
        'Token',
        bodyData,
      )
      if (response?.unitTests) setUnitTestList([...response.unitTests])
      setCurrentPage(1)
      if (response?.totalPages) setTotalPage(response.totalPages)
      if (response) setIsLoading(false)
    }

    fetchData()
  }, [router.asPath])

  return (
    <div
      className={`m-unittest-template-table-data  ${className}`}
      style={style}
    >
      <div className="m-unittest-template-table-data__content">
        <div className="content__sup">
          <div className="__input-group">
            <InputWithLabel
              className="__search-box"
              label="Tên đề thi"
              placeholder="Tìm kiếm đề thi"
              triggerReset={triggerReset}
              type="text"
              onBlur={handleNameChange}
              onKeyUp={handleNameSubmit}
              icon={<img src="/images/icons/ic-search-dark.png" alt="search" />}
            />
            <Button
              className="__sub-btn"
              data-active={isOpenFilterCollapse}
              style={{ marginLeft: '0.8rem' }}
              onClick={() => setIsOpenFilterCollapse(!isOpenFilterCollapse)}
            >
              <div
                className="__badge"
                data-value={filterBagde}
                data-hidden={filterBagde <= 0}
              >
                <img src="/images/icons/ic-filter-dark.png" alt="filter" />
              </div>
              <span>Lọc</span>
            </Button>
            <Button
              className="__sub-btn"
              onClick={() => {
                setTriggerReset(!triggerReset)
                handleFilterSubmit(true)
              }}
            >
              <img src="/images/icons/ic-reset-darker.png" alt="reset" />
              <span>Reset</span>
            </Button>
            <Button
              className="__main-btn"
              onClick={() => {
                handleFilterSubmit(false)
              }}
            >
              <img src="/images/icons/ic-search-dark.png" alt="find" />
              <span>Tìm kiếm</span>
            </Button>
          </div>
          <div className="__action-group">
            {isCreatable && (
              <Button
                className="__action-btn"
                onClick={() => {
                  router.push('/unit-test/create-new-unittest')
                }}
              >
                <img src="/images/icons/ic-plus-white.png" alt="create" />
                <span>Tạo mới</span>
              </Button>
            )}
          </div>
        </div>
        <Collapse isOpened={isOpenFilterCollapse}>
          <div className="content__sub">
            <MultiSelectPicker
              className="__filter-box"
              data={GRADE_SELECTIONS}
              label="Khối lớp"
              triggerReset={triggerReset}
              onChange={handleGradeChange}
            />
            <InputWithLabel
              className="__filter-box"
              decimal={0}
              label="Thời gian"
              min={0}
              placeholder="Thời gian (phút)"
              triggerReset={triggerReset}
              type="number"
              onBlur={handleTimeChange}
              onKeyUp={handleTimeSubmit}
            />
            <InputWithLabel
              className="__filter-box"
              decimal={0}
              label="Số câu hỏi"
              min={0}
              triggerReset={triggerReset}
              type="number"
              onBlur={handleTotalQuestionChange}
              onKeyUp={handleTotalQuestionSubmit}
            />
            <MultiSelectPicker
              className="__filter-box"
              data={SKILLS_SELECTIONS}
              label="Kỹ năng"
              triggerReset={triggerReset}
              onChange={handleSkillChange}
            />
            <DateInput
              className="__filter-box"
              label="Ngày bắt đầu"
              triggerReset={triggerReset}
              onChange={handleStartDateChange}
            />
            <DateInput
              className="__filter-box"
              label="Ngày kết thúc"
              triggerReset={triggerReset}
              onChange={handleEndDateChange}
            />
            <SelectPicker
              className="__filter-box"
              data={[{ code: '', display: 'Tất cả' }, ...ACTIVE_STATUS]}
              label="Trạng thái"
              triggerReset={triggerReset}
              onChange={handleStatusChange}
            />
          </div>
        </Collapse>
      </div>
      {unitTestList.length > 0 || isLoading ? (
        <UnitTestTable
          currentPage={currentPage}
          data={unitTestList}
          isLoading={isLoading}
          onDelete={handleItemDelete}
        />
      ) : (
        <div
          className="o-question-drawer__empty"
          style={{ minHeight: '50vh', paddingTop: 32, paddingBottom: 32 }}
        >
          <img
            className="__banner"
            src={
              checkExistFilter()
                ? '/images/collections/clt-emty-result.png'
                : '/images/collections/clt-emty-template.png'
            }
            alt="banner"
          />
          <p className="__description">
            {checkExistFilter() ? (
              <>Không có kết quả nào được tìm thấy.</>
            ) : (
              <>
                Chưa có đề thi nào trong danh sách.
                <br />
                Vui lòng tạo mới để quản lý
              </>
            )}
          </p>
          {!checkExistFilter() && isCreatable && (
            <Button
              className="__submit"
              onClick={() =>
                router.push(
                  '/unit-test/[templateSlug]',
                  '/unit-test/create-new-unittest',
                )
              }
            >
              Tạo đề thi
            </Button>
          )}
        </div>
      )}
      {unitTestList.length > 0 && (
        <StickyFooter>
          <div className="__pagination">
            <Pagination
              prev
              next
              ellipsis
              size="md"
              total={totalPage * 10}
              maxButtons={10}
              limit={10}
              activePage={currentPage}
              onChangePage={(page: number) => handlePageChange(page)}
            />
          </div>
        </StickyFooter>
      )}
    </div>
  )
}
