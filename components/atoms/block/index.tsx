import React, { CSSProperties, ReactNode, useState } from 'react'

import { Collapse } from 'react-collapse'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsChevronDown } from 'react-icons/bs'
import { Tooltip, Whisper } from 'rsuite'

type BlockPropsType = {
  className?: string
  defaultShow?: boolean
  title?: string
  style?: CSSProperties
  onDelete?: () => void
  children?: ReactNode
}

type TitlePropsType = {
  className?: string
  show: boolean
  style?: CSSProperties
  onClick?: (boo: boolean) => void | undefined
  onDelete?: () => void | null
  children?: ReactNode
}

export const Block = ({
  className = '',
  defaultShow = true,
  title,
  style,
  onDelete,
  children,
}: BlockPropsType) => {
  const [isShow, setIsShow] = useState(defaultShow)

  return (
    <div className={`a-block ${className}`} style={style}>
      {title && (
        <BlockTitle
          show={isShow}
          onClick={() => setIsShow(!isShow)}
          onDelete={onDelete}
        >
          {title}
        </BlockTitle>
      )}
      <Collapse isOpened={isShow}>
        <div className="__content">{children}</div>
      </Collapse>
    </div>
  )
}

export const BlockTitle = ({
  className = '',
  show = true,
  style,
  onClick,
  onDelete,
  children,
}: TitlePropsType) => {
  return (
    <div
      className={`a-block-title ${className}`}
      style={style}
      onClick={() => onClick && onClick(!show)}
    >
      <h5>{children}</h5>
      {onDelete && (
        <Whisper
          placement="top"
          controlId="control-id-hover"
          trigger="hover"
          speaker={<Tooltip>Delete this section</Tooltip>}
        >
          <AiOutlinePlus
            className="__delete"
            onClick={(e: React.MouseEvent<SVGAElement>) => {
              e.stopPropagation()
              onDelete()
            }}
          />
        </Whisper>
      )}
      <BsChevronDown
        className="__arrow"
        style={{ transform: `translateY(-50%) rotate(${show ? 180 : 0}deg)` }}
      />
    </div>
  )
}
