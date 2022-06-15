import { useContext } from 'react'

import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { FaEye, FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { GoKebabVertical } from 'react-icons/go'
import { Whisper, Popover, Button, Toggle, Loader } from 'rsuite'

import { USER_ROLES } from 'interfaces/constants'
import { WrapperContext } from 'interfaces/contexts'
import { GRADE_SELECTIONS, SKILLS_SELECTIONS } from 'interfaces/struct'
import { DefaultPropsType, StructType } from 'interfaces/types'
import { userInRight } from 'utils'

interface Props extends DefaultPropsType {
  currentPage: number
  data: any[]
  isLoading?: boolean
  onDelete?: (id: number) => void
  onStatusToggle?: (id: number, boo: boolean) => void
}

const skillThumbnails: any = {
  GR: '/images/collections/clt-grammar-green.png',
  LI: '/images/collections/clt-listening-green.png',
  PR: '/images/collections/clt-pronunciation-green.png',
  RE: '/images/collections/clt-reading-green.png',
  SP: '/images/collections/clt-speaking-green.png',
  US: '/images/collections/clt-use-of-english-green.png',
  VO: '/images/collections/clt-vocab-green.png',
  WR: '/images/collections/clt-writing-green.png',
}

export const TemplateTable = ({
  className = '',
  currentPage,
  data,
  isLoading = false,
  style,
  onDelete,
  onStatusToggle,
}: Props) => {
  const router = useRouter()

  const [session] = useSession()

  const { globalModal } = useContext(WrapperContext)

  const checkCustomRight = () => {
    let check: any = null
    switch (router.query?.m) {
      case 'mine':
        check = [USER_ROLES.Teacher]
        break
      case 'teacher':
        check = []
        break
      default:
        check = [USER_ROLES.Operator]
        break
    }
    return userInRight(check, session)
  }

  const getSkills = (arr: any[]) => {
    const skillArr: any[] = []
    arr.forEach((parents) => {
      if (Array.isArray(parents) && parents.length > 0) {
        parents.forEach((children) => {
          if (!skillArr.includes(children)) skillArr.push(children)
        })
      }
    })
    return skillArr
  }

  return (
    <div className={`m-template-table ${className}`} style={style}>
      {isLoading && <Loader backdrop content="loading..." vertical />}
      <div className="__table" style={{ opacity: isLoading ? 0 : 1 }}>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>TÊN CẤU TRÚC</th>
              <th>KHỐI LỚP</th>
              <th>THỜI GIAN</th>
              <th>SỐ CÂU HỎI</th>
              <th>ĐỀ THI ĐANG SỬ DỤNG</th>
              <th>SỐ KỸ NĂNG</th>
              <th>TRẠNG THÁI</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1 + (currentPage - 1) * 10}</td>
                  <td title={item?.name}>
                    <div className="__elipsis">{item?.name || '---'}</div>
                  </td>
                  <td
                    title={
                      GRADE_SELECTIONS.find(
                        (find: StructType) =>
                          find?.code === item?.templateLevelId,
                      )?.display || item?.templateLevelId
                    }
                  >
                    <div className="__elipsis">
                      {GRADE_SELECTIONS.find(
                        (find: StructType) =>
                          find?.code === item?.templateLevelId,
                      )?.display ||
                        item?.templateLevelId ||
                        '---'}
                    </div>
                  </td>
                  <td title={item?.time}>
                    <div className="__elipsis">{item?.time || '---'}</div>
                  </td>
                  <td title={item?.totalQuestions}>
                    <div className="__elipsis">
                      {item?.totalQuestions || '---'}
                    </div>
                  </td>
                  <td title={item?.totalUnitTests}>
                    <div className="__elipsis">
                      {item?.totalUnitTests || item?.totalUnitTests === 0
                        ? item.totalUnitTests
                        : '---'}
                    </div>
                  </td>
                  <td
                    title={getSkills(item.sections)
                      .map(
                        (item) =>
                          SKILLS_SELECTIONS.find((skill) => skill.code === item)
                            ?.display || item,
                      )
                      .join(', ')}
                  >
                    <Whisper
                      placement="leftStart"
                      trigger="click"
                      speaker={
                        <Popover>
                          <div className="m-unittest-template-table-data__section-popover">
                            {getSkills(item.sections).map(
                              (item: any, i: number) => (
                                <div key={i} className="section-item">
                                  <img src={skillThumbnails[item]} alt={item} />
                                  <span>
                                    {SKILLS_SELECTIONS.find(
                                      (skill) => skill.code === item,
                                    )?.display || item}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </Popover>
                      }
                    >
                      <span onClick={(e) => e.stopPropagation()}>
                        <span
                          style={{
                            color: '#6868AC',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          {getSkills(item.sections).length || 0}
                        </span>
                        <sup style={{ color: 'red' }}>*</sup>
                      </span>
                    </Whisper>
                  </td>
                  <td>
                    {checkCustomRight() ? (
                      <Toggle
                        checked={item?.status || false}
                        size="md"
                        onChange={() =>
                          checkCustomRight() &&
                          onStatusToggle &&
                          onStatusToggle(
                            item?.id || null,
                            !(item?.status || false),
                          )
                        }
                      />
                    ) : (
                      <img
                        src={
                          item?.status
                            ? '/images/icons/ic-check-circle.png'
                            : '/images/icons/ic-close-circle.png'
                        }
                        alt={item?.status ? 'active' : 'inactive'}
                        style={{
                          width: 24,
                          height: 24,
                          objectFit: 'contain',
                          objectPosition: 'center',
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <div className="__action-group">
                      <Whisper
                        placement="leftStart"
                        trigger="click"
                        speaker={
                          <Popover>
                            <div className="table-action-popover">
                              {checkCustomRight() && (
                                <div
                                  className="__item"
                                  onClick={() =>
                                    window.open(
                                      `/templates/${item.id}?mode=edit`,
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
                                  window.open(`/templates/${item.id}?mode=view`)
                                }
                              >
                                <FaEye />
                                <span>Xem</span>
                              </div>
                              {checkCustomRight() && (
                                <div
                                  className="__item"
                                  onClick={() =>
                                    globalModal.setState({
                                      id: 'confirm-modal',
                                      type: 'delete-template',
                                      content: {
                                        closeText: 'Quay lại',
                                        submitText: 'Xóa cấu trúc',
                                        onSubmit: () =>
                                          onDelete(item?.id || null),
                                      },
                                    })
                                  }
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
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
