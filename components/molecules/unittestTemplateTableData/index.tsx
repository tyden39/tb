import { useContext, useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/router'
import { Collapse } from 'react-collapse'
import { Button, Pagination } from 'rsuite'

import {
  templateDetailTransform,
  templateListTransformData,
} from 'api/dataTransform'
import { InputWithLabel } from 'components/atoms/inputWithLabel'
import { MultiSelectPicker } from 'components/atoms/selectPicker/multiSelectPicker'
import { StickyFooter } from 'components/organisms/stickyFooter'
import { SingleTemplateContext } from 'interfaces/contexts'
import {
  GRADE_SELECTIONS,
  SKILLS_SELECTIONS,
  TEMPLATE_CREATED_BY,
} from 'interfaces/struct'

import { paths } from '../../../api/paths'
import { callApi } from '../../../api/utils'
import { DefaultPropsType } from '../../../interfaces/types'
import { RowItem } from './RowItem'

interface PropsType extends DefaultPropsType {
  title: string
  data: any[]
  total: number
  pageIndex: number
  nextStep?: () => void
}

export const UnittestTemplateTableData = ({
  className = '',
  data,
  total,
  pageIndex,
  style,
  nextStep = () => null,
}: PropsType) => {
  const router = useRouter()

  const contextData = useContext(SingleTemplateContext)

  const chosenTemplate = contextData?.chosenTemplate

  // data
  const [tableData, setTableData] = useState(data)
  // filter
  const [filterLevel, setFilterLevel] = useState([] as any[])
  const [filterCreatedBy, setFilterCreatedBy] = useState([] as any[])
  const [filterName, setFilterName] = useState('')
  const [filterSkill, setFilterSkill] = useState([] as any[])
  const [filterTime, setFilterTime] = useState('')
  const [filterTotalQuestions, setFilterTotalQuestions] = useState('')
  // pagination
  const [activePage, setActivePage] = useState(pageIndex)
  const [totalPage, setTotalPage] = useState(total)
  // view
  const [triggerReset, setTriggerReset] = useState(false)
  const [isOpenFilterCollapse, setIsOpenFilterCollapse] = useState(false)

  const submitBtn = useRef<HTMLButtonElement>(null)

  const filterBagde = [
    filterName ? true : false,
    filterLevel.length > 0,
    filterTime ? true : false,
    filterTotalQuestions ? true : false,
    filterSkill.length > 0,
  ].filter((item) => item === true).length

  const handlePageChange = (page: number) => handleSubmit(page)
  const handleCreatedByChange = (val: any[]) => {
    setFilterCreatedBy([...val])
    handleSubmit(1, { scope: [...val] })
  }
  const handleLevelChange = (val: any[]) => {
    setFilterLevel(val)
    handleSubmit(1, { level: [...val] })
  }
  const handleNameChange = (val: string) => setFilterName(val)
  const handleNameSubmit = (e: any, val: string) => {
    if (e.keyCode === 13) {
      handleSubmit(1, { name: val })
      e.target.blur()
    }
  }
  const handleSkillChange = (val: any[]) => {
    setFilterSkill(val)
    handleSubmit(1, { skill: [...val] })
  }
  const handleTimeChange = (val: string) => setFilterTime(val)
  const handleTimeSubmit = (e: any, val: string) => {
    if (e.keyCode === 13) {
      handleSubmit(1, { time: val })
      e.target.blur()
    }
  }
  const handleTotalQuestionsChange = (val: string) =>
    setFilterTotalQuestions(val)
  const handleTotalQuestionsSubmit = (e: any, val: string) => {
    if (e.keyCode === 13) {
      handleSubmit(1, { totalQuestions: val })
      e.target.blur()
    }
  }

  const handleNext = async () => {
    if (!chosenTemplate.state?.id) return
    const response: any = await callApi(
      `/api/templates/${chosenTemplate.state.id}`,
      'get',
    )
    const data = response?.data ? templateDetailTransform(response.data) : null
    if (data) {
      chosenTemplate.setState({
        ...data,
        date: [null, null],
      })
      nextStep()
    }
  }

  const handleReset = () => {
    setTriggerReset(!triggerReset)
    setTimeout(() => {
      if (submitBtn?.current) submitBtn.current.click()
    }, 0)
  }

  const handleSubmit = async (page = 1, body: any = null) => {
    // collect data
    const data = {
      name: body?.name || filterName,
      level: body?.level && body.level.length > 0 ? body.level : filterLevel,
      page: page - 1,
      skill: body?.skill && body.skill.length > 0 ? body.skil : filterSkill,
      time: body?.time || filterTime,
      totalQuestions: body?.totalQuestions || filterTotalQuestions,
      scope: 3,
    }
    // send request
    const response: any = await callApi(
      paths.api_templates_search,
      'post',
      'token',
      data,
    )
    // check
    if (response) {
      setActivePage(page)
      setTotalPage(response?.totalPages || 1)
      setTableData(
        response?.templates
          ? response.templates.map(templateListTransformData)
          : [],
      )
    }
  }

  useEffect(() => {
    setTotalPage(total)
  }, [total])

  return (
    <div
      className={`m-unittest-template-table-data ${className}`}
      style={style}
    >
      <div className="m-unittest-template-table-data__content">
        <div className="content__sup" style={{ justifyContent: 'flex-start' }}>
          <InputWithLabel
            className="searchbox"
            label="T??n c???u tr??c"
            placeholder="T??m ki???m c???u tr??c"
            triggerReset={triggerReset}
            type="text"
            style={{ width: '45rem', flex: 'unset', zIndex: 6 }}
            onBlur={handleNameChange}
            onKeyUp={handleNameSubmit}
            icon={<img src="/images/icons/ic-search-dark.png" alt="search" />}
          />
          <Button
            className="__sub-btn"
            data-active={isOpenFilterCollapse}
            style={{ marginBottom: '1.6rem' }}
            onClick={() => setIsOpenFilterCollapse(!isOpenFilterCollapse)}
          >
            <div
              className="__badge"
              data-value={filterBagde}
              data-hidden={filterBagde <= 0}
            >
              <img src="/images/icons/ic-filter-dark.png" alt="filter" />
            </div>
            <span>L???c</span>
          </Button>
          <Button className="reset-btn" onClick={handleReset}>
            <img src="/images/icons/ic-reset-darker.png" alt="reset" />
            <span>Reset</span>
          </Button>
          <Button
            ref={submitBtn}
            className="submit-btn"
            onClick={() => handleSubmit()}
          >
            <img src="/images/icons/ic-search-dark.png" alt="search" />
            <span>T??m ki???m</span>
          </Button>
        </div>
        <Collapse isOpened={isOpenFilterCollapse}>
          <div
            className="content__sub"
            style={{ marginTop: 0, marginBottom: '1.6rem' }}
          >
            <MultiSelectPicker
              className="__filter-box"
              data={TEMPLATE_CREATED_BY}
              label="Ng?????i t???o"
              menuSize="lg"
              triggerReset={triggerReset}
              style={{ width: 'calc(20% - 0.8rem)', flex: 'unset', zIndex: 5 }}
              onChange={handleCreatedByChange}
            />
            <MultiSelectPicker
              className="__filter-box"
              data={GRADE_SELECTIONS}
              label="Kh???i l???p"
              triggerReset={triggerReset}
              style={{ width: 'calc(20% - 0.8rem)', flex: 'unset', zIndex: 4 }}
              onChange={handleLevelChange}
            />
            <InputWithLabel
              className="__filter-box"
              label="Th???i gian"
              placeholder="Th???i gian (ph??t)"
              triggerReset={triggerReset}
              type="number"
              style={{ width: 'calc(20% - 0.8rem)', flex: 'unset', zIndex: 3 }}
              onBlur={handleTimeChange}
              onKeyUp={handleTimeSubmit}
            />
            <InputWithLabel
              className="__filter-box"
              label="S??? c??u h???i"
              triggerReset={triggerReset}
              type="number"
              style={{ width: 'calc(20% - 0.8rem)', flex: 'unset', zIndex: 2 }}
              onBlur={handleTotalQuestionsChange}
              onKeyUp={handleTotalQuestionsSubmit}
            />
            <MultiSelectPicker
              className="__filter-box"
              data={SKILLS_SELECTIONS}
              label="K??? n??ng"
              menuSize="lg"
              triggerReset={triggerReset}
              style={{ width: 'calc(20% - 0.8rem)', flex: 'unset', zIndex: 1 }}
              onChange={handleSkillChange}
            />
          </div>
        </Collapse>
      </div>
      {tableData.length > 0 ? (
        <div className="m-unittest-template-table-data__container">
          <div className="__table">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '4.5rem' }}></th>
                  <th style={{ width: '4.5rem', padding: 0 }}>STT</th>
                  <th
                    style={{
                      width: 'calc(60% - 9rem)',
                      textAlign: 'left',
                    }}
                  >
                    T??n c???u tr??c
                  </th>
                  <th style={{ width: '10%' }}>Kh???i l???p</th>
                  <th style={{ width: '10%' }}>Th???i gian</th>
                  <th style={{ width: '10%' }}>S??? c??u h???i</th>
                  <th style={{ width: '10%' }}>S??? k??? n??ng</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((tr, i) => (
                    <RowItem
                      key={tr.id}
                      index={i}
                      activePage={activePage}
                      data={tr}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center' }}>
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
              <>Kh??ng c?? k???t qu??? n??o ???????c t??m th???y</>
            ) : (
              <>
                Ch??a c?? c???u tr??c ????? thi n??o trong ng??n h??ng ????? thi.
                <br />
                Vui l??ng t???o m???i ????? qu???n l??
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
              T???o c???u tr??c
            </Button>
          )}
        </div>
      )}
      {}
      <StickyFooter
        containerStyle={{ width: '100%', justifyContent: 'space-between' }}
      >
        <div
          className="m-unittest-template-table-data__ending"
          style={{ width: '100%' }}
        >
          <div className="__pagination">
            {tableData.length > 0 && (
              <Pagination
                prev
                next
                ellipsis
                size="md"
                total={totalPage * 10}
                maxButtons={10}
                limit={10}
                activePage={activePage}
                onChangePage={handlePageChange}
              />
            )}
          </div>
          <div className="__direction">
            <Button
              className="__sub-primary"
              onClick={() => {
                chosenTemplate.setState({
                  id: null,
                  date: [null, null],
                  name: '',
                  point: null,
                  sections: [],
                  templateLevelId: '',
                  time: null,
                  totalQuestion: null,
                })
                nextStep()
              }}
            >
              <span>D??ng c???u tr??c m???i</span>
            </Button>
            <Button
              className="__primary"
              disabled={chosenTemplate.state?.id ? false : true}
              onClick={chosenTemplate.state?.id && handleNext}
            >
              <span>Ti???p theo</span>
              <img src="/images/icons/ic-arrow-left-active.png" alt="arrow" />
            </Button>
          </div>
        </div>
      </StickyFooter>
    </div>
  )
}
