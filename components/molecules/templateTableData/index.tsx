import { ReactNode, useContext, useRef, useState } from 'react'

import { useRouter } from 'next/dist/client/router'
import { Button, Pagination, Popover, Radio, Whisper } from 'rsuite'

import { templateListTransformData } from 'api/dataTransform'
import { TEMPLATE_TABLE_COL_DATA } from 'interfaces/constants'
import { SingleTemplateContext } from 'interfaces/contexts'
import { GRADE_SELECTIONS } from 'interfaces/struct'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  title: string
  content?: ReactNode
  data: any[]
  total: number
  pageIndex: number
  mode?: 'default' | 'createUnittest'
}

export const TemplateTableData = ({
  className = '',
  title,
  content,
  data,
  total,
  pageIndex,
  mode = 'default',
  style,
}: PropsType) => {
  const [tableData, setTableData] = useState(data)
  const [activePage, setActivePage] = useState(pageIndex + 1)
  const [totalPage, setTotalPage] = useState(total)

  const handlePageChange = async (page: number) => {
    await fetch(`/api/templates?page=${page > 0 ? page - 1 : 0}`, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (res.status === 200) return res.json()
      })
      .then((result) => {
        const newData = result.templates.map(templateListTransformData)
        setTableData([...newData])
        setTotalPage(result.totalPages)
        setActivePage(page)
      })
  }

  return (
    <div
      className={`m-template-table-data ${className}`}
      title={title}
      style={style}
    >
      <div className="m-template-table-data__container">
        <table>
          <thead>
            <tr>
              {mode === 'createUnittest' && <th style={{ width: '5%' }}></th>}
              <th style={{ width: '5%' }}>#</th>
              {TEMPLATE_TABLE_COL_DATA.map((th: any) => (
                <th
                  key={th.id}
                  style={{
                    width: `${mode === 'createUnittest' ? 'unset' : th.width}%`,
                    textAlign: th.align,
                  }}
                >
                  {th.name}
                </th>
              ))}
              {mode !== 'createUnittest' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {tableData.map((tr, i) => (
              <RowItem
                key={tr.id}
                index={i}
                activePage={activePage}
                data={tr}
                handlePageChange={handlePageChange}
                mode={mode}
              />
            ))}
          </tbody>
        </table>
      </div>
      {total > 0 && (
        <div className="m-template-table-data__pagination">
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
        </div>
      )}
    </div>
  )
}

const RowItem = ({ index, activePage, data, handlePageChange, mode }: any) => {
  const router = useRouter()

  const contextData = useContext(SingleTemplateContext)

  const chosenTemplate = contextData?.chosenTemplate

  const popover = useRef<any>(null)

  const onEdit = (id: any) =>
    router.push('/templates/[templateSlug]', '/templates/' + id)

  const onRemove = async (id: any) => {
    await fetch('/api/templates/' + id, {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res?.status === 200) handlePageChange(activePage)
    })
  }

  return (
    <tr
      onClick={() =>
        mode === 'createUnittest' && chosenTemplate.setState({ id: data.id })
      }
    >
      {mode === 'createUnittest' && (
        <td>
          <Radio
            checked={chosenTemplate?.state?.id === data.id ? true : false}
            name="template"
          ></Radio>
        </td>
      )}
      <td>{(activePage - 1) * 10 + (index + 1)}</td>
      {TEMPLATE_TABLE_COL_DATA.map((td: any) => (
        <td key={td.id} style={{ textAlign: td.align }}>
          {td.property === 'templateLevelId' &&
            (GRADE_SELECTIONS.find((item) => item.code === data[td.property])
              ?.display ||
              data[td.property])}
          {!['templateLevelId'].includes(td.property) && data[td.property]}
        </td>
      ))}
      {mode !== 'createUnittest' && (
        <td>
          {onEdit && (
            <Button
              className="action-btn"
              appearance="link"
              data-role="detail"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(data.id)
              }}
            >
              Edit
            </Button>
          )}
          {onRemove && (
            <Whisper
              ref={popover}
              controlId={data.id}
              placement="leftEnd"
              trigger="click"
              speaker={
                <Popover title="Warning">
                  <div style={{ maxWidth: 150, marginBottom: 12 }}>
                    Are you sure you want to delete this template?
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        marginLeft: 12,
                        color: '#d12f1d',
                        cursor: 'pointer',
                      }}
                      onClick={() => onRemove(data.id)}
                    >
                      Delete
                    </span>
                    <span
                      style={{
                        marginLeft: 12,
                        color: '#6a6f76',
                        cursor: 'pointer',
                      }}
                      onClick={() => popover.current.close()}
                    >
                      Cancel
                    </span>
                  </div>
                </Popover>
              }
            >
              <Button
                className="action-btn"
                appearance="link"
                data-role="remove"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                Remove
              </Button>
            </Whisper>
          )}
        </td>
      )}
    </tr>
  )
}
