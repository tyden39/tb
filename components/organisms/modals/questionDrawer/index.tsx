import { useContext, useState, useEffect } from 'react'

import { useRouter } from 'next/router'
import { Collapse } from 'react-collapse'
import { Button, Drawer, Pagination } from 'rsuite'

import { callApi } from 'api/utils'
import { CheckBox } from 'components/atoms/checkbox'
import { InputWithLabel } from 'components/atoms/inputWithLabel'
import { MultiSelectPicker } from 'components/atoms/selectPicker/multiSelectPicker'
import { SingleTemplateContext, WrapperContext } from 'interfaces/contexts'
import {
  CERF_SELECTIONS,
  FORMAT_SELECTIONS,
  LEVEL_SELECTIONS,
  PUBLISHER_SELECTIONS,
  QUESTION_CREATED_BY,
  SKILLS_SELECTIONS,
  TASK_SELECTIONS,
  TEST_TYPE_SELECTIONS,
  TYPES_SELECTIONS,
} from 'interfaces/struct'

import { DefaultPropsType, StructType } from '../../../../interfaces/types'
import { FilterSelect } from '../../../atoms/filterSelect/index'
import { FilterQuestionTable } from '../../../molecules/filterQuesionTable/index'

interface Props extends DefaultPropsType {
  isActive: boolean
}

export const QuestionDrawer = ({ className = '', isActive, style }: Props) => {
  const router = useRouter()

  const { globalModal }: any = useContext(WrapperContext)
  const { chosenTemplate } = useContext(SingleTemplateContext)

  const disabled = globalModal.state?.content?.isDisabled || false
  const grade = globalModal.state?.content?.grade
  const skill = globalModal.state?.content?.skill
  const defaultTotalPage = globalModal.state?.content?.data?.totalPage || 1
  const totalQuestion = globalModal.state?.content?.totalQuestion || 0
  const defaultChosenQuestions =
    globalModal.state?.content?.chosenQuestions || []
  const currentSectionId = globalModal.state?.content?.id || null

  const handleSubmit = () =>
    globalModal.state?.content?.onSubmit(skill, chosenList)

  // data
  const defaultQuestionList = globalModal.state?.content?.data?.data || []
  const [questionList, setQuestionList] = useState(
    defaultQuestionList || ([] as any[]),
  )
  const [chosenList, setChosenList] = useState(defaultChosenQuestions as any[])
  // display
  const [isOpenFilterCollapse, setIsOpenFilterCollapse] = useState(false)
  const [triggerReset, setTriggerReset] = useState(false)
  // filter
  const [filterName, setFilterName] = useState('')
  const [filterSkill, setFilterSkill] = useState([] as any[])
  const [filterCreatedBy, setFilterCreatedBy] = useState([] as any[])
  const [filterQuestionType, setFilterQuestionType] = useState([] as any[])
  const [filterLevel, setFilterLevel] = useState([] as any[])
  const [filterCEFR, setFilterCEFR] = useState([] as any[])
  const [filterPublisher, setFilterPublisher] = useState([] as any[])
  const [filterFormat, setFilterFormat] = useState([] as any[])
  const [filterTestType, setFilterTestType] = useState([] as any[])
  const [filterType, setFilterType] = useState([] as any[])
  const [isOnly, setIsOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(defaultTotalPage)

  const [isFilter, setIsFilter] = useState(false)

  let totalChosenSentence = 0
  if (chosenList) {
    chosenList.forEach((item) => {
      if (item?.total_question) totalChosenSentence += item.total_question
    })
  }

  const [filterBadge, setFilterBadge] = useState(0)

  const checkFilterBadge = () => {
    const length = [
      filterName,
      filterSkill.length > 0,
      filterCreatedBy.length > 0,
      filterQuestionType.length > 0,
      filterLevel.length > 0,
      filterCEFR.length > 0,
      filterPublisher.length > 0,
      filterFormat.length > 0,
      filterTestType.length > 0,
      filterType.length > 0,
    ].filter((item) => item === true).length
    setFilterBadge(length)
  }

  const checkExistFilter = () =>
    (filterName ||
      filterSkill.length > 0 ||
      filterCreatedBy.length > 0 ||
      filterQuestionType.length > 0 ||
      filterLevel.length > 0 ||
      filterCEFR.length > 0 ||
      filterPublisher.length > 0 ||
      filterFormat.length > 0 ||
      filterTestType.length > 0 ||
      filterType.length > 0 ||
      isOnly) &&
    isFilter
      ? true
      : false

  const collectData = (
    isReset: boolean,
    isFromChecked = false,
    page: number,
    sid: number[] = [],
    body: any = null,
  ) => {
    const collection: any = {
      grade,
      page: page,
      skills: filterSkill.length > 0 ? filterSkill : skill,
      sid: sid,
    }
    if (body?.skills) collection['skills'] = body.skills
    if (isFromChecked ? !isOnly : isOnly)
      collection['id'] =
        chosenList.length > 0 ? chosenList.map((item) => item?.id) : [-1]
    if (!isReset) {
      if (filterName || body?.name)
        collection['search'] = body?.name || filterName
      if (
        (filterCreatedBy && filterCreatedBy.length > 0) ||
        (body?.scope && body.scope.length > 0)
      )
        collection['scope'] = body?.scope || filterCreatedBy
      if (
        (filterQuestionType && filterQuestionType.length > 0) ||
        (body?.questionType && body.questionType.length > 0)
      )
        collection['question_type'] = body?.questionType || filterQuestionType
      if (
        (filterLevel && filterLevel.length > 0) ||
        (body?.level && body.level.length > 0)
      )
        collection['level'] = body?.level || filterLevel
      if (
        (filterCEFR && filterCEFR.length > 0) ||
        (body?.cerf && body.cerf.length > 0)
      )
        collection['cerf'] = body?.cerf || filterCEFR
      if (
        (filterPublisher && filterPublisher.length > 0) ||
        (body?.publisher && body.publisher.length > 0)
      )
        collection['publisher'] = body?.publisher || filterPublisher
      if (
        (filterFormat && filterFormat.length > 0) ||
        (body?.format && body.format.length > 0)
      )
        collection['format'] = body?.format || filterFormat
      if (
        (filterTestType && filterTestType.length > 0) ||
        (body?.testType && body.testType.length > 0)
      )
        collection['test_type'] = body?.testType || filterTestType
      if (
        (filterType && filterType.length > 0) ||
        (body?.types && body.types.length > 0)
      )
        collection['types'] = body?.types || filterType
    }
    return collection
  }

  const handleNameChange = (val: string) => setFilterName(val)
  const handleNameSubmit = (e: any, val: string) => {
    if (e.keyCode === 13) {
      handleSearchSubmit(false, false, 1, { name: val })
      e.target.blur()
    }
  }
  const handleSkillChange = (val: any[]) => {
    setFilterSkill([...val])
    handleSearchSubmit(false, false, 1, { skills: [...val] })
  }
  const handleCreatedByChange = (val: any[]) => {
    setFilterCreatedBy([...val])
    handleSearchSubmit(false, false, 1, { scope: [...val] })
  }
  const handleQuestionTypeChange = (val: any[]) => {
    setFilterQuestionType([...val])
    handleSearchSubmit(false, false, 1, { questionType: [...val] })
  }
  const handleLevelChange = (val: any[]) => {
    setFilterLevel([...val])
    handleSearchSubmit(false, false, 1, { level: [...val] })
  }
  const handleCEFRChange = (val: any[]) => {
    setFilterCEFR([...val])
    handleSearchSubmit(false, false, 1, { cerf: [...val] })
  }
  const handlePublisherChange = (val: any[]) => {
    setFilterPublisher([...val])
    handleSearchSubmit(false, false, 1, { publisher: [...val] })
  }
  const handleFormatChange = (val: any[]) => {
    setFilterFormat([...val])
    handleSearchSubmit(false, false, 1, { format: [...val] })
  }
  const handleTestTypeChange = (val: any[]) => {
    setFilterTestType([...val])
    handleSearchSubmit(false, false, 1, { testType: [...val] })
  }
  const handleTypeChange = (val: any[]) => {
    setFilterType([...val])
    handleSearchSubmit(false, false, 1, { types: [...val] })
  }

  const handleIsOnlyChange = async () => {
    setIsOnly(!isOnly)
    await handleSearchSubmit(false, true, 1)
  }

  const handleChooseRecord = (id: number) => {
    const currentChosenList = [...chosenList]
    const chosenItem = questionList.find((item: any) => item?.id === id)
    const findItem = currentChosenList.find((item: any) => item?.id === id)
    if (findItem)
      setChosenList([
        ...currentChosenList.filter((item: any) => item?.id !== id),
      ])
    else {
      if (chosenItem.deleted === 0) {
        setChosenList([...currentChosenList, chosenItem])
      }
    }
  }

  const handlePageChange = async (page: number) =>
    await handleSearchSubmit(false, false, page)

  const handleResetFilter = () => {
    setTriggerReset(!triggerReset)
    setFilterBadge(0)
    setQuestionList([...defaultQuestionList])
    setTotalPage(defaultTotalPage)
    setCurrentPage(1)
  }

  const handleSearchSubmit = async (
    isReset: boolean,
    isFromChecked = false,
    page: number,
    customData: any = null,
  ) => {
    const body = collectData(
      isReset,
      isFromChecked,
      page - 1,
      chosenList.map((m) => m.id),
      customData,
    )
    setIsFilter(!isReset)
    const otherQuestions = [] as any[]
    chosenTemplate.state.sections.forEach((section: any) => {
      if (
        section?.id !== currentSectionId &&
        section?.parts &&
        section.parts[0]?.questions &&
        section.parts[0].questions.length > 0
      ) {
        section.parts[0].questions.forEach((question: any) => {
          otherQuestions.push(question?.id)
        })
      }
    })
    const response: any = await callApi(
      '/api/questions/search',
      'post',
      'Token',
      { ...body, excludeId: otherQuestions.length > 0 ? otherQuestions : null },
    )
    if (response) {
      if (response?.data) {
        setQuestionList([...response.data])
        setCurrentPage(page)
        setTotalPage(response?.totalPage || 1)
      }
    }
  }

  useEffect(() => {
    if (disabled) handleIsOnlyChange()
  }, [])

  useEffect(
    () => checkFilterBadge(),
    [
      filterName,
      filterSkill,
      filterCreatedBy,
      filterQuestionType,
      filterLevel,
      filterCEFR,
      filterPublisher,
      filterFormat,
      filterTestType,
      filterType,
      isOnly,
    ],
  )

  return (
    <Drawer
      className={`o-question-drawer ${className}`}
      full
      placement="bottom"
      open={isActive}
      style={style}
      onClose={() => globalModal.setState(null)}
    >
      <Drawer.Body>
        <Button
          className="o-question-drawer__toggle"
          onClick={() => globalModal.setState(null)}
        >
          <img src="/images/icons/ic-close-darker.png" alt="close" />
        </Button>
        <div className="o-question-drawer__header">
          <h5 className="o-question-drawer__title">Ch???n c??u h???i</h5>
        </div>
        <div className="o-question-drawer__body">
          <div className="o-question-drawer__filter">
            <div className="__upper">
              <div className="__input-group">
                <InputWithLabel
                  className="__search-box"
                  label="T??m ki???m"
                  placeholder="T??m ki???m n???i dung / m?? t??? / nh??m"
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
                >
                  <div
                    className="__badge"
                    data-value={filterBadge}
                    data-hidden={filterBadge <= 0}
                  >
                    <img src="/images/icons/ic-filter-dark.png" alt="filter" />
                  </div>
                  <span>L???c</span>
                </Button>
                <Button
                  className="__sub-btn"
                  onClick={() => handleResetFilter()}
                >
                  <img src="/images/icons/ic-reset-darker.png" alt="reset" />
                  <span>Reset</span>
                </Button>
                <Button
                  className="__main-btn"
                  onClick={() => handleSearchSubmit(false, false, 1)}
                >
                  <img src="/images/icons/ic-search-dark.png" alt="find" />
                  <span>T??m ki???m</span>
                </Button>
              </div>
              <div className="__action-group">
                {!disabled && (
                  <Button
                    className="__action-btn"
                    onClick={() => window.open('/questions/-1')}
                  >
                    <img src="/images/icons/ic-plus-white.png" alt="create" />
                    <span>T???o c??u h???i</span>
                  </Button>
                )}
              </div>
            </div>
            <Collapse isOpened={isOpenFilterCollapse}>
              <div className="__below">
                <MultiSelectPicker
                  className="__filter-box"
                  data={QUESTION_CREATED_BY}
                  label="Ng?????i t???o"
                  menuSize="lg"
                  triggerReset={triggerReset}
                  onChange={handleCreatedByChange}
                />
                <MultiSelectPicker
                  className="__filter-box"
                  data={TASK_SELECTIONS}
                  label="Lo???i c??u h???i"
                  menuSize="xl"
                  triggerReset={triggerReset}
                  onChange={handleQuestionTypeChange}
                />
                <MultiSelectPicker
                  className="__filter-box"
                  data={LEVEL_SELECTIONS}
                  label="????? kh??"
                  menuSize="lg"
                  triggerReset={triggerReset}
                  onChange={handleLevelChange}
                />
                <MultiSelectPicker
                  className="__filter-box"
                  data={SKILLS_SELECTIONS.filter((item: StructType) =>
                    skill.includes(item.code),
                  )}
                  label="K??? n??ng"
                  menuSize="lg"
                  triggerReset={triggerReset}
                  onChange={handleSkillChange}
                />
                <MultiSelectPicker
                  className="__filter-box"
                  data={CERF_SELECTIONS}
                  label="CEFR"
                  menuSize="xl"
                  triggerReset={triggerReset}
                  onChange={handleCEFRChange}
                />
                <MultiSelectPicker
                  className="__filter-box"
                  data={PUBLISHER_SELECTIONS}
                  label="Nh?? xu???t b???n"
                  triggerReset={triggerReset}
                  onChange={handlePublisherChange}
                />
                <MultiSelectPicker
                  className="__filter-box"
                  data={FORMAT_SELECTIONS}
                  label="Ti??u chu???n"
                  triggerReset={triggerReset}
                  onChange={handleFormatChange}
                />
                <MultiSelectPicker
                  className="__filter-box"
                  data={TEST_TYPE_SELECTIONS}
                  label="Ch????ng tr??nh"
                  triggerReset={triggerReset}
                  onChange={handleTestTypeChange}
                />
                <MultiSelectPicker
                  className="__filter-box"
                  data={TYPES_SELECTIONS}
                  label="K??? thi"
                  menuSize="lg"
                  placement="bottomEnd"
                  triggerReset={triggerReset}
                  onChange={handleTypeChange}
                />
              </div>
            </Collapse>
            <div className="__ps">
              <CheckBox
                className="__checkbox"
                checked={isOnly}
                onChange={handleIsOnlyChange}
              />
              <span>
                Ch??? hi???n th??? nh??ng c??u h???i ???? ch???n
                {totalChosenSentence > 0 && (
                  <b style={{ color: '#35b9e5' }}>
                    {' '}
                    ({totalChosenSentence} c??u)
                  </b>
                )}
              </span>
            </div>
          </div>
          {questionList.length > 0 ? (
            <div className="o-question-drawer__table">
              <div className="__table">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>STT</th>
                      <th>NXB</th>
                      <th>TI??U CHU???N</th>
                      <th>CH????NG TR??NH</th>
                      <th>????? KH??</th>
                      <th>K??? N??NG</th>
                      <th>CEFR</th>
                      <th>NH??M</th>
                      <th>K??? THI</th>
                      <th>LO???I C??U H???I</th>
                      <th>S??? L?????NG</th>
                      <th>H?????NG D???N</th>
                      <th>C??U H???I</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionList.map((item: any, i: number) => (
                      <tr
                        key={item.id}
                        onClick={() =>
                          !disabled &&
                          ((totalQuestion &&
                            totalQuestion > totalChosenSentence) ||
                            chosenList.find(
                              (chosenItem: any) => chosenItem.id === item.id,
                            )) &&
                          handleChooseRecord(item.id)
                        }
                        className={item.deleted ? 'deleted' : ''}
                      >
                        <td style={{ height: '5.6rem' }}>
                          <div
                            style={{
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CheckBox
                              checked={
                                chosenList.find(
                                  (chosenItem: any) =>
                                    chosenItem.id === item.id,
                                )
                                  ? true
                                  : false
                              }
                              disabled={
                                disabled ||
                                ((!totalQuestion ||
                                  totalQuestion <= totalChosenSentence) &&
                                  !chosenList.find(
                                    (chosenItem: any) =>
                                      chosenItem.id === item.id,
                                  ))
                                  ? true
                                  : false
                              }
                              onChange={() => handleChooseRecord(item.id)}
                            />
                          </div>
                        </td>
                        <td style={{ height: '5.6rem' }}>
                          {i + 1 + (currentPage - 1) * 10}
                        </td>
                        <td
                          title={
                            PUBLISHER_SELECTIONS.find(
                              (find: StructType) =>
                                find.code === item?.publisher,
                            )?.display
                          }
                          style={{ height: '5.6rem' }}
                        >
                          <div className="__elipsis">
                            {PUBLISHER_SELECTIONS.find(
                              (find: StructType) =>
                                find.code === item?.publisher,
                            )?.display || '---'}
                          </div>
                        </td>
                        <td
                          title={
                            FORMAT_SELECTIONS.find(
                              (find: StructType) => find.code === item?.format,
                            )?.display
                          }
                          style={{ height: '5.6rem' }}
                        >
                          <div className="__elipsis">
                            {FORMAT_SELECTIONS.find(
                              (find: StructType) => find.code === item?.format,
                            )?.display || '---'}
                          </div>
                        </td>
                        <td
                          title={
                            TEST_TYPE_SELECTIONS.find(
                              (find: StructType) =>
                                find.code === item?.test_type,
                            )?.display
                          }
                          style={{ height: '5.6rem' }}
                        >
                          <div className="__elipsis">
                            {TEST_TYPE_SELECTIONS.find(
                              (find: StructType) =>
                                find.code === item?.test_type,
                            )?.display || '---'}
                          </div>
                        </td>
                        <td
                          title={
                            LEVEL_SELECTIONS.find(
                              (find: StructType) => find.code === item?.level,
                            )?.display
                          }
                          style={{ height: '5.6rem' }}
                        >
                          <div className="__elipsis">
                            {LEVEL_SELECTIONS.find(
                              (find: StructType) => find.code === item?.level,
                            )?.display || '---'}
                          </div>
                        </td>
                        <td
                          title={
                            SKILLS_SELECTIONS.find(
                              (find: StructType) => find.code === item?.skills,
                            )?.display
                          }
                          style={{ height: '5.6rem' }}
                        >
                          <div className="__elipsis">
                            {SKILLS_SELECTIONS.find(
                              (find: StructType) => find.code === item?.skills,
                            )?.display || '---'}
                          </div>
                        </td>
                        <td
                          title={
                            CERF_SELECTIONS.find(
                              (find: StructType) => find.code === item?.cerf,
                            )?.display
                          }
                          style={{ height: '5.6rem' }}
                        >
                          <div className="__elipsis">
                            {CERF_SELECTIONS.find(
                              (find: StructType) => find.code === item?.cerf,
                            )?.display || '---'}
                          </div>
                        </td>
                        <td title={item?.group} style={{ height: '5.6rem' }}>
                          <div className="__elipsis">
                            {item?.group || '---'}
                          </div>
                        </td>
                        <td
                          title={
                            TYPES_SELECTIONS.find(
                              (find: StructType) => find.code === item?.types,
                            )?.display
                          }
                          style={{ height: '5.6rem' }}
                        >
                          <div className="__elipsis">
                            {TYPES_SELECTIONS.find(
                              (find: StructType) => find.code === item?.types,
                            )?.display || '---'}
                          </div>
                        </td>
                        <td
                          title={
                            TASK_SELECTIONS.find(
                              (find: StructType) =>
                                find.code === item?.question_type,
                            )?.display
                          }
                          style={{ height: '5.6rem' }}
                        >
                          <div className="__elipsis">
                            {TASK_SELECTIONS.find(
                              (find: StructType) =>
                                find.code === item?.question_type,
                            )?.display || '---'}
                          </div>
                        </td>
                        <td
                          title={item?.total_question}
                          style={{ height: '5.6rem' }}
                        >
                          <div className="__elipsis">
                            {item?.total_question || '---'}
                          </div>
                        </td>
                        <td
                          title={item?.question_description}
                          style={{ height: '5.6rem' }}
                        >
                          <div className="__elipsis">
                            {item?.question_description || '---'}
                          </div>
                        </td>
                        <td
                          title={item?.question_text}
                          style={{ height: '5.6rem' }}
                        >
                          <div className="__elipsis">
                            {item?.question_text || '---'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="o-question-drawer__empty">
              <img
                className="__banner"
                src={
                  checkExistFilter()
                    ? '/images/collections/clt-emty-result.png'
                    : '/images/collections/clt-emty-question.png'
                }
                alt="banner"
              />
              <p className="__description">
                {checkExistFilter() ? (
                  <>Kh??ng c?? k???t qu??? n??o ???????c t??m th???y.</>
                ) : (
                  <>
                    Ch??a c?? c??u h???i n??o trong danh s??ch.
                    <br />
                    Vui l??ng t???o c??u h???i m???i
                  </>
                )}
              </p>
              {!checkExistFilter() && (
                <Button
                  className="__submit"
                  onClick={() => window.open('/questions/-1')}
                >
                  T???o c??u h???i m???i
                </Button>
              )}
            </div>
          )}
        </div>
        {questionList.length > 0 && (
          <div className="o-question-drawer__footer">
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
            <div className="__submit">
              <Button
                className="__primary"
                disabled={
                  !totalQuestion || totalQuestion !== totalChosenSentence
                    ? true
                    : false
                }
                onClick={handleSubmit}
              >
                L??u
              </Button>
            </div>
          </div>
        )}
      </Drawer.Body>
    </Drawer>
  )
}
