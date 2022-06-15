import { CSSProperties, useContext, useRef, useState } from 'react'

import { Button } from 'rsuite'

import { templateDetailTransform } from 'api/dataTransform'
import { paths } from 'api/paths'
import { callApi, getApiPath } from 'api/utils'
import { Block } from 'components/atoms/block'
import {
  TemplateDataType,
  TemplateDetailApiType,
  TemplateListItemType,
} from 'interfaces/types'

import { UnitTestContext } from '../../../interfaces/contexts'

type PropsType = {
  className?: string
  style?: CSSProperties
}

type ItemPropsType = {
  index: number
  data: TemplateListItemType
  onTriggerReady: () => void
}

export const TemplatePicker = ({ className = '', style }: PropsType) => {
  const { templateData, templateDetailData, step } = useContext(UnitTestContext)

  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false)

  const table = useRef<HTMLDivElement>(null)

  const handleSubmit = async () => {
    if (!table?.current) return
    const checkedRadio: HTMLInputElement = table.current.querySelector(
      'input[name="template"]:checked',
    )
    if (checkedRadio) {
      const value: string = checkedRadio.value
      const template = templateData.filter(
        (item: TemplateListItemType) => item.id === parseInt(value),
      )
      if (template[0]) {
        const templateApiDetail: any = await callApi(
          getApiPath(paths.api_templates + `/${value}`),
          'GET',
        )
        const templateDetail: TemplateDataType | null = templateApiDetail?.data
          ? templateDetailTransform(templateApiDetail.data)
          : null
        if (templateDetail) {
          templateDetailData.setState(templateDetail)
          step.setState(1)
        }
      }
    }
  }

  return (
    <Block
      className={`o-template-picker ${className}`}
      title="Choose a template"
      style={style}
    >
      <div className={`m-template-table ${className}`} style={style}>
        <div ref={table} className="__table">
          <div className="__thead">
            <div className="__tr">
              <div className="__th" style={{ flex: 1 }}></div>
              <div className="__th" style={{ flex: 1 }}>
                #
              </div>
              <div className="__th" style={{ flex: 22 }}>
                TEMPLATE NAME
              </div>
            </div>
          </div>
          <div className="__tbody">
            {templateData.map((item: TemplateListItemType, i: number) => (
              <Item
                key={i}
                index={i}
                data={item}
                onTriggerReady={() =>
                  !isReadyToSubmit && setIsReadyToSubmit(true)
                }
              />
            ))}
          </div>
        </div>
      </div>
      <div className="__picker-footer">
        <Button
          className={`__btn ${isReadyToSubmit ? '' : '--disabled'}`}
          disabled={isReadyToSubmit ? false : true}
          onClick={() => handleSubmit()}
        >
          Next
        </Button>
      </div>
    </Block>
  )
}

const Item = ({ index, data, onTriggerReady }: ItemPropsType) => {
  const radio = useRef<HTMLInputElement>(null)

  return (
    <div
      className="__tr"
      onClick={() => {
        onTriggerReady()
        if (radio?.current) radio.current.click()
      }}
    >
      <div className="__td" style={{ flex: 1 }}>
        <input ref={radio} type="radio" name="template" value={data.id} />
      </div>
      <div className="__td" style={{ flex: 1 }}>
        {index + 1}
      </div>
      <div className="__td" style={{ flex: 23 }}>
        {data.name}
      </div>
    </div>
  )
}
