import { ReactNode, useContext } from 'react'

import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { FaEye, FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { GoKebabVertical } from 'react-icons/go'
import {
  Button,
  toaster,
  Message,
  Pagination,
  Loader,
  Whisper,
  Tooltip,
  Popover,
} from 'rsuite'

import { paths } from 'api/paths'
import { StickyFooter } from 'components/organisms/stickyFooter'
import { USER_ROLES } from 'interfaces/constants'
import { QuestionContext, WrapperContext } from 'interfaces/contexts'
import {
  GRADE_SELECTIONS,
  LEVEL_SELECTIONS,
  PUBLISHER_SELECTIONS,
  SERIES_SELECTIONS,
  SKILLS_SELECTIONS,
  TASK_SELECTIONS,
} from 'interfaces/struct'
import { useQuestions } from 'lib/swr-hook'
import { userInRight } from 'utils'

import {
  DefaultPropsType,
  QuestionContextType,
  QuestionDataType,
} from '../../../interfaces/types'

interface Props extends DefaultPropsType {
  filterBagde?: number
}

export const QuestionTable = ({
  className = '',
  filterBagde = 0,
  style,
}: Props) => {
  const [session] = useSession()
  const user: any = session.user
  const router = useRouter()
  const pageSize = 10
  const { search, setSearch } = useContext<QuestionContextType>(QuestionContext)
  const { globalModal } = useContext(WrapperContext)
  const isOperator = userInRight([USER_ROLES.Operator], session)

  const { questions, totalRecords, isLoading, mutateQuestions } = useQuestions(
    search.page_index,
    pageSize,
    search,
    router.query.m === 'mine' || router.query.m === 'teacher',
  )

  const onDelete = async (question: QuestionDataType) => {
    globalModal.setState({
      id: 'confirm-modal',
      type: 'delete-question',
      content: {
        closeText: 'Quay lại',
        submitText: 'Xóa câu hỏi',
        onSubmit: async () => {
          const res = await fetch(`${paths.api_questions}/${question.id}`, {
            method: 'DELETE',
          })
          const json = await res.json()

          if (json) {
            toaster.push(
              <Message showIcon type="success">
                Xóa câu hỏi thành công
              </Message>,
            )
            if (questions.length >= 1) {
              mutateQuestions()
            } else {
              search.page_index > 0 &&
                setSearch({ ...search, page_index: search.page_index - 1 })
            }
          }
        },
      },
    })
  }

  return (
    <div>
      {questions && questions.length > 0 ? (
        <div className={`m-question-table ${className}`} style={style}>
          {isLoading && <Loader backdrop content="loading..." vertical />}
          <div className="__table">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  {/* <th>NXB</th> */}
                  {/* <th>Chương trình</th> */}
                  <th>Khối lớp</th>
                  <th>Kỹ năng</th>
                  {/* <th>Nhóm</th> */}
                  <th>Loại câu hỏi</th>
                  <th>Độ khó</th>
                  <th>Yêu cầu đề bài</th>
                  <th>Câu hỏi</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {questions &&
                  questions?.map((question, index) => {
                    const isEditable =
                      isOperator || question.created_by === user.id
                    return (
                      <tr key={`question_${index}`}>
                        <td>{index + 1}</td>
                        {/* <td
                          title={
                            PUBLISHER_SELECTIONS.find(
                              (m) => m.code === question.publisher,
                            )?.display
                          }
                        >
                          <div className="__elipsis">
                            {PUBLISHER_SELECTIONS.find(
                              (m) => m.code === question.publisher,
                            )?.display || '---'}
                          </div>
                        </td> */}
                        {/* <td
                          title={
                            SERIES_SELECTIONS.find(
                              (m) => m.code === question.series,
                            )?.display
                          }
                        >
                          <div className="__elipsis">
                            {SERIES_SELECTIONS.find(
                              (m) => m.code === question.series,
                            )?.display || '---'}
                          </div>
                        </td> */}
                        <td
                          title={
                            GRADE_SELECTIONS.find(
                              (m) => m.code === question.grade,
                            )?.display
                          }
                        >
                          <div className="__elipsis">
                            {GRADE_SELECTIONS.find(
                              (m) => m.code === question.grade,
                            )?.display || '---'}
                          </div>
                        </td>
                        <td
                          title={
                            SKILLS_SELECTIONS.find(
                              (m) => m.code === question.skills?.toString(),
                            )?.display
                          }
                        >
                          <div className="__elipsis">
                            {SKILLS_SELECTIONS.find(
                              (m) => m.code === question.skills?.toString(),
                            )?.display || '---'}
                          </div>
                        </td>
                        {/* <td title={question?.group}>
                          <div className="__elipsis">
                            {question?.group || '---'}
                          </div>
                        </td> */}
                        <td
                          title={
                            TASK_SELECTIONS.find(
                              (m) => m.code === question.question_type,
                            )?.display
                          }
                        >
                          <div className="__elipsis">
                            {TASK_SELECTIONS.find(
                              (m) => m.code === question.question_type,
                            )?.display || '---'}
                          </div>
                        </td>
                        <td
                          title={
                            LEVEL_SELECTIONS.find(
                              (m) => m.code === question.level,
                            )?.display
                          }
                        >
                          <div className="__elipsis">
                            {LEVEL_SELECTIONS.find(
                              (m) => m.code === question.level,
                            )?.display || '---'}
                          </div>
                        </td>
                        <td title={question?.question_description}>
                          <div className="__elipsis">
                            {question?.question_description || '---'}
                          </div>
                        </td>
                        <td title={question?.question_text}>
                          <div className="__elipsis">
                            {question?.question_text || '---'}
                          </div>
                        </td>
                        <td>
                          <div className="__action-group">
                            <Whisper
                              placement="leftStart"
                              trigger="click"
                              speaker={
                                <Popover>
                                  <div className="table-action-popover">
                                    {isEditable && (
                                      <div
                                        className="__item"
                                        onClick={() =>
                                          window.open(
                                            `/questions/${question.id}`,
                                          )
                                        }
                                      >
                                        <FaPencilAlt />
                                        <span>Chỉnh sửa</span>
                                      </div>
                                    )}
                                    <div
                                      className="__item"
                                      onClick={() =>
                                        window.open(
                                          `/questions/${question.id}?mode=view`,
                                        )
                                      }
                                    >
                                      <FaEye />
                                      <span>Xem</span>
                                    </div>
                                    {isEditable && (
                                      <div
                                        className="__item"
                                        onClick={onDelete.bind(null, question)}
                                      >
                                        <FaTrashAlt />
                                        <span>Xoá</span>
                                      </div>
                                    )}
                                  </div>
                                </Popover>
                              }
                            >
                              <Button className="__action-btn">
                                <GoKebabVertical color="#6262BC" />
                              </Button>
                            </Whisper>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                {questions && questions.length === 0 && (
                  <tr>
                    <td colSpan={8}>Không có dữ liệu</td>
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
                : '/images/collections/clt-emty-question.png'
            }
            alt="banner"
          />
          <p className="__description">
            {filterBagde > 0 ? (
              <>Không có kết quả nào được tìm thấy</>
            ) : (
              <>
                Chưa có câu hỏi đề thi nào trong ngân hàng câu hỏi.
                <br />
                Vui lòng tạo mới để quản lý
              </>
            )}
          </p>
          {filterBagde <= 0 && (
            <Button
              className="__submit"
              onClick={() =>
                router.push('/questions/[questionSlug]', '/questions/-1')
              }
            >
              Tạo câu hỏi
            </Button>
          )}
        </div>
      )}
      {questions?.length > 0 && (
        <StickyFooter>
          <div className="__pagination">
            <Pagination
              prev
              next
              ellipsis
              size="md"
              total={totalRecords}
              maxButtons={10}
              limit={pageSize}
              activePage={search.page_index + 1}
              onChangePage={(page) => {
                setSearch({ ...search, page_index: page - 1 })
              }}
            />
          </div>
        </StickyFooter>
      )}
    </div>
  )
}

interface ActionBtnProps {
  tooltip?: string
  onClick?: (e: any) => void
  children?: ReactNode
}

const ActionBtn = ({ tooltip, onClick, children }: ActionBtnProps) => {
  return (
    <Whisper
      placement="bottom"
      trigger="hover"
      speaker={<Tooltip className="action-table-tooltip">{tooltip}</Tooltip>}
    >
      <Button className="__action-btn" onClick={onClick}>
        {children}
      </Button>
    </Whisper>
  )
}
