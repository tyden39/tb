import { ReactNode, useContext } from 'react'

import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { FaEye, FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { GoKebabVertical } from 'react-icons/go'
import { Whisper, Popover, Button, Loader } from 'rsuite'

import useNoti from 'hooks/useNoti'
import { USER_ROLES } from 'interfaces/constants'
import { WrapperContext } from 'interfaces/contexts'
import { GRADE_SELECTIONS, SKILLS_SELECTIONS } from 'interfaces/struct'
import { DefaultPropsType, StructType } from 'interfaces/types'
import { userInRight } from 'utils'

import { formatDate } from '../../../utils/string'

interface Props extends DefaultPropsType {
  currentPage: number
  data: any[]
  isLoading?: boolean
  onDelete?: (id: number) => void
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

export const UnitTestTable = ({
  className = '',
  currentPage,
  data,
  isLoading = false,
  style,
  onDelete,
}: Props) => {
  const router = useRouter()

  const [session] = useSession()
  const { getNoti } = useNoti()

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

  const checkActive = (startDate: number | Date, endDate: number | Date) => {
    if (!startDate && !endDate) return false
    const d = new Date()
    const currentTime = d.setHours(0, 0, 0, 0)
    const startTime = startDate
      ? new Date(startDate).setHours(0, 0, 0, 0)
      : null
    const endTime = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null
    if (!startTime) return false
    if (!endTime) return startTime <= currentTime
    else return startTime <= currentTime && currentTime <= endTime
  }

  const handleCopyURL = (userId: string, id: number) => {
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = hostname === 'localhost' ? `:${window.location.port}` : ''
    const url = `${protocol}//${hostname}${port}/practice-test/${userId}===${id}`
    navigator.clipboard.writeText(url)
    getNoti('success', 'topEnd', 'Đã copy URL')
  }

  const handleDeleteUniTtest = (id: number) => {
    globalModal.setState({
      id: 'confirm-modal',
      type: 'delete-unit-test',
      content: {
        closeText: 'Quay lại',
        submitText: 'Xóa đề thi',
        onSubmit: () => onDelete(id),
      },
    })
  }

  const getSkills = (arr: any[]) => {
    const skillArr: any[] = []
    arr.forEach((parents) => {
      if (
        Array.isArray(parents?.name) &&
        parents?.name &&
        parents.name.length > 0
      ) {
        parents.name.forEach((children: any) => {
          if (!skillArr.includes(children)) skillArr.push(children)
        })
      }
    })
    return skillArr
  }

  return (
    <div className={`m-unit-test-table ${className}`} style={style}>
      {isLoading && <Loader backdrop content="loading..." vertical />}
      <div className="__table" style={{ opacity: isLoading ? 0 : 1 }}>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>TÊN ĐỀ THI</th>
              <th>KHỐI LỚP</th>
              <th>THỜI GIAN</th>
              <th>SỐ CÂU HỎI</th>
              <th>SỐ KỸ NĂNG</th>
              <th>NGÀY BẮT ĐẦU</th>
              <th>NGÀY KẾT THÚC</th>
              <th>TRẠNG THÁI</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data?.map((unitTest: any, index: number) => (
                <tr key={`unit-test_${index}`}>
                  <td>{index + 1 + (currentPage - 1) * 10}</td>
                  <td title={unitTest?.name}>
                    <div className="__elipsis">{unitTest?.name || '---'}</div>
                  </td>
                  <td
                    title={
                      GRADE_SELECTIONS.find(
                        (find: StructType) =>
                          find?.code === unitTest?.template_level_id,
                      )?.display || unitTest?.template_level_id
                    }
                  >
                    <div className="__elipsis">
                      {GRADE_SELECTIONS.find(
                        (find: StructType) =>
                          find?.code === unitTest?.template_level_id,
                      )?.display ||
                        unitTest?.template_level_id ||
                        '---'}
                    </div>
                  </td>
                  <td title={unitTest?.time}>
                    <div className="__elipsis">{unitTest?.time || '---'}</div>
                  </td>
                  <td title={unitTest?.total_question}>
                    <div className="__elipsis">
                      {unitTest?.total_question || '---'}
                    </div>
                  </td>
                  <td
                    title={getSkills(unitTest.sections)
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
                            {getSkills(unitTest.sections).map(
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
                          {getSkills(unitTest.sections).length || 0}
                        </span>
                        <sup style={{ color: 'red' }}>*</sup>
                      </span>
                    </Whisper>
                  </td>
                  <td
                    title={
                      unitTest?.start_date
                        ? formatDate(unitTest.start_date)
                        : null
                    }
                  >
                    <div className="__elipsis">
                      {unitTest?.start_date
                        ? formatDate(unitTest.start_date)
                        : '---'}
                    </div>
                  </td>
                  <td
                    title={
                      unitTest?.end_date ? formatDate(unitTest.end_date) : null
                    }
                  >
                    <div className="__elipsis">
                      {unitTest?.end_date
                        ? formatDate(unitTest.end_date)
                        : '---'}
                    </div>
                  </td>
                  <td>
                    <img
                      src={
                        checkActive(unitTest?.start_date, unitTest?.end_date)
                          ? '/images/icons/ic-check-circle.png'
                          : '/images/icons/ic-close-circle.png'
                      }
                      alt={
                        checkActive(unitTest?.start_date, unitTest?.end_date)
                          ? 'active'
                          : 'inactive'
                      }
                      style={{
                        width: 24,
                        height: 24,
                        objectFit: 'contain',
                        objectPosition: 'center',
                      }}
                    />
                  </td>
                  <td>
                    <div className="__action-group">
                      <Whisper
                        placement="leftStart"
                        trigger="click"
                        speaker={
                          <Popover>
                            <div className="table-action-popover">
                              <div
                                className="__item"
                                onClick={() =>
                                  handleCopyURL(
                                    unitTest?.created_by,
                                    unitTest?.id,
                                  )
                                }
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3.07692 0C1.38221 0 0 1.38221 0 3.07692V13.8462C0 15.5409 1.38221 16.9231 3.07692 16.9231H5.38462V15.3846H3.07692C2.22656 15.3846 1.53846 14.6965 1.53846 13.8462V3.07692C1.53846 2.22656 2.22656 1.53846 3.07692 1.53846H7.90865C8.02584 1.56851 8.125 1.63161 8.19712 1.70673C8.53065 1.61358 8.87019 1.53846 9.23077 1.53846H10.0481C9.05649 0.552885 8.38642 0 7.69231 0H3.07692ZM9.23077 2.30769C7.53606 2.30769 6.15385 3.6899 6.15385 5.38462V16.9231C6.15385 18.6178 7.53606 20 9.23077 20H16.9231C18.6178 20 20 18.6178 20 16.9231V8.46154C20 7.64423 19.2518 6.86899 17.9087 5.55288C17.7224 5.36959 17.521 5.16526 17.3317 4.97596C17.1424 4.78666 16.9381 4.60938 16.7548 4.42308C15.4387 3.07993 14.6635 2.30769 13.8462 2.30769H9.23077ZM9.23077 3.84615H14.0625C14.6184 3.98738 14.6154 4.65445 14.6154 5.33654V6.92308C14.6154 7.34675 14.9609 7.69231 15.3846 7.69231H16.9231C17.6893 7.69231 18.4615 7.69531 18.4615 8.46154V16.9231C18.4615 17.7734 17.7734 18.4615 16.9231 18.4615H9.23077C8.38041 18.4615 7.69231 17.7734 7.69231 16.9231V5.38462C7.69231 4.53425 8.38041 3.84615 9.23077 3.84615ZM15.024 9.30289C14.5433 9.32692 14.0835 9.52224 13.726 9.87981L12.7644 10.8654C12.9838 10.643 13.7921 10.7873 13.9904 10.9856L14.399 10.5529C14.5883 10.3666 14.8317 10.2524 15.0721 10.2404C15.2344 10.2314 15.4688 10.2764 15.6731 10.4808C15.8624 10.6731 15.9135 10.8834 15.9135 11.0337C15.9135 11.2861 15.7993 11.5565 15.601 11.7548L13.8221 13.5096C13.4525 13.8792 12.8756 13.9333 12.5481 13.6058C12.3618 13.4195 12.0613 13.4195 11.875 13.6058C11.6887 13.7921 11.6887 14.0925 11.875 14.2788C12.2115 14.6154 12.6683 14.7837 13.125 14.7837C13.6178 14.7837 14.1076 14.5944 14.4952 14.2067L16.274 12.4279C16.6496 12.0523 16.875 11.5385 16.875 11.0337C16.875 10.5679 16.6767 10.1382 16.3462 9.80769C15.9946 9.45613 15.5228 9.28185 15.024 9.30289ZM12.9087 11.4904C12.4159 11.4904 11.9231 11.7037 11.5385 12.0913L9.87981 13.726C9.50421 14.1016 9.27885 14.6154 9.27885 15.1202C9.27885 15.5889 9.47716 16.0156 9.80769 16.3462C10.1623 16.6977 10.628 16.875 11.1298 16.851C11.6076 16.8269 12.0703 16.6316 12.4279 16.274L13.2692 15.4087C13.0499 15.631 12.2416 15.4868 12.0433 15.2885L11.7548 15.601C11.5655 15.7873 11.3221 15.9014 11.0817 15.9135C10.9195 15.9225 10.6851 15.8774 10.4808 15.6731C10.2915 15.4838 10.2404 15.2704 10.2404 15.1202C10.2404 14.8678 10.3546 14.5974 10.5529 14.399L12.2115 12.7644C12.5841 12.3948 13.134 12.3438 13.4615 12.6683C13.6478 12.8546 13.9724 12.8546 14.1587 12.6683C14.345 12.482 14.345 12.1815 14.1587 11.9952C13.8221 11.6587 13.3654 11.4904 12.9087 11.4904Z"
                                    fill="#1E1E1F"
                                  />
                                </svg>
                                <span>Copy URL</span>
                              </div>
                              {checkCustomRight() && (
                                <div
                                  className="__item"
                                  onClick={() =>
                                    window.open(
                                      `/unit-test/${unitTest.id}?mode=edit`,
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
                                    `/unit-test/${unitTest.id}?mode=view`,
                                  )
                                }
                              >
                                <FaEye />
                                <span>Xem</span>
                              </div>
                              {checkCustomRight() && (
                                <div
                                  className="__item"
                                  onClick={() =>
                                    handleDeleteUniTtest(unitTest.id)
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
