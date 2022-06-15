import { useContext, useState } from 'react'

import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { Collapse } from 'react-collapse'
import { Button, Pagination } from 'rsuite'

import { templateListTransformData } from 'api/dataTransform'
import { callApi } from 'api/utils'
import { InputWithLabel } from 'components/atoms/inputWithLabel'
import { MultiSelectPicker } from 'components/atoms/selectPicker/multiSelectPicker'
import { BreadCrumbNav } from 'components/molecules/breadCrumbNav'
import { TemplateTable } from 'components/molecules/templateTable'
import { StickyFooter } from 'components/organisms/stickyFooter'
import { Wrapper } from 'components/templates/wrapper'
import { USER_ROLES } from 'interfaces/constants'
import { TemplateContext } from 'interfaces/contexts'
import { GRADE_SELECTIONS, SKILLS_SELECTIONS } from 'interfaces/struct'
import { userInRight } from 'utils'

export const Templates = () => {
  const router = useRouter()
  const [session] = useSession()
  const isImportable = userInRight([USER_ROLES.Operator], session)
  const isCreatable =
    router.query.m !== undefined || (!router.query.m && isImportable)

  const { breadcrumbData, templateData, totalPages, currentPage, isLoading } =
    useContext(TemplateContext)

  const [isOpenFilterCollapse, setIsOpenFilterCollapse] = useState(false)
  const [triggerReset, setTriggerReset] = useState(false)

  const [filterName, setFilterName] = useState('')
  const [filterGrade, setFilterGrade] = useState([] as any[])
  const [filterTime, setFilterTime] = useState('')
  const [filterTotalQuestion, setFilterTotalQuestion] = useState('')
  const [filterSkill, setFilterSkill] = useState([] as any[])

  const handleNameChange = (val: string) => setFilterName(val)
  const handleNameSubmit = (e: any, val: string) => {
    if (e.keyCode === 13) {
      handleSubmit(false, 1, { name: val })
      e.target.blur()
    }
  }
  const handleGradeChange = (val: any[]) => {
    setFilterGrade([...val])
    handleSubmit(false, 1, { level: [...val] })
  }
  const handleTimeChange = (val: string) => setFilterTime(val)
  const handleTimeSubmit = (e: any, val: string) => {
    if (e.keyCode === 13) {
      handleSubmit(false, 1, { time: val })
      e.target.blur()
    }
  }
  const handleTotalQuestionChange = (val: string) => setFilterTotalQuestion(val)
  const handleTotalQuestionSubmit = (e: any, val: string) => {
    if (e.keyCode === 13) {
      handleSubmit(false, 1, { totalQuestions: val })
      e.target.blur()
    }
  }
  const handleSkillChange = (val: any[]) => {
    setFilterSkill([...val])
    handleSubmit(false, 1, { skill: [...val] })
  }

  const filterBagde = [
    filterName ? true : false,
    filterGrade.length > 0,
    filterTime ? true : false,
    filterTotalQuestion ? true : false,
    filterSkill.length > 0,
  ].filter((item) => item === true).length

  const handleDelete = async (id: number) => {
    if (!id) return
    const response: any = await callApi(`/api/templates/${id}`, 'delete')
    if (response?.status === 200) {
      const currentData = templateData.state
      const newData = currentData.filter((item: any) => item?.id !== id)
      templateData.setState([...newData])
    }
  }

  const handleStatusToggle = async (id: number, boo: boolean) => {
    if (!id) return
    const response: any = await callApi(
      `/api/templates/${id}`,
      'put',
      'Token',
      {
        isQuickEdit: true,
        status: boo,
      },
    )
    if (response?.status === 200) {
      const currentData = templateData.state
      const findIndex = currentData.findIndex((item: any) => item?.id === id)
      if (findIndex === -1) return
      currentData[findIndex]['status'] = boo ? 1 : 0
      templateData.setState([...currentData])
    }
  }

  const handleSubmit = async (
    isReset: boolean,
    page: number,
    body: any = null,
  ) => {
    const scope = router.query?.m
      ? ['mine', 'teacher'].findIndex((item) => item === router.query.m)
      : null
    // collect data
    const data = !isReset
      ? {
          name: body?.name || filterName,
          level: body?.level || filterGrade,
          page: page - 1,
          skill: body?.skill || filterSkill,
          scope: (scope && scope !== -1) || scope === 0 ? scope + 1 : null,
          time: body?.time || filterTime,
          totalQuestions: body?.totalQuestions || filterTotalQuestion,
        }
      : { scope: (scope && scope !== -1) || scope === 0 ? scope + 1 : null }
    // send request
    const response: any = await callApi(
      '/api/templates/search',
      'post',
      'token',
      data,
    )
    if (response?.templates)
      templateData.setState([
        ...response.templates.map(templateListTransformData),
      ])
    currentPage.setState(page)
    if (response?.totalPages) totalPages.setState(response.totalPages)
  }

  return (
    <Wrapper
      className="p-create-new-template p-detail-format"
      pageTitle={
        router.query?.m
          ? router.query.m === 'mine'
            ? 'Cấu trúc của tôi'
            : 'Cấu trúc của giáo viên'
          : 'Cấu trúc của hệ thống'
      }
    >
      <div className="p-detail-format__breadcrumb">
        <BreadCrumbNav data={breadcrumbData} />
      </div>
      <div className="m-unittest-template-table-data">
        <div className="m-unittest-template-table-data__content">
          <div className="content__sup">
            <div className="__input-group">
              <InputWithLabel
                className="__search-box"
                label="Tên cấu trúc"
                placeholder="Tìm kiếm cấu trúc"
                triggerReset={triggerReset}
                type="text"
                onBlur={handleNameChange}
                onKeyUp={handleNameSubmit}
                icon={
                  <img src="/images/icons/ic-search-dark.png" alt="search" />
                }
              />
              <Button
                className="__sub-btn"
                data-active={isOpenFilterCollapse}
                onClick={() => setIsOpenFilterCollapse(!isOpenFilterCollapse)}
                style={{ marginLeft: '0.8rem' }}
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
                  handleSubmit(true, 1)
                }}
              >
                <img src="/images/icons/ic-reset-darker.png" alt="reset" />
                <span>Reset</span>
              </Button>
              <Button
                className="__main-btn"
                onClick={() => handleSubmit(false, 1)}
              >
                <img src="/images/icons/ic-search-dark.png" alt="find" />
                <span>Tìm kiếm</span>
              </Button>
            </div>
            <div className="__action-group">
              {isCreatable && (
                <Button
                  className="__action-btn"
                  onClick={() =>
                    router.push(
                      '/templates/[templateSlug]',
                      '/templates/create-new-template',
                    )
                  }
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
                style={{ flex: 'unset' }}
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
                style={{ flex: 'unset' }}
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
                style={{ flex: 'unset' }}
                onBlur={handleTotalQuestionChange}
                onKeyUp={handleTotalQuestionSubmit}
              />
              <MultiSelectPicker
                className="__filter-box"
                data={SKILLS_SELECTIONS}
                label="Kỹ năng"
                triggerReset={triggerReset}
                style={{ flex: 'unset' }}
                onChange={handleSkillChange}
              />
            </div>
          </Collapse>
        </div>
        {(templateData.state && templateData.state.length > 0) || isLoading ? (
          <TemplateTable
            currentPage={currentPage.state}
            data={templateData.state || []}
            isLoading={isLoading}
            onDelete={handleDelete}
            onStatusToggle={handleStatusToggle}
          />
        ) : (
          <div
            className="o-question-drawer__empty"
            style={{ minHeight: '50vh', paddingTop: 32, paddingBottom: 32 }}
          >
            <img
              className="__banner"
              src={
                filterBagde > 0
                  ? '/images/collections/clt-emty-result.png'
                  : '/images/collections/clt-emty-template.png'
              }
              alt="banner"
            />
            <p className="__description">
              {filterBagde > 0 ? (
                <>Không có kết quả nào được tìm thấy</>
              ) : (
                <>
                  Chưa có cấu trúc đề thi nào trong ngân hàng đề thi.
                  <br />
                  Vui lòng tạo mới để quản lý
                </>
              )}
            </p>
            {filterBagde <= 0 && (
              <Button
                className="__submit"
                onClick={() =>
                  router.push(
                    '/templates/[templateSlug]',
                    '/templates/create-new-template',
                  )
                }
              >
                Tạo cấu trúc
              </Button>
            )}
          </div>
        )}
        {templateData.state.length > 0 && (
          <StickyFooter>
            <div className="__pagination">
              <Pagination
                prev
                next
                ellipsis
                size="md"
                total={totalPages.state * 10}
                maxButtons={10}
                limit={10}
                activePage={currentPage.state}
                onChangePage={(page: number) => handleSubmit(false, page)}
              />
            </div>
          </StickyFooter>
        )}
      </div>
    </Wrapper>
  )
}
