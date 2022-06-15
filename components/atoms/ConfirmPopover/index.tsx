import { Message, Popover, Whisper } from 'rsuite'

interface PropsType {
  children: React.ReactElement
  controlId?: string
  title: string
  message: string
  data?: any
  onSubmit: (data: any) => void
}

export const ConfirmPopover = ({
  children,
  title,
  message,
  controlId,
  data,
  onSubmit,
}: PropsType) => {
  return (
    <Whisper
      controlId={controlId}
      placement="leftStart"
      trigger="click"
      speaker={(props: any, ref: any) => {
        const { className, left, top, onClose } = props
        return (
          <Popover
            title={title}
            style={{ top, left }}
            className={className}
            ref={ref}
          >
            <div style={{ maxWidth: 150, marginBottom: 12 }}>{message}</div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  marginLeft: 12,
                  color: '#d12f1d',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  onSubmit(data)
                  onClose()
                }}
              >
                Đồng ý
              </span>
              <span
                style={{
                  marginLeft: 12,
                  color: '#6a6f76',
                  cursor: 'pointer',
                }}
                onClick={onClose}
              >
                Hủy
              </span>
            </div>
          </Popover>
        )
      }}
    >
      {children}
    </Whisper>
  )
}
