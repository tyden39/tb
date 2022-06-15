import React, { ReactNode, useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/dist/client/router'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { GoKebabVertical } from 'react-icons/go'
import {
  Button,
  toaster,
  Message,
  Pagination,
  Loader,
  Toggle,
  Whisper,
  Tooltip,
  Popover,
} from 'rsuite'

import { paths } from 'api/paths'
import { StickyFooter } from 'components/organisms/stickyFooter'
import { WrapperContext } from 'interfaces/contexts'
import { useUsers } from 'lib/swr-hook'

import { UserDataType } from '../../../interfaces/types'

export const UserTable = ({
  className = '',
  style,
  dataFilter,
}: any) => {
  const router = useRouter()
  const pageSize = 10
  const { globalModal } = useContext(WrapperContext)

  const [pageIndex, setPageIndex] = useState(0)
  const [filter, setFilter] = useState({
    name: '',
    role: '',
    status: '',
  })
  const { users, isLoading, totalRecords, mutateUsers } = useUsers(
    pageIndex,
    pageSize,
    filter,
  )

  useEffect(() => {
    setFilter(dataFilter)
  }, [dataFilter])

  const onChangeStatus = async (user: UserDataType) => {
    const res = await fetch(`${paths.api_users}/${user.id}`, {
      method: 'PUT',
    })
    const json = await res.json()

    if (json) {
      toaster.push(
        <Message showIcon type="success">
          Change status successful
        </Message>,
      )

      mutateUsers()
    }
  }

  const onDeleteUser = async (user: UserDataType) => {
    globalModal.setState({
      id: 'confirm-modal',
      type: 'delete-user',
      content: {
        closeText: 'Quay lại',
        submitText: 'Xóa',
        onSubmit: () => onDelete(user),
      },
    })
  }

  const onDelete = async (user: UserDataType) => {
    const res = await fetch(`${paths.api_users}/${user.id}`, {
      method: 'DELETE',
    })
    const json = await res.json()

    if (json) {
      toaster.push(
        <Message showIcon type="success">
          Delete successful
        </Message>,
      )

      mutateUsers()
    }
  }

  return (
    <>
      <div className={`m-user-table ${className}`} style={style}>
        {isLoading && <Loader backdrop content="loading..." vertical />}
        <table>
          <thead>
            <tr>
              <th className="head-stt" style={{ width: '5%' }}>
                STT
              </th>
              <th
                className="head-name"
                style={{ width: 'calc((65% - 6rem) / 2)' }}
              >
                TÊN NGƯỜI DÙNG
              </th>
              <th
                className="head-name"
                style={{ width: 'calc((65% - 6rem) / 2)' }}
              >
                EMAIL
              </th>
              <th className="head-role" style={{ width: '15%' }}>
                VAI TRÒ
              </th>
              <th className="head-status" style={{ width: '15%' }}>
                TRẠNG THÁI
              </th>
              <th className="head-action" style={{ width: '6rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user, index) => (
                <tr key={user.id}>
                  <td className="col-stt">{index + 1}</td>
                  <td className="col-name" title={user?.user_name}>
                    <div className="__elipsis">{user?.user_name || '---'}</div>
                  </td>
                  <td className="col-email" title={user?.email}>
                    <div className="__elipsis">{user?.email || '---'}</div>
                  </td>
                  <td
                    className="col-role"
                    title={user.is_admin === 1 ? 'Admin' : user?.user_role_name}
                  >
                    <div className="__elipsis">
                      {user.is_admin === 1
                        ? 'Admin'
                        : user?.user_role_name || '---'}
                    </div>
                  </td>
                  <td className="col-status">
                    <Toggle
                      checked={user.deleted === 0}
                      onChange={() => onChangeStatus(user)}
                    />
                  </td>
                  <td className="col-action">
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
                                  router.push(
                                    '/users/[userSlug]',
                                    `/users/${user.id}`,
                                  )
                                }
                              >
                                <FaPencilAlt />
                                <span>Chỉnh sửa</span>
                              </div>
                              <div
                                className="__item"
                                onClick={() => onDeleteUser(user)}
                              >
                                <FaTrashAlt />
                                <span>Xoá</span>
                              </div>
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
            {users && users.length === 0 && (
              <tr>
                <td colSpan={5}>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalRecords > 0 && (
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
              activePage={pageIndex + 1}
              onChangePage={(page) => {
                setPageIndex(page - 1)
              }}
            />
          </div>
        </StickyFooter>
      )}
    </>
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
